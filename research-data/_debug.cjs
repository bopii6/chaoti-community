const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');
const weekKey = 'short: "从聊天到 Agent"';
const wkIdx = c.indexOf(weekKey);
const lessonsKey = 'lessons: [';
const lsIdx = c.indexOf(lessonsKey, wkIdx);
console.log('wkIdx:', wkIdx, 'lsIdx:', lsIdx);
console.log('--- lsIdx 前 150 字符 ---');
console.log(JSON.stringify(c.slice(lsIdx-150, lsIdx)));
// 检查 lsIdx 后 200 字符，确认是不是周数组的 lessons
console.log('--- lsIdx 后 250 字符 ---');
console.log(JSON.stringify(c.slice(lsIdx, lsIdx+250)));
