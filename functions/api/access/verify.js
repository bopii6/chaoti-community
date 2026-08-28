import { accessRecordKey, json } from "../../_shared/auth.js";

export async function onRequestPost({ request, env }) {
  const { identifier, key } = await request.json().catch(() => ({}));
  if (!identifier || !key) return json({ ok: false }, 400);
  if (env.COURSE_ACCESS_KV) {
    const record = await env.COURSE_ACCESS_KV.get(accessRecordKey(identifier), "json");
    return json({ ok: Boolean(record && record.status === "active" && record.key === key.trim()) });
  }
  return json({ ok: false });
}
