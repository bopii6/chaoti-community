const fs = require('fs');
// 1. app.js 改标题
let c = fs.readFileSync('E:/超体社区/app.js', 'utf8');
const oldT = 'title: "让 Agent 七十二变，无所不能"';
const newT = 'title: "让 Agent 员工掌握 72 变，插上翅膀"';
if (!c.includes(oldT)) { console.error('旧标题未找到'); process.exit(1); }
c = c.replace(oldT, newT);
fs.writeFileSync('E:/超体社区/app.js', c, 'utf8');
console.log('app.js 标题已改');

// 2. 本地脚本同步
const sp = 'E:/超体社区/knowledge-base/课程脚本/第04课-孙悟空七十二变-四样翅膀.md';
let s = fs.readFileSync(sp, 'utf8');
s = s.replace(/^# 第 04 课｜孙悟空七十二变：给 Agent 插上四样翅膀/m, '# 第 04 课｜让 Agent 员工掌握 72 变，插上翅膀（四样翅膀）');
s = s.replace(/- \*\*主标题\*\*：孙悟空七十二变：给 Agent 插上四样翅膀/, '- **主标题**：让 Agent 员工掌握 72 变，插上翅膀');
fs.writeFileSync(sp, s, 'utf8');
console.log('本地脚本已同步');

// 3. 课程表同步
let tb = fs.readFileSync('E:/超体社区/course-curriculum-v5-50lessons.md', 'utf8');
tb = tb.replace('| 04 | ✅ | 孙悟空七十二变：给 Agent 插上四样翅膀', '| 04 | ✅ | 让 Agent 员工掌握 72 变，插上翅膀');
tb = tb.replace('- 第 04 课｜孙悟空七十二变：knowledge-base/课程脚本/第04课-孙悟空七十二变-四样翅膀.md', '- 第 04 课｜让 Agent 员工掌握 72 变：knowledge-base/课程脚本/第04课-孙悟空七十二变-四样翅膀.md');
fs.writeFileSync('E:/超体社区/course-curriculum-v5-50lessons.md', tb, 'utf8');
console.log('课程表已同步');
