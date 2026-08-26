const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');
const key6 = 'title: "用 CC Switch 切换员工，降低 Agent 使用成本"';
const k6 = c.indexOf(key6);
if (k6 < 0) { console.error('第6课未找到'); process.exit(1); }
const start6 = c.lastIndexOf('{', k6);
function matchBracket(text, openIdx, openCh, closeCh) {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') { i++; while (i < text.length && text[i] !== '"') { if (text[i] === '\\') i++; i++; } continue; }
    if (ch === openCh) depth++;
    else if (ch === closeCh) { depth--; if (depth === 0) return i; }
  }
  return -1;
}
const end6 = matchBracket(c, start6, '{', '}');

const lesson7 = `{
        title: "用 GitHub 保存工作记录，不让 Agent 的成果丢失",
        summary: "GitHub 是免费的「工作记录仓库」——每次改动留痕，随时回退",
        duration: "25 分钟",
        goal: "你能把 Agent 干活的成果存进 GitHub，会提交、看历史、出问题能回退。",
        conclusion: "Agent 干活会改文件，没有版本管理，改坏了/丢了一夜回到解放前。GitHub 是免费的「工作记录仓库」：每次提交留痕，随时回退，像员工的工作日志。学会它，Agent 的成果再也不丢。",
        sections: [
          { heading: "为什么要保存工作记录", paragraphs: ["Agent 干活会改文件：写文档、改代码、整理数据。没有版本管理，改坏了/误删了，一夜回到解放前。", "GitHub = 免费的「工作记录仓库」：每次改动都有记录（提交），随时能回退到任何一版。"] },
          { heading: "怎么用：提交-查看-回退", bullets: ["提交：让 Agent 干完一版活，就提交一次（commit），写清这次改了什么。", "查看：打开仓库看提交历史，每版改动一目了然。", "回退：出问题了，一键回到上一版。"] },
          { heading: "会管理：像员工的工作日志", paragraphs: ["提交说明写清楚：这版完成了什么（别写「更新」两个字）。", "一个项目一个仓库，别把所有东西堆一起。", "README 写清这个项目是干嘛的，下次打开就知道。"] }
        ],
        demo: "让 Agent 改一个文件（如整理数据/改文档），改完提交到 GitHub，现场展示提交历史；再故意改坏一次，演示一键回退到上一版。",
        prompt: "帮我把这个项目保存到 GitHub：\\n1. 初始化仓库，提交当前所有文件；\\n2. 提交说明写清楚：这个项目是干嘛的、这版完成了什么；\\n3. 告诉我怎么看历史、怎么回退。",
        pitfalls: ["以为 GitHub 是程序员专属（它就是个文件仓库，谁都能用）。", "只保存不管理：提交说明写「更新」，下次自己都看不懂。", "忘了提交：干完一版就提交，别攒到最后。"],
        exercise: "把一个自己的工作项目提交到 GitHub，跑通「提交→看历史→回退」三步。",
        acceptance: ["能把自己的工作提交到 GitHub。", "能查看提交历史。", "出问题能回退到上一版。"]
      }`;

const replaced = c.slice(0, end6 + 1) + ',\n      ' + lesson7 + c.slice(end6 + 1);
console.log('含第7课:', replaced.includes('用 GitHub 保存工作记录'));
let bal = 0; for (const ch of replaced) { if (ch === '{') bal++; if (ch === '}') bal--; }
console.log('括号配平:', bal === 0 ? 'OK' : '不平衡 ' + bal);
fs.writeFileSync('E:/超体社区/app.js', replaced, 'utf8');
console.log('已写入 app.js');
