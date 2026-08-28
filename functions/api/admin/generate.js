import { accessRecordKey, isAdmin, json, randomCustomerKey } from "../../_shared/auth.js";

export async function onRequestPost({ request, env }) {
  if (!(await isAdmin(request, env))) return json({ ok: false, message: "请先登录后台" }, 401);
  const { identifier } = await request.json().catch(() => ({}));
  if (!/^(1\d{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(String(identifier || "").trim())) return json({ ok: false, message: "请输入正确的手机号或邮箱" }, 400);
  if (!env.COURSE_ACCESS_KV) return json({ ok: false, message: "授权存储尚未配置" }, 500);
  const normalized = identifier.trim().toLowerCase();
  const key = randomCustomerKey();
  const now = new Date().toISOString();
  await env.COURSE_ACCESS_KV.put(accessRecordKey(normalized), JSON.stringify({ identifier: normalized, key, status: "active", createdAt: now, updatedAt: now }));
  return json({ ok: true, identifier: normalized, key });
}
