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
// 03 周定位
const wkIdx = c.indexOf('short: "工作流和自动化"');
const lsIdx = c.indexOf('lessons: [', wkIdx);
const arrStart = lsIdx + 'lessons: ['.length - 1;
const arrEnd = matchBracket(c, arrStart, '[', ']');
const all = extractObjects(c.slice(arrStart + 1, arrEnd));
console.log('03周现有课程:', all.map(o => o.title.slice(0, 20)));

// 保留 3 课
const get = (t) => all.find(o => o.title.includes(t));
const keepOld = [get('人在外面玩'), get('揭秘小王AI课')];
if (keepOld.some(x => !x)) { console.error('保留课缺失'); process.exit(1); }

// 公众号自动化（蒼何版）替换内容
const gzhNew = `{
        title: "公众号自动化",
        summary: "蒼何的 Codex + Obsidian 工作流——素材进库，标题/封面/排版/配图全自动，人只按发布键",
        duration: "30 分钟",
        goal: "你能用蒼何开源的公众号创作工作流，把一篇公众号跑成「素材→成品→草稿箱」。",
        conclusion: "公众号自动化最好的范本是蒼何开源的「Codex + Obsidian 公众号创作工作流」：素材先进 Obsidian 知识库，Codex 负责标题、封面、排版、配图，人只做最后检查发布。一套开源工作流，人人都能搭。",
        sections: [
          { heading: "蒼何工作流是什么", paragraphs: ["Codex + Obsidian：素材先进知识库，Codex 负责内容生产的碎活。", "公众号图文创作的核心元素：标题、封面、排版、配图，都可以交给 Agent。"] },
          { heading: "四样交给 AI", bullets: ["标题：AI 出多个候选，你挑。", "封面：AI 生成封面图。", "排版：AI 排成公众号格式。", "配图：AI 配正文插图。"] },
          { heading: "人工检查点", paragraphs: ["发布前必查：内容对不对、有没有 AI 味、合不合规。", "人只按最后一个发布键，但这一键必须人按。"] }
        ],
        demo: "现场跑蒼何工作流：从 Obsidian 里丢一个素材 → Codex 生成标题/封面/排版/配图 → 推到公众号草稿箱，检查后停在「待发布」。",
        prompt: "按蒼何的 Codex + Obsidian 工作流，帮我跑一篇公众号：\\n1. 素材在 Obsidian 的____；2. 生成 5 个标题候选；3. 配封面和插图；4. 排版成公众号格式；5. 推到草稿箱，等我检查。",
        pitfalls: ["全自动直接发（发布键必须人按）", "不检查 AI 味（要人工朗读一遍）", "素材不进库（要先用 Obsidian 存好）"],
        exercise: "把一个 Obsidian 素材跑成一篇公众号（标题/封面/排版/配图），推到草稿箱停在待发布。",
        acceptance: ["能说出蒼何工作流的四样交付", "跑通到草稿箱", "知道发布前检查什么"]
      }`;

// 新数组：人在外面玩 + 揭秘 + 公众号自动化（蒼何版）
const newLessons = [keepOld[0].text, keepOld[1].text, gzhNew];
const lessonsText = newLessons.join(',\n      ');
const replaced = c.slice(0, arrStart + 1) + '\n      ' + lessonsText + '\n    ' + c.slice(arrEnd);
console.log('保留3课:', replaced.includes('人在外面玩') && replaced.includes('揭秘小王AI课') && replaced.includes('公众号自动化'));
console.log('删除其他课:', ['什么值得自动化','搭第一条流水线','多 Agent 协作','人工检查点与故障恢复','稳定验收'].every(t => !replaced.includes(t)));
console.log('蒼何工作流:', replaced.includes('蒼何开源的「Codex + Obsidian 公众号创作工作流」'));
let bal = 0; for (const ch of replaced) { if (ch === '{') bal++; if (ch === '}') bal--; }
console.log('括号配平:', bal === 0 ? 'OK' : '不平衡 ' + bal);
fs.writeFileSync('E:/超体社区/app.js.bak7', c, 'utf8');
fs.writeFileSync('E:/超体社区/app.js', replaced, 'utf8');
console.log('已写入（备份 app.js.bak7）');
