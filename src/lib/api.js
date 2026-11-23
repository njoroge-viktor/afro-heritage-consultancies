import { useCallback, useEffect, useState } from "react";

// json-server base URL. In dev Vite proxies /api → http://localhost:3001.
// In production set VITE_API_URL to wherever json-server (db.json) is hosted.
const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};

/** Fetch a json-server resource and expose { data, loading, error, reload }. */
export function useResource(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    if (!path) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await api.get(path);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}

/** Seats left = capacity minus requests marked "enrolled" for that program. */
export function seatsLeft(program, enrollments = []) {
  if (!program?.capacity) return null;
  const taken = enrollments.filter((e) => e.programId === program.id && e.status === "enrolled").length;
  return Math.max(0, program.capacity - taken);
}
