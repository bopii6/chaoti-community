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
const key = 'title: "定时任务：让员工到点自动开工"';
const ki = c.indexOf(key);
if (ki < 0) { console.error('定时任务课未找到'); process.exit(1); }
const start = c.lastIndexOf('{', ki);
const end = matchBracket(c, start, '{', '}');

const newLesson = `{
        title: "公众号自动化",
        summary: "从选题到发布，AI 自动写稿、配图、排版——人只按最后一个键",
        duration: "30 分钟",
        goal: "你能把公众号内容生产跑成一条自动化流水线。",
        conclusion: "公众号是内容自动化的最好例子：选题→成稿→配图→排版→发布，每一步都能交给 AI，人只按最后一个发布键。用现成的 Skill（如 baoyu-skills 的公众号发布）+ 你的知识库素材，一条流水线就搭起来了。",
        sections: [
          { heading: "公众号流水线五步", bullets: ["选题：从知识库/信息流水线里挑。", "成稿：AI 按你的风格写（接写作 Skill）。", "配图：AI 生成封面和配图。", "排版：AI 排成公众号格式。", "发布：推到草稿箱，人检查后按发布。"] },
          { heading: "用现成的 Skill", paragraphs: ["baoyu-skills 有公众号发布全套：排版、封面、发布一条龙。", "一句话安装，配合你的写作 Skill 和知识库，流水线就成了。"] },
          { heading: "人工检查点", paragraphs: ["发布前必查：内容对不对、有没有 AI 味、合不合规。", "人只按最后一个键，但这一键必须人按。"] }
        ],
        demo: "现场跑一条公众号自动化：丢一个选题 → AI 写稿（按你的风格）→ 配图 → 排版 → 推到草稿箱，现场检查后停在「待发布」。",
        prompt: "帮我搭一条公众号自动化流水线：\\n1. 从选题到发布分几步；\\n2. 用哪个现成 Skill（如 baoyu-skills）；\\n3. 每一步谁干（AI 还是人）；\\n4. 发布前检查清单是什么。",
        pitfalls: ["全自动直接发（发布键必须人按）", "不检查 AI 味（要人工朗读一遍）", "没有素材库（要接知识库/日记）"],
        exercise: "把一个选题跑成一条「成稿→配图→排版→草稿箱」的公众号流水线，停在待发布。",
        acceptance: ["能说出公众号流水线五步", "跑通到草稿箱", "知道发布前检查什么"]
      }`;

const replaced = c.slice(0, start) + newLesson + c.slice(end + 1);
console.log('含公众号自动化:', replaced.includes('公众号自动化'));
console.log('定时任务课已替换:', !replaced.includes('定时任务：让员工到点自动开工'));
let bal = 0; for (const ch of replaced) { if (ch === '{') bal++; if (ch === '}') bal--; }
console.log('括号配平:', bal === 0 ? 'OK' : '不平衡 ' + bal);
fs.writeFileSync('E:/超体社区/app.js.bak6', c, 'utf8');
fs.writeFileSync('E:/超体社区/app.js', replaced, 'utf8');
console.log('已写入（备份 app.js.bak6）');
