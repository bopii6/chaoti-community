const fs = require('fs');
const dir = 'E:/超体社区/knowledge-base/课程脚本/Skill模块';
const map = {
  'S01-为什么Skill这么神奇.md': ['为什么 Skill 这么神奇？', 'Skill 的进阶：为什么 Skill 这么神奇？'],
  'S02-如何无痛使用Skills.md': ['无痛使用 Skills：一句话安装，秒变专家', 'Skill 的进阶：无痛使用 Skills——一句话安装，秒变专家'],
  'S03-让Agent数字员工学习Skills.md': ['让 Agent 数字员工学会新本事', 'Skill 的进阶：让 Agent 数字员工学会新本事'],
  'S04-案例1-蒸馏一本书.md': ['把一本书蒸馏成 Skill', 'Skill 的进阶：把一本书蒸馏成 Skill'],
  'S05-案例2-蒸馏一个自媒体博主.md': ['把一个大 V 蒸馏成 Skill', 'Skill 的进阶：把一个大 V 蒸馏成 Skill'],
  'S06-案例3-修改别人的Skill.md': ['别从零造，把别人的 Skill 改成你的', 'Skill 的进阶：别从零造，把别人的 Skill 改成你的']
};
for (const [f, [oldT, newT]] of Object.entries(map)) {
  const p = dir + '/' + f;
  let c = fs.readFileSync(p, 'utf8');
  c = c.split('\n').map(line => {
    if (line.startsWith('# S') && line.includes('｜' + oldT)) return line.replace('｜' + oldT, '｜' + newT);
    if (line.startsWith('- **主标题**：' + oldT)) return line.replace('- **主标题**：' + oldT, '- **主标题**：' + newT);
    return line;
  }).join('\n');
  fs.writeFileSync(p, c, 'utf8');
}
let idx = fs.readFileSync(dir + '/_Skill模块-目录.md', 'utf8');
for (const [f, [oldT, newT]] of Object.entries(map)) idx = idx.split(oldT).join(newT);
fs.writeFileSync(dir + '/_Skill模块-目录.md', idx, 'utf8');
console.log('标题已加前缀');
// 打印验证
console.log(fs.readFileSync(dir + '/_Skill模块-目录.md', 'utf8').split('\n').slice(0, 8).join('\n'));
