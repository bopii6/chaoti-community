import { customerKey, isAdmin, json } from "../../_shared/auth.js";

export async function onRequestPost({ request, env }) {
  if (!(await isAdmin(request, env))) return json({ ok: false, message: "请先登录后台" }, 401);
  const { identifier } = await request.json().catch(() => ({}));
  if (!/^(1\d{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(String(identifier || "").trim())) return json({ ok: false, message: "请输入正确的手机号或邮箱" }, 400);
  return json({ ok: true, identifier: identifier.trim(), key: await customerKey(identifier, env.CUSTOMER_KEY_SECRET || env.ADMIN_MASTER_KEY) });
}
