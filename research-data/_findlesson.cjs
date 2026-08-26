const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');
const key = 'title: "聊天工具和 Agent 智能体工具的本质区别"';
const kIdx = c.indexOf(key);
console.log('key at:', kIdx);
// 往前找 lesson 对象起点：最近的前一个 "{"
const start = c.lastIndexOf('{', kIdx);
console.log('obj start at:', start, '->', JSON.stringify(c.slice(start-30, start+60)));
// 从 start 开始做括号配平，找到对象结束
let depth = 0, end = -1;
for (let i = start; i < c.length; i++) {
  if (c[i] === '{') depth++;
  else if (c[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
}
console.log('obj end at:', end, '-> tail:', JSON.stringify(c.slice(end, end+40)));
const obj = c.slice(start, end+1);
console.log('--- 对象长度:', obj.length);
console.log(obj.slice(0, 200));
console.log('...');
console.log(obj.slice(-200));
