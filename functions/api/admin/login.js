import { json, makeSession } from "../../_shared/auth.js";

export async function onRequestPost({ request, env }) {
  const { masterKey } = await request.json().catch(() => ({}));
  if (!env.ADMIN_MASTER_KEY || masterKey !== env.ADMIN_MASTER_KEY) return json({ ok: false, message: "后台主密钥不正确" }, 401);
  return json({ ok: true }, 200, { "set-cookie": `course_admin=${await makeSession(env.ADMIN_MASTER_KEY)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800` });
}
