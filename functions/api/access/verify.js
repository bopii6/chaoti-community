import { customerKey, json } from "../../_shared/auth.js";

export async function onRequestPost({ request, env }) {
  const { identifier, key } = await request.json().catch(() => ({}));
  if (!identifier || !key) return json({ ok: false }, 400);
  const expected = await customerKey(identifier, env.CUSTOMER_KEY_SECRET || env.ADMIN_MASTER_KEY);
  return json({ ok: key.trim() === expected });
}
