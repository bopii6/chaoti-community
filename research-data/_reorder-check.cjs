const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');

// 1. 定位"从聊天到 Agent"周的 lessons 数组
const weekKey = 'short: "从聊天到 Agent"';
const wkIdx = c.indexOf(weekKey);
if (wkIdx < 0) { console.error('周定位失败'); process.exit(1); }
const lessonsKey = 'lessons: [';
const lsIdx = c.indexOf(lessonsKey, wkIdx);
if (lsIdx < 0) { console.error('lessons 定位失败'); process.exit(1); }
const arrStart = lsIdx + lessonsKey.length; // 数组起始（跳过 'lessons: ['）
// 数组结束：从 arrStart 配平
let depth = 0, arrEnd = -1;
for (let i = arrStart; i < c.length; i++) {
  if (c[i] === '[') depth++;
  else if (c[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
}
const arrText = c.slice(arrStart, arrEnd);
console.log('lessons 数组长度:', arrText.length);

// 2. 提取每个 lesson 对象（配平 {}）
function extractObjects(text) {
  const objs = [];
  let i = 0;
  while (i < text.length) {
    const j = text.indexOf('{', i);
    if (j < 0) break;
    let d = 0, k = j;
    for (; k < text.length; k++) {
      if (text[k] === '{') d++;
      else if (text[k] === '}') { d--; if (d === 0) break; }
    }
    const obj = text.slice(j, k + 1);
    const titleM = obj.match(/title:\s*"([^"]+)"/);
    objs.push({ title: titleM ? titleM[1] : '(未知)', text: obj });
    i = k + 1;
  }
  return objs;
}
const objs = extractObjects(arrText);
console.log('现有课程数:', objs.length);
objs.forEach(o => console.log(' -', o.title.slice(0, 40)));

// 3. 按标题归类
const find = (t) => objs.find(o => o.title.includes(t));
const keep = (t) => objs.filter(o => !t.some(x => o.title.includes(x)));

const order = [
  '你的 AI 只会聊天',
  '给你的 AI 员工办入职',
  '提示词就是老板的能力',      // 第3课（原1.5，移到第3位）
  'Agent 智能体最佳搭配',
  '用 Agent 要花多少钱',
  'Agent 为什么总是跑偏',
  'GitHub：你的宝藏智能库'
];
const ordered = [];
for (const t of order) {
  const o = find(t);
  if (o) ordered.push(o);
  else console.error('未找到:', t);
}
console.log('重排后课程数:', ordered.length);
fs.writeFileSync('E:/超体社区/research-data/_week1-ordered.json', JSON.stringify(ordered.map(o => o.title), null, 1), 'utf8');
console.log('已存重排顺序（未写入，先核对）');
