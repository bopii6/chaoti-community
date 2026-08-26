const fs = require('fs');
const c = fs.readFileSync('E:/超体社区/app.js', 'utf8');

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
function extractObjects(text) {
  const objs = []; let i = 0;
  while (i < text.length) {
    const j = text.indexOf('{', i);
    if (j < 0) break;
    const k = matchBracket(text, j, '{', '}');
    if (k < 0) break;
    const obj = text.slice(j, k + 1);
    const titleM = obj.match(/title:\s*"([^"]+)"/);
    objs.push({ title: titleM ? titleM[1] : '(未知)', text: obj });
    i = k + 1;
  }
  return objs;
}

const wkIdx = c.indexOf('short: "从聊天到 Agent"');
const lsIdx = c.indexOf('lessons: [', wkIdx);
const arrStart = lsIdx + 'lessons: ['.length - 1;
const arrEnd = matchBracket(c, arrStart, '[', ']');
const objs = extractObjects(c.slice(arrStart + 1, arrEnd));
const byTitle = (t) => objs.find(x => x.title.includes(t));

const lesson4 = `{
        title: "让 Agent 七十二变，无所不能",
        summary: "浏览器自动化 + MCP + Skill + 知识库，四样翅膀装上，什么活都能接",
        duration: "30 分钟",
        goal: "你能第一次看见 Agent 不只聊天：能上网、连工具、装专长、读你的资料。",
        conclusion: "Agent 不是只会聊天的对话框。装上四样翅膀——浏览器自动化（上网替你干活）、MCP（什么工具都能插上就用）、Skill（立刻多一门专长）、知识库（终于懂你）——它就能七十二变，什么活都能接。这一课先全景开眼，后面模块二三四逐个深挖。",
        sections: [
          { heading: "四样翅膀", bullets: ["浏览器自动化：Agent 自己打开网页、抓信息、点按钮，它能「上网替你干活」了。", "MCP：把外部工具/服务变成 Agent 的「插头」，它什么工具都能「插上就用」。", "Skill：给 Agent 装一个专业能力包，它立刻「多一门专长」。", "知识库：把 Agent 接入你的资料和规则，它终于「懂你」了。"] },
          { heading: "每样跑通一个最小案例", paragraphs: ["浏览器：让它打开一个网页，抓取指定信息整理成表。", "MCP：给它接一个现成工具，当场跑通。", "Skill：一句话装一个现成 Skill（如 PPT/配图），当场用它做一件事。", "知识库：给它一个资料夹，让它基于你的资料回答/产出。"] },
          { heading: "全景开眼，不求深", paragraphs: ["这一课只要「看见」Agent 能七十二变。每样翅膀对应哪个模块深入：模块二=知识库，模块三=工作流/自动化，模块四=Skill 与做工具。"] }
        ],
        demo: "四个最小演示各跑一次：浏览器自动化抓网页信息、MCP 接外部工具、一句话装 Skill 跑通、知识库基于资料产出。每个都提前备好，现场各 5-8 分钟。",
        prompt: "给我装上四样翅膀中的「____」：\\n1. 先告诉我它解决什么问题、装在哪；\\n2. 给我一个最小案例，让我 10 分钟内跑通；\\n3. 跑通后告诉我怎么验证它真的会了。",
        pitfalls: ["以为「装上」就算会（要跑通真实任务才算）。", "四样一起上，一样都没用熟（先选一样主攻）。", "觉得 MCP 是黑客技术（它只是 AI 接外部工具的「插头」）。"],
        exercise: "选四样翅膀中的一样，让 Agent 用上它完成一件你的真实小事，填一张《我的 Agent 能力清单》。",
        acceptance: ["能说出四样翅膀各解决什么问题。", "至少一样翅膀在真实任务里跑通。", "知道后面哪个模块深入哪样翅膀。"]
      },
      {
        title: "让 Agent 7×24 小时替你干活",
        summary: "定时任务到点自动开工 + 多任务并行同时干——你睡觉，它干活",
        duration: "25 分钟",
        goal: "你能让 Agent 不用你盯、到点自己干活，还学会有分工的并行。",
        conclusion: "员工和工具最大的区别：工具等你用，员工自己到点上班、还能多线程干活。定时任务让 Agent 到点自动开工；并行让一个任务拆成多块同时跑。你睡觉，它干活。",
        sections: [
          { heading: "定时任务：到点自动开工", paragraphs: ["设定时间/频率，Agent 自动跑：每天早 8 点生成日报、每周一整理周报、每晚归档素材。", "安全三件套：测试输入（先用假数据试跑）、停止条件（做到 X 就停/遇到 Y 停下等人）、失败恢复（出错退到哪、怎么通知人）。"] },
          { heading: "并行：一次干好几件事", bullets: ["一个任务拆成多块同时跑：10 份文件同时处理、5 个方向同时调研。", "并行不是开十个窗口乱跑，是有分工的并行：谁干什么、结果合到哪，先分好。", "进阶：多 Agent 各管一摊，主理人只拆活、验收。"] }
        ],
        demo: "配置一个「每天早上自动整理昨日笔记→生成日报」的定时任务，演示到点自动跑；再对比串行 vs 并行处理 10 份文件的耗时，让学员看到并行是看得见的提速。",
        prompt: "帮我配一个定时任务：任务____，每天____点自动跑。\\n1. 先告诉我用哪个工具、在哪配；\\n2. 配置前先列「测试输入、停止条件、失败恢复」三件事；\\n3. 用一个假数据试跑一次给我看。",
        pitfalls: ["定时任务不设停止条件（半夜跑飞，钱没了）。", "把并行理解成开十个窗口乱跑（没有分工是灾难）。", "以为 7×24 就是一直开着（是有计划的定时 + 有分工的并行）。"],
        exercise: "给自己配一个定时任务（或把一件重复事拆成并行），跑通一次，记录配置过程。",
        acceptance: ["能说出定时任务三件套。", "并行任务有明确分工。", "至少一个定时或并行任务真实跑通。"]
      }`;

