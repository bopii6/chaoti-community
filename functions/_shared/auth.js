const encoder = new TextEncoder();

function encode(value) {
  return btoa(String.fromCharCode(...encoder.encode(value))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return new TextDecoder().decode(Uint8Array.from(atob(normalized + "=".repeat((4 - normalized.length % 4) % 4)), (c) => c.charCodeAt(0)));
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return encode(String.fromCharCode(...new Uint8Array(signature)));
}

export async function makeSession(secret) {
  const payload = encode(JSON.stringify({ role: "admin", exp: Date.now() + 8 * 60 * 60 * 1000 }));
  return `${payload}.${await sign(payload, secret)}`;
}

export async function isAdmin(request, env) {
  const cookie = request.headers.get("Cookie") || "";
  const token = cookie.match(/course_admin=([^;]+)/)?.[1];
  if (!token || !env.ADMIN_MASTER_KEY) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !(await sign(payload, env.ADMIN_MASTER_KEY)).startsWith(signature)) return false;
  try { return JSON.parse(decode(payload)).role === "admin" && JSON.parse(decode(payload)).exp > Date.now(); } catch { return false; }
}

export async function customerKey(identifier, secret) {
  return `AI-${(await sign(identifier.trim().toLowerCase(), secret)).slice(0, 22).toUpperCase()}`;
}

export function accessRecordKey(identifier) {
  return `access:${encodeURIComponent(identifier.trim().toLowerCase())}`;
}

export function randomCustomerKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return `AI-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", ...headers } });
}
