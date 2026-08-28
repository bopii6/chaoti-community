import { accessRecordKey, isAdmin, json } from "../../_shared/auth.js";

export async function onRequestGet({ request, env }) {
  if (!(await isAdmin(request, env))) return json({ ok: false, message: "请先登录后台" }, 401);
  const listed = await env.COURSE_ACCESS_KV.list({ prefix: "access:" });
  const records = (await Promise.all(listed.keys.map(async (item) => env.COURSE_ACCESS_KV.get(item.name, "json")))).filter(Boolean).map(({ key, ...safe }) => safe);
  return json({ ok: true, records });
}

export async function onRequestDelete({ request, env }) {
  if (!(await isAdmin(request, env))) return json({ ok: false, message: "请先登录后台" }, 401);
  const { identifier } = await request.json().catch(() => ({}));
  if (!identifier) return json({ ok: false, message: "缺少手机号或邮箱" }, 400);
  const record = await env.COURSE_ACCESS_KV.get(accessRecordKey(identifier), "json");
  if (!record) return json({ ok: false, message: "找不到这条记录" }, 404);
  record.status = "revoked";
  record.updatedAt = new Date().toISOString();
  await env.COURSE_ACCESS_KV.put(accessRecordKey(identifier), JSON.stringify(record));
  return json({ ok: true });
}
