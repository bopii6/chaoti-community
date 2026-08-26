const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');
const key = 'title: "提示词就是老板的能力：把活交代漂亮"';
const kIdx = c.indexOf(key);
if (kIdx < 0) { console.log('NOT FOUND'); process.exit(1); }
const start = c.lastIndexOf('{', kIdx);
let depth = 0, end = -1;
for (let i = start; i < c.length; i++) {
  if (c[i] === '{') depth++;
  else if (c[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
}
console.log(c.slice(start, end + 1));
