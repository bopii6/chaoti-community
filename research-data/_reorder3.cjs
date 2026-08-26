const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');

function matchBracket(text, openIdx, openCh, closeCh) {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      i++;
      while (i < text.length && text[i] !== '"') { if (text[i] === '\\') i++; i++; }
      continue;
    }
    if (ch === openCh) depth++;
    else if (ch === closeCh) { depth--; if (depth === 0) return i; }
  }
  return -1;
}
function extractObjects(text) {
  const objs = [];
  let i = 0;
  while (i < text.length) {
    const j = text.indexOf('{', i);
    if (j < 0) break;
    const k = matchBracket(text, j, '{', '}');
    if (k < 0) break;
    const obj = text.slice(j, k + 1);
    const titleM = obj.match(/title:\s*"([^"]+)"/);
    objs.push({ title: titleM ? titleM[1] : '(未知)', text: obj });
    i = k + 1;
  }
  return objs;
}

const wkIdx = c.indexOf('short: "从聊天到 Agent"');
const lsIdx = c.indexOf('lessons: [', wkIdx);
const arrStart = lsIdx + 'lessons: ['.length - 1; // 指向 [ 本身
const arrEnd = matchBracket(c, arrStart, '[', ']');
console.log('arrLen:', arrEnd - arrStart);
const arrText = c.slice(arrStart + 1, arrEnd);
const objs = extractObjects(arrText);
console.log('现有课程数:', objs.length);
objs.forEach(o => console.log(' -', o.title.slice(0, 45)));

const order = ['你的 AI 只会聊天','给你的 AI 员工办入职','提示词就是老板的能力','Agent 智能体最佳搭配','用 Agent 要花多少钱','Agent 为什么总是跑偏','GitHub：你的宝藏智能库'];
const ordered = [], miss = [];
for (const t of order) {
  const o = objs.find(x => x.title.includes(t));
  if (o) ordered.push(o); else miss.push(t);
}
console.log('重排:', ordered.length, '缺失:', miss.join(', ') || '无');
fs.writeFileSync('E:/超体社区/research-data/_week1-ordered.json', JSON.stringify(ordered.map(o => o.title), null, 1), 'utf8');
console.log('OK');
