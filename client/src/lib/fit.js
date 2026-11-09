// A4 at 96dpi — har measurement isi grid par set hai
export const PAGE_W = 794;
export const PAGE_H = 1123;

// offsetWidth transform ko ignore karta hai, isliye preview scale se farak nahi padta
function measure(el, size) {
  el.style.fontSize = size + "px";
  return el.offsetWidth;
}

export function applyFits(root) {
  if (!root) return;

  root.querySelectorAll("[data-fit-exact]").forEach((el) => {
    const [target, max] = el.dataset.fitExact.split(",").map(Number);
    if (!el.textContent.trim()) {
      el.style.fontSize = max + "px";
      return;
    }
    const w = measure(el, 100);
    if (w) el.style.fontSize = Math.min(max, (100 * target) / w).toFixed(2) + "px";
  });

  root.querySelectorAll("[data-fit-shrink]").forEach((el) => {
    const [target, base] = el.dataset.fitShrink.split(",").map(Number);
    if (!el.textContent.trim()) {
      el.style.fontSize = base + "px";
      return;
    }
    const w = measure(el, base);
    if (w > target) el.style.fontSize = ((base * target) / w).toFixed(2) + "px";
  });

  const title = root.querySelector("[data-fit-block]");
  if (title) {
    const [target, max] = title.dataset.fitBlock.split(",").map(Number);
    title.style.fontSize = "100px";
    let widest = 0;
    for (const line of title.children) widest = Math.max(widest, line.offsetWidth);
    const fs = widest ? Math.min(max, (100 * target) / widest) : max;
    title.style.fontSize = fs.toFixed(2) + "px";
    title.style.lineHeight = Math.min(40.8, fs * 1.14).toFixed(1) + "px";
  }
}

export function ribbonBackground() {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 426 94">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#fdfdfd"/><stop offset="1" stop-color="#d8d8d8"/></linearGradient>' +
    '<filter id="s" x="-20%" y="-20%" width="150%" height="160%">' +
    '<feDropShadow dx="4" dy="4" stdDeviation="2.4" flood-color="#000" flood-opacity="0.42"/>' +
    "</filter></defs><g filter=\"url(#s)\">" +
    '<polygon points="0,22 110,22 110,82 0,82 22,52" fill="url(#g)" stroke="#111" stroke-width="2"/>' +
    '<polygon points="420,22 310,22 310,82 420,82 398,52" fill="url(#g)" stroke="#111" stroke-width="2"/>' +
    '<rect x="52" y="2" width="313" height="65" fill="url(#g)" stroke="#111" stroke-width="2"/>' +
    "</g></svg>";
  return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
}
