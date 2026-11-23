/**
 * Font icons: Bootstrap Icons (bi) + Font Awesome (fa).
 * Each export is a tiny component so icons can be passed around like
 * components (e.g. [IcClock, "Label"]). A Tailwind height class such as
 * "tw:h-5" also sets the glyph size, so existing sizing keeps working.
 */
function make(iconClass) {
  function Icon({ className = "", style, ...rest }) {
    const m = className.match(/(?:^|\s)tw:h-(\d+(?:\.\d+)?)(?:\s|$)/);
    const size = m ? `${parseFloat(m[1]) * 0.25}rem` : undefined;
    return <i aria-hidden="true" className={`ficon ${iconClass} ${className}`} style={size ? { fontSize: size, ...style } : style} {...rest} />;
  }
  Icon.displayName = iconClass;
  return Icon;
}

const bi = (name) => make(`bi bi-${name}`);
const fa = (name, style = "solid") => make(`fa-${style} fa-${name}`);

export const IcArrowRight = bi("arrow-right");
export const IcArrowLeft = bi("arrow-left");
export const IcBookOpen = bi("book");
export const IcCalendarDays = bi("calendar3");
export const IcCalendarPlus = bi("calendar-plus");
export const IcCheck = bi("check-lg");
export const IcCircleAlert = bi("exclamation-circle");
export const IcCircleCheck = bi("check-circle");
export const IcClock = bi("clock");
export const IcCoffee = bi("cup-hot");
export const IcDownload = bi("download");
export const IcExternalLink = bi("box-arrow-up-right");
export const IcGraduationCap = bi("mortarboard");
export const IcHandshake = fa("handshake");
export const IcHeart = bi("heart");
export const IcInbox = bi("inbox");
export const IcInfo = bi("info-circle");
export const IcLightbulb = bi("lightbulb");
export const IcListChecks = bi("list-check");
export const IcLoaderCircle = bi("arrow-repeat");
export const IcLock = bi("lock");
export const IcLogOut = bi("box-arrow-right");
export const IcMail = bi("envelope");
export const IcMailOpen = bi("envelope-open");
export const IcMapPin = bi("geo-alt");
export const IcMenu = bi("list");
export const IcMountain = fa("mountain-sun");
export const IcPencil = bi("pencil");
export const IcPhone = bi("telephone");
export const IcPhoneCall = bi("telephone-outbound");
export const IcPlus = bi("plus-lg");
export const IcRefreshCw = bi("arrow-clockwise");
export const IcSearch = bi("search");
export const IcSend = bi("send");
export const IcShieldCheck = bi("shield-check");
export const IcSprout = fa("seedling");
export const IcStickyNote = bi("sticky");
export const IcTarget = bi("bullseye");
export const IcTimer = bi("stopwatch");
export const IcTrash2 = bi("trash3");
export const IcTriangleAlert = bi("exclamation-triangle");
export const IcUsers = bi("people");
export const IcVideo = bi("camera-video");
export const IcWallet = bi("wallet2");
export const IcWifi = bi("wifi");
export const IcX = bi("x-lg");
export const IcSun = bi("sun");
export const IcMoon = bi("moon-stars");
export const IcQuote = bi("quote");
export const IcWhatsapp = fa("whatsapp", "brands");
