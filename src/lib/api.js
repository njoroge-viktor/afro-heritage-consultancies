import { useCallback, useEffect, useState } from "react";

/**
 * No backend: all data is read from /db.json (public/db.json), served as a
 * static file. The API below mimics the json-server calls the app used
 * (GET with filters/sort/limit, POST, PATCH, DELETE) but runs in the browser.
 *
 * Writes can't change a static file, so they are stored in this browser's
 * localStorage on top of db.json:
 *  - programs / events edited in the admin are kept locally until staff export
 *    a new db.json (Admin → "Export db.json") and redeploy it;
 *  - if db.json changes (a new deploy), local program/event edits are dropped so
 *    the published file wins;
 *  - enrollments / messages are kept locally (they also go to AHC via WhatsApp).
 */

const DB_URL = "/db.json";
const KEY = (c) => `ahc-db:${c}`;
const EVT = "ahc-db-change";
const PUBLISHED = new Set(["programs", "events"]);

let dbPromise = null;
function loadDb() {
  dbPromise ??= fetch(DB_URL, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(`Couldn't load db.json (${r.status})`);
    return r.json();
  });
  return dbPromise.catch((e) => {
    dbPromise = null; // allow retry
    throw e;
  });
}

// Small, stable hash so we can tell when the published db.json has changed.
const hash = (v) => {
  const s = JSON.stringify(v ?? []);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
};

function readLocal(c) {
  try {
    return JSON.parse(localStorage.getItem(KEY(c)) || "null");
  } catch {
    return null;
  }
}

async function getCollection(c) {
  const db = await loadDb();
  if (!(c in db)) throw new Error(`Unknown collection "${c}"`);
  const local = readLocal(c);
  if (local && (!PUBLISHED.has(c) || local.base === hash(db[c]))) return structuredClone(local.rows);
  if (local) localStorage.removeItem(KEY(c)); // published file changed → it wins
  return structuredClone(db[c]);
}

async function saveCollection(c, rows) {
  const db = await loadDb();
  try {
    localStorage.setItem(KEY(c), JSON.stringify({ base: hash(db[c]), rows }));
  } catch {
    throw new Error("Couldn't save — browser storage is full or blocked.");
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: c }));
}

/** Parse "/programs/3?active=true&_sort=date" → { c, id, params } */
function parse(path) {
  const [p, qs = ""] = path.split("?");
  const [, c, id] = p.split("/");
  return { c, id: id === undefined ? undefined : Number(id), params: new URLSearchParams(qs) };
}

// json-server-style query: field=value, field_gte, field_lte, field_ne, _sort, _order, _limit
function query(rows, params) {
  let out = rows;
  for (const [k, v] of params) {
    if (k.startsWith("_")) continue;
    const m = k.match(/^(.*)_(gte|lte|ne)$/);
    const field = m ? m[1] : k;
    const op = m?.[2];
    out = out.filter((r) => {
      const val = String(r[field]);
      if (op === "gte") return val >= v;
      if (op === "lte") return val <= v;
      if (op === "ne") return val !== v;
      return val === v;
    });
  }
  const sort = params.get("_sort");
  if (sort) {
    const dir = params.get("_order") === "desc" ? -1 : 1;
    out = [...out].sort((a, b) => (a[sort] > b[sort] ? dir : a[sort] < b[sort] ? -dir : 0));
  }
  const limit = Number(params.get("_limit"));
  return limit > 0 ? out.slice(0, limit) : out;
}

export const api = {
  async get(path) {
    const { c, id, params } = parse(path);
    const rows = await getCollection(c);
    if (id !== undefined) {
      const row = rows.find((r) => r.id === id);
      if (!row) throw new Error("Not found");
      return row;
    }
    return query(rows, params);
  },
  async post(path, body) {
    const { c } = parse(path);
    const rows = await getCollection(c);
    const row = { ...body, id: rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1 };
    await saveCollection(c, [...rows, row]);
    return row;
  },
  async patch(path, body) {
    const { c, id } = parse(path);
    const rows = await getCollection(c);
    if (!rows.some((r) => r.id === id)) throw new Error("Not found");
    const next = rows.map((r) => (r.id === id ? { ...r, ...body, id } : r));
    await saveCollection(c, next);
    return next.find((r) => r.id === id);
  },
  async del(path) {
    const { c, id } = parse(path);
    const rows = await getCollection(c);
    await saveCollection(c, rows.filter((r) => r.id !== id));
    return null;
  },
};

/** Everything currently visible in this browser: db.json + local changes. */
export async function exportDb() {
  const db = await loadDb();
  const out = {};
  for (const c of Object.keys(db)) out[c] = await getCollection(c);
  return out;
}

/** Load a previously exported db.json into this browser (e.g. to move data between devices). */
export async function importDb(data) {
  const db = await loadDb();
  const known = Object.keys(db).filter((c) => Array.isArray(data?.[c]));
  if (!known.length) throw new Error("That file doesn't look like an AHC db.json export.");
  for (const c of known) localStorage.setItem(KEY(c), JSON.stringify({ base: hash(db[c]), rows: data[c] }));
  window.dispatchEvent(new CustomEvent(EVT, { detail: "*" }));
  return known;
}

/** Throw away this browser's local changes and go back to the published db.json. */
export async function resetLocalData() {
  const db = await loadDb();
  for (const c of Object.keys(db)) localStorage.removeItem(KEY(c));
  window.dispatchEvent(new CustomEvent(EVT, { detail: "*" }));
}

/** True if this browser has unexported program/event edits. */
export async function hasLocalEdits() {
  const db = await loadDb();
  return [...PUBLISHED].some((c) => {
    const l = readLocal(c);
    return l && l.base === hash(db[c]);
  });
}

/** Fetch a resource and expose { data, loading, error, reload }. Refreshes when that collection changes. */
export function useResource(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    if (!path) return;
    setState((s) => ({ ...s, loading: s.data === null, error: null }));
    try {
      const data = await api.get(path);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  }, [path]);

  useEffect(() => {
    load();
    const c = parse(path || "").c;
    const onChange = (e) => (e.detail === c || e.detail === "*") && load();
    const onStorage = (e) => e.key === KEY(c) && load(); // other tabs
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [load, path]);

  return { ...state, reload: load };
}

/** Seats left = capacity minus requests marked "enrolled" for that program. */
export function seatsLeft(program, enrollments = []) {
  if (!program?.capacity) return null;
  const taken = enrollments.filter((e) => e.programId === program.id && e.status === "enrolled").length;
  return Math.max(0, program.capacity - taken);
}
