const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');
// 打印 arrStart 到 arrStart+800
const weekKey = 'short: "从聊天到 Agent"';
const wkIdx = c.indexOf(weekKey);
const lsIdx = c.indexOf('lessons: [', wkIdx);
const arrStart = lsIdx + 'lessons: ['.length;
console.log('=== arrStart 附近 ===');
console.log(JSON.stringify(c.slice(arrStart, arrStart+400)));
console.log('=== arrStart+700 附近 ===');
console.log(JSON.stringify(c.slice(arrStart+650, arrStart+900)));
