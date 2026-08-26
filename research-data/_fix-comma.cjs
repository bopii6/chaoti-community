const fs = require('fs');
let c = fs.readFileSync('E:/超体社区/app.js', 'utf8');
const idx = c.indexOf('];');
const seg = c.slice(idx-80, idx+10);
console.log('修复前:', JSON.stringify(seg));
// 修复：把 "},\n,\n  ];" 变成 "}\n  ];"
c = c.replace(/},\n,\n  \];/, '}\n  ];');
const idx2 = c.indexOf('];');
console.log('修复后:', JSON.stringify(c.slice(idx2-80, idx2+10)));
fs.writeFileSync('E:/超体社区/app.js', c, 'utf8');
console.log('已修复');
