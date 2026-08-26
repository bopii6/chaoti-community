const fs = require('fs');
const dir = 'E:/超体社区/knowledge-base/课程脚本/知识库模块';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
let changed = 0;
files.forEach(f => {
  const p = dir + '/' + f;
  let c = fs.readFileSync(p, 'utf8');
  const n = c.split('知识库的进阶：').length - 1;
  if (n > 0) { c = c.split('知识库的进阶：').join('知识库进阶：'); fs.writeFileSync(p, c, 'utf8'); changed += n; }
});
console.log('已替换', changed, '处');
// 打印验证目录
console.log(fs.readFileSync(dir + '/_知识库模块-目录.md', 'utf8').split('\n').slice(0, 7).join('\n'));
