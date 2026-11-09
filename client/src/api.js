const TOKEN_KEY = "nrec-token";

// VITE_API_URL khali ho to "/api" hi rehta hai (same-origin, single-service deploy).
// Set ho to us origin + "/api" use hota hai (split deploy — client Vercel par, API Render par).
const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "") + "/api";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage blocked */
  }
}

async function request(path, options = {}) {
  const headers = { Accept: "application/json", ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) headers.Authorization = "Bearer " + token;

  const url = BASE + path;
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        "Server se JSON nahi aaya (status " + res.status + ", url " + url + "). " +
          "VITE_API_URL check karo — shayad galat ya missing hai."
      );
    }
  }
  if (!res.ok) throw new Error((data && data.message) || "Request fail ho gayi (status " + res.status + ")");
  return data;
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request("/auth/me"),
  listTemplates: () => request("/templates"),
  createTemplate: (body) => request("/templates", { method: "POST", body: JSON.stringify(body) }),
  updateTemplate: (id, body) =>
    request("/templates/" + id, { method: "PUT", body: JSON.stringify(body) }),
  deleteTemplate: (id) => request("/templates/" + id, { method: "DELETE" }),
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return request("/upload", { method: "POST", body: fd });
  }
};
