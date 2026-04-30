// API client for FastAPI /api — same-origin by default, or set window.NEXAPI_BASE = "https://api.example.com"
// Session: sessionStorage keys nexearn_access, nexearn_refresh, nexearn_user (JSON cache)

const AUTH_KEYS = { access: "nexearn_access", refresh: "nexearn_refresh", user: "nexearn_user" };

function getApiBase() {
  if (typeof window.NEXAPI_BASE === "string" && window.NEXAPI_BASE.length) {
    return window.NEXAPI_BASE.replace(/\/$/, "");
  }
  return "";
}

function _apiPath(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBase()}${p}`;
}

async function apiFetchJson(path, options = {}) {
  const { parseJson = true, ...init } = options;
  const r = await fetch(_apiPath(path), {
    ...init,
    headers: { Accept: "application/json", ...init.headers },
  });
  const text = await r.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = { detail: text }; }
  }
  if (!r.ok) {
    const d = (data && (data.detail || data.message)) || r.statusText;
    const err = new Error(typeof d === "string" ? d : JSON.stringify(d));
    err.status = r.status;
    err.body = data;
    throw err;
  }
  return parseJson ? data : text;
}

function saveSession({ access_token, refresh_token, expires_in }) {
  if (access_token) sessionStorage.setItem(AUTH_KEYS.access, access_token);
  if (refresh_token) sessionStorage.setItem(AUTH_KEYS.refresh, refresh_token);
  if (expires_in) {
    const expAt = Date.now() + (expires_in * 1000);
    sessionStorage.setItem("nexearn_access_exp", String(expAt));
  }
}

function clearSession() {
  sessionStorage.removeItem(AUTH_KEYS.access);
  sessionStorage.removeItem(AUTH_KEYS.refresh);
  sessionStorage.removeItem("nexearn_access_exp");
  sessionStorage.removeItem(AUTH_KEYS.user);
}

function getAccess() {
  return sessionStorage.getItem(AUTH_KEYS.access);
}

function getRefresh() {
  return sessionStorage.getItem(AUTH_KEYS.refresh);
}

function setUserCache(u) {
  if (u) sessionStorage.setItem(AUTH_KEYS.user, JSON.stringify(u));
  else sessionStorage.removeItem(AUTH_KEYS.user);
}

function getUserCache() {
  try {
    const s = sessionStorage.getItem(AUTH_KEYS.user);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

async function registerWorkspace({ email, password, tenant_name, tenant_slug }) {
  const body = { email, password, tenant_name, tenant_slug: tenant_slug || undefined };
  const data = await apiFetchJson("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  saveSession(data);
  setUserCache(null);
  return data;
}

async function loginWithPassword(username, password) {
  const body = new URLSearchParams({ username, password, grant_type: "password" });
  const r = await fetch(_apiPath("/api/auth/token"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const text = await r.text();
  let data = null;
  if (text) { try { data = JSON.parse(text); } catch { data = { detail: text }; } }
  if (!r.ok) {
    const d = (data && (data.detail || data.message)) || r.statusText;
    throw new Error(typeof d === "string" ? d : JSON.stringify(d));
  }
  saveSession(data);
  setUserCache(null);
  return data;
}

async function refreshTokens() {
  const rt = getRefresh();
  if (!rt) throw new Error("No refresh token");
  const data = await apiFetchJson("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: rt }),
  });
  saveSession(data);
  return data;
}

async function fetchMe() {
  const t = getAccess();
  if (!t) throw new Error("Not authenticated");
  return apiFetchJson("/api/auth/me", {
    headers: { Authorization: `Bearer ${t}` },
  });
}

async function ensureValidAccess() {
  const exp = Number(sessionStorage.getItem("nexearn_access_exp") || 0);
  if (getAccess() && exp > Date.now() + 60_000) return getAccess();
  if (getRefresh()) {
    try {
      await refreshTokens();
      return getAccess();
    } catch {
      clearSession();
      return null;
    }
  }
  return getAccess() || null;
}

async function logout() {
  const rt = getRefresh();
  const at = getAccess();
  const headers = { "Content-Type": "application/json" };
  if (at) headers.Authorization = `Bearer ${at}`;
  try {
    if (rt) {
      await fetch(_apiPath("/api/auth/logout"), {
        method: "POST",
        headers,
        body: JSON.stringify({ refresh_token: rt }),
      });
    }
  } catch { /* ignore */ }
  clearSession();
}

async function bootstrapSession() {
  if (!getAccess() && getRefresh()) {
    try { await refreshTokens(); } catch { clearSession(); return null; }
  }
  if (!getAccess()) return null;
  try {
    const me = await fetchMe();
    setUserCache(me);
    return me;
  } catch (e) {
    try {
      await refreshTokens();
      const me2 = await fetchMe();
      setUserCache(me2);
      return me2;
    } catch {
      clearSession();
      return null;
    }
  }
}

Object.assign(window, {
  NexApi: {
    getApiBase,
    registerWorkspace,
    loginWithPassword,
    refreshTokens,
    fetchMe,
    ensureValidAccess,
    logout,
    bootstrapSession,
    clearSession,
    getAccess,
    getRefresh,
    getUserCache,
    setUserCache,
  },
});
