const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');
function matchBracket(text, openIdx, openCh, closeCh) {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') { i++; while (i < text.length && text[i] !== '"') { if (text[i] === '\\') i++; i++; } continue; }
    if (ch === openCh) depth++;
    else if (ch === closeCh) { depth--; if (depth === 0) return i; }
  }
  return -1;
}
function extractObjects(text) {
  const objs = []; let i = 0;
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
const arrStart = lsIdx + 'lessons: ['.length - 1;
const arrEnd = matchBracket(c, arrStart, '[', ']');
const objs = extractObjects(c.slice(arrStart + 1, arrEnd));
console.log('删除前课程数:', objs.length);
objs.forEach(o => console.log(' -', o.title.slice(0, 40)));

// 保留用户定的 7 课
const keep = [
  '你的 AI 只会聊天',
  '给你的 AI 员工办入职',
  '提示词就是老板的能力',
  '让 Agent 员工掌握 72 变',
  '让 Agent 7×24',
  '用 CC Switch',
  '用 GitHub 保存工作记录'
];
const kept = objs.filter(o => keep.some(k => o.title.includes(k)));
const removed = objs.filter(o => !keep.some(k => o.title.includes(k)));
console.log('保留:', kept.length, '删除:', removed.length);
removed.forEach(o => console.log('  删除:', o.title.slice(0, 40)));

const newArr = kept.map(o => o.text).join(',\n      ');
const newLessons = 'lessons: [\n      ' + newArr + '\n    ]';
const replaced = c.slice(0, lsIdx) + newLessons + c.slice(arrEnd + 1);
console.log('含保留课:', keep.every(k => replaced.includes(k.slice(0, 10))));
console.log('旧课已删:', !replaced.includes('Agent 智能体最佳搭配') && !replaced.includes('用 Agent 要花多少钱') && !replaced.includes('Agent 为什么总是跑偏') && !replaced.includes('GitHub：你的宝藏智能库'));
let bal = 0; for (const ch of replaced) { if (ch === '{') bal++; if (ch === '}') bal--; }
console.log('括号配平:', bal === 0 ? 'OK' : '不平衡 ' + bal);
fs.writeFileSync('E:/超体社区/app.js.bak3', c, 'utf8');
fs.writeFileSync('E:/超体社区/app.js', replaced, 'utf8');
console.log('已写入（备份 app.js.bak3）');
