const fs = require('fs');
const dir = 'E:/超体社区/knowledge-base/课程脚本/Skill模块';
const files = ['S01-为什么Skill这么神奇.md','S02-如何无痛使用Skills.md','S03-让Agent数字员工学习Skills.md','S04-案例1-蒸馏一本书.md','S05-案例2-蒸馏一个自媒体博主.md','S06-案例3-修改别人的Skill.md'];
const titles = {
  'S01-为什么Skill这么神奇.md': { old: '为什么 Skill 这么神奇？', new: 'Skill 的进阶：为什么 Skill 这么神奇？' },
  'S02-如何无痛使用Skills.md': { old: '无痛使用 Skills：一句话安装，秒变专家', new: 'Skill 的进阶：无痛使用 Skills——一句话安装，秒变专家' },
  'S03-让Agent数字员工学习Skills.md': { old: '让 Agent 数字员工学会新本事', new: 'Skill 的进阶：让 Agent 数字员工学会新本事' },
  'S04-案例1-蒸馏一本书.md': { old: '把一本书蒸馏成 Skill', new: 'Skill 的进阶：把一本书蒸馏成 Skill' },
  'S05-案例2-蒸馏一个自媒体博主.md': { old: '把一个大 V 蒸馏成 Skill', new: 'Skill 的进阶：把一个大 V 蒸馏成 Skill' },
  'S06-案例3-修改别人的Skill.md': { old: '别从零造，把别人的 Skill 改成你的', new: 'Skill 的进阶：别从零造，把别人的 Skill 改成你的' }
};
files.forEach(f => {
  const p = dir + '/' + f;
  let c = fs.readFileSync(p, 'utf8');
  const t = titles[f];
  // 改 H1 和 主标题字段
  c = c.replace(new RegExp('^# (S\\d)｜' + t.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), '# $1｜' + t.new);
  c = c.replace('- **主标题**：' + t.old, '- **主标题**：' + t.new);
  fs.writeFileSync(p, c, 'utf8');
});
// 更新目录
let idx = fs.readFileSync(dir + '/_Skill模块-目录.md', 'utf8');
files.forEach(f => {
  const t = titles[f];
  idx = idx.replace(t.old, t.new);
});
fs.writeFileSync(dir + '/_Skill模块-目录.md', idx, 'utf8');
console.log('Skill 模块 6 课标题已加前缀');
