const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');

// 定位第5课对象（让 Agent 7×24 小时替你干活），在它之后插入第6课
const key5 = 'title: "让 Agent 7×24 小时替你干活"';
const k5 = c.indexOf(key5);
if (k5 < 0) { console.error('第5课未找到'); process.exit(1); }
const start5 = c.lastIndexOf('{', k5);
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
const end5 = matchBracket(c, start5, '{', '}');
const after5 = c.slice(end5 + 1); // 第5课对象结束后的内容，应为 ",\n      {"

const lesson6 = `{
        title: "用 CC Switch 切换员工，降低 Agent 使用成本",
        summary: "贵的旗舰模型留给难活，Luna + DeepSeek 干日常——两个交替用，成本砍一半",
        duration: "25 分钟",
        goal: "你能用 CC Switch 在模型之间一键切换，并为自己的任务选对省钱组合。",
        conclusion: "Agent 员工也有「时薪」：模型选错，钱哗哗烧。旗舰模型（如 GPT-5.6-Sol）跑得快但贵，留给难活；Luna 是目前最便宜的，DeepSeek 其次，日常活完全够用。只推荐这两个模型交替用，配 CC Switch 一键切换。",
        sections: [
          { heading: "模型不是越贵越好", paragraphs: ["贵的旗舰模型（如 Codex 下的 GPT-5.6-Sol）跑得快，但价格也高。日常任务用它们，就是拿大炮打蚊子。", "Luna 是目前最便宜的模型，DeepSeek 其次——日常干活完全够用，性价比最高。"] },
          { heading: "只推荐两个模型交替用", bullets: ["Luna：日常默认，最便宜。", "DeepSeek：次选，量大管饱。", "旗舰（Sol 类）：只留给难活/重要任务，临时切换。", "其他模型不推荐：折腾半天省不下钱。"] },
          { heading: "CC Switch：一键切换", paragraphs: ["CC Switch 是免费开源的可视化工具，统一管理 Claude Code / Codex / Gemini CLI 的供应商，一键切换模型，不用手改配置。", "进阶省钱法：脏活累活交给子代理，再用 CC Switch 把后端切到 DeepSeek。"] }
        ],
        demo: "装 CC Switch → 配置 Luna + DeepSeek 两个供应商 → 同一个任务分别用「贵模型」和「便宜模型」跑一遍 → 现场对比输出效果和成本，让学员看到「切换」就这么简单。",
        prompt: "帮我算一下这个任务用哪个模型最省钱：任务____，复杂度____，预估要跑____步。\\n1. 对比 Luna 和 DeepSeek 的成本；\\n2. 告诉我这个任务该用哪个模型、为什么；\\n3. 如果中途遇到难活，什么时候该切旗舰模型。",
        pitfalls: ["一直用旗舰模型（拿大炮打蚊子，钱哗哗烧）。", "一直用最便宜的（难活干不动，反复返工更贵）。", "以为切模型很麻烦（CC Switch 一键切，别手改配置）。"],
        exercise: "列出你本周 3 个任务，按复杂度分配模型，填一张《模型成本搭配表》。",
        acceptance: ["能说出 Luna / DeepSeek 的价格排序和适用场景。", "会用 CC Switch 一键切换模型。", "能为自己本周任务选出省钱组合。"]
      }`;

const replaced = c.slice(0, end5 + 1) + ',\n      ' + lesson6 + c.slice(end5 + 1);
console.log('含第6课:', replaced.includes('用 CC Switch 切换员工'));
let bal = 0; for (const ch of replaced) { if (ch === '{') bal++; if (ch === '}') bal--; }
console.log('括号配平:', bal === 0 ? 'OK' : '不平衡 ' + bal);
fs.writeFileSync('E:/超体社区/app.js', replaced, 'utf8');
console.log('已写入 app.js');
