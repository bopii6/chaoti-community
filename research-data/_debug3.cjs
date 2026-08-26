const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');
const wkIdx = c.indexOf('short: "从聊天到 Agent"');
const lsIdx = c.indexOf('lessons: [', wkIdx);
const arrStart = lsIdx + 'lessons: ['.length;
console.log(JSON.stringify(c.slice(arrStart+700, arrStart+800)));
console.log('---');
console.log(JSON.stringify(c.slice(arrStart+790, arrStart+830)));