const newArr = [
  byTitle('你的 AI 只会聊天'),
  byTitle('给你的 AI 员工办入职'),
  byTitle('提示词就是老板的能力'),
  { title: '让 Agent 七十二变，无所不能', text: lesson4 },
  { title: '让 Agent 7×24 小时替你干活', text: lesson5_placeholder() },
  byTitle('Agent 智能体最佳搭配'),
  byTitle('用 Agent 要花多少钱'),
  byTitle('Agent 为什么总是跑偏'),
  byTitle('GitHub：你的宝藏智能库')
];
function lesson5_placeholder() { return ''; }

// 重新组织：第4、5课合并为一段（lesson4 已含两课）
const newArrText = newArr.map(o => o.text).filter(Boolean).join(',\n      ');
const finalArr = [
  byTitle('你的 AI 只会聊天').text,
  byTitle('给你的 AI 员工办入职').text,
  byTitle('提示词就是老板的能力').text,
  lesson4, // 含第4、5两课
  byTitle('Agent 智能体最佳搭配').text,
  byTitle('用 Agent 要花多少钱').text,
  byTitle('Agent 为什么总是跑偏').text,
  byTitle('GitHub：你的宝藏智能库').text
].join(',\n      ');

const newLessons = 'lessons: [\n      ' + finalArr + '\n    ]';
const replaced = c.slice(0, lsIdx) + newLessons + c.slice(arrEnd + 1);

// 校验
console.log('含第3课(提示词):', replaced.includes('提示词就是老板的能力'));
console.log('含第4课:', replaced.includes('让 Agent 七十二变，无所不能'));
console.log('含第5课:', replaced.includes('让 Agent 7×24 小时替你干活'));
console.log('旧课Agent搭配还在:', replaced.includes('Agent 智能体最佳搭配'));
let bal = 0; for (const ch of replaced) { if (ch === '{') bal++; if (ch === '}') bal--; }
console.log('花括号配平:', bal === 0 ? 'OK' : '不平衡 ' + bal);
fs.writeFileSync('E:/超体社区/app.js.bak2', c, 'utf8');
fs.writeFileSync('E:/超体社区/app.js', replaced, 'utf8');
console.log('已写入，备份 app.js.bak2');
