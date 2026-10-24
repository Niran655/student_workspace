export const ACCESSIBILITY_KEY = "uniforge.accessibility";
export const defaultAccessibility = { textScale: 100, reduceMotion: false, underlineLinks: false };

export const loadAccessibility = () => {
  try {
    return { ...defaultAccessibility, ...JSON.parse(localStorage.getItem(ACCESSIBILITY_KEY) || "{}") };
  } catch {
    return defaultAccessibility;
  }
};

const setStyle = (id, css) => {
  let el = document.getElementById(id);
  if (!css) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("style");
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = css;
};

/** Call once at app start (main.jsx) and whenever the preferences change. */
export const applyAccessibility = (prefs = loadAccessibility()) => {
  document.documentElement.style.fontSize = `${prefs.textScale}%`;
  setStyle(
    "uf-reduce-motion",
    prefs.reduceMotion
      ? "*,*::before,*::after{animation-duration:0.001ms!important;animation-iteration-count:1!important;transition-duration:0.001ms!important;scroll-behavior:auto!important}"
      : ""
  );
  setStyle("uf-underline-links", prefs.underlineLinks ? "a{text-decoration:underline!important}" : "");
};