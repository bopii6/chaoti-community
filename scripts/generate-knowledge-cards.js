const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
const outputDir = path.join(root, "assets", "knowledge-cards");
fs.mkdirSync(outputDir, { recursive: true });

const lessonStarts = [...source.matchAll(/^        title: "([^"]+)"/gm)].map((match) => match.index);
const lessons = lessonStarts.map((start, index) => {
  const end = source.indexOf("\n      },", start);
  const block = source.slice(start, end > start ? end : source.length);
  const field = (name) => {
    const match = block.match(new RegExp(`^        ${name}: "((?:\\\\.|[^"\\\\])*)"`, "m"));
    return match ? match[1].replace(/\\n/g, " ").replace(/\\"/g, '"') : "";
  };
  const headings = [...block.matchAll(/heading: "([^"]+)"/g)].map((match) => match[1]);
  const weekMatches = [...source.slice(0, start).matchAll(/short: "([^"]+)"/g)];
  return { index, week: weekMatches.at(-1)?.[1] || "课程", title: field("title"), summary: field("summary") || field("goal"), goal: field("goal"), headings };
});

const escapeXml = (value) => String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const splitText = (value, max = 24, lines = 2) => {
  const chars = [...(value || "")];
  const output = [];
  for (let i = 0; i < chars.length && output.length < lines; i += max) output.push(chars.slice(i, i + max).join(""));
  return output;
};
const text = (value, x, y, size, weight = 400, color = "#11110f", max = 24, lines = 2) => splitText(value, max, lines).map((line, index) => `<text x="${x}" y="${y + index * (size + 10)}" font-family="Arial, Microsoft YaHei, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`).join("");
const box = (x, y, w, h, fill, label, headline, detail, accent = "#f0523e") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#11110f" stroke-width="3"/><rect x="${x}" y="${y}" width="10" height="${h}" fill="${accent}"/>${text(label, x + 30, y + 38, 17, 900, accent, 28)}${text(headline, x + 30, y + 82, 21, 900, "#11110f", 17, 2)}${text(detail, x + 30, y + 143, 16, 400, "#5c5a54", 24, 2)}`;
const arrow = (x, y) => text("→", x, y, 30, 400, "#f0523e", 2, 1);
const shell = (lesson, content, accent = "#f0523e") => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><rect width="1600" height="1000" fill="#f8f2e8"/><rect x="36" y="36" width="1528" height="928" fill="#fffdf8" stroke="#11110f" stroke-width="4"/>${text(`${lesson.week} · 知识点卡片 ${String(lesson.index + 1).padStart(2, "0")}`, 88, 112, 21, 700, accent, 42)}${text(lesson.title, 88, 184, 46, 900, "#11110f", 28, 2)}${text(lesson.summary, 88, 254, 20, 400, "#5c5a54", 68, 2)}${content}</svg>`;

function conceptCard(lesson) {
  const h = lesson.headings;
  return shell(lesson, `${box(88, 342, 680, 190, "#fff4a8", "核心判断", h[0] || "先理解问题", lesson.goal || lesson.summary)}${box(832, 342, 680, 190, "#e9e6dd", "关键分工", h[1] || "再选择方法", "把复杂问题拆成能执行的动作", "#11110f")}${box(88, 570, 444, 190, "#dff0e8", "你要做什么", h[2] || "完成一次练习", "带着真实任务开始")}${box(578, 570, 444, 190, "#f8ded7", "检查什么", h[3] || "看结果是否合格", "事实、格式、来源和边界")}${box(1068, 570, 444, 190, "#fff4a8", "带走一句话", "先做出结果，再沉淀方法", "这节课的价值在于能复用")}`);
}

function setupCard(lesson) {
  const steps = lesson.headings.slice(0, 4);
  return shell(lesson, `${text("这不是工具清单，是一条上手路径", 88, 350, 27, 900, "#11110f", 50)}${[0, 1, 2, 3].map((i) => box(88 + (i % 2) * 730, 402 + Math.floor(i / 2) * 188, 680, 150, i % 2 ? "#dff0e8" : "#fff4a8", `0${i + 1}`, steps[i] || "完成一次真实任务", i === 0 ? lesson.goal : "照着步骤操作，并检查结果")).join("")}${text("从知道 → 会用 → 跑通 → 复用", 88, 842, 31, 900, "#f0523e", 40)}`);
}

function skillCard(lesson) {
  const h = lesson.headings;
  return shell(lesson, `${text("把经验变成 Agent 可以反复调用的方法", 88, 350, 28, 900, "#11110f", 50)}${box(88, 414, 400, 250, "#fff4a8", "输入", h[0] || "原始经验", "书、文章、高手方法或一个真实任务")}${arrow(515, 545)}${box(590, 414, 400, 250, "#e9e6dd", "处理", h[1] || "提炼规则", "拆步骤、补边界、写自检和示例", "#11110f")}${arrow(1017, 545)}${box(1090, 414, 400, 250, "#dff0e8", "输出", h[2] || "可复用 Skill", "换一份新材料，再跑一次验证")}${text("保留有效能力，修改不适合自己的部分。", 88, 820, 24, 700, "#f0523e", 60)}`);
}

function knowledgeCard(lesson) {
  const h = lesson.headings;
  return shell(lesson, `${text("资料不是存进去就结束，而是要让 Agent 找得到、读得懂、用得上", 88, 350, 26, 900, "#11110f", 60)}${box(88, 414, 310, 250, "#f8ded7", "来源", h[0] || "外部素材", "聊天、网页、收藏和业务资料")}${arrow(420, 545)}${box(480, 414, 310, 250, "#fff4a8", "整理", h[1] || "结构化", "标题、来源、日期、判断和用途")}${arrow(812, 545)}${box(872, 414, 310, 250, "#dff0e8", "调用", h[2] || "Agent 读取", "按任务找到相关资料")}${arrow(1204, 545)}${box(1264, 414, 248, 250, "#e9e6dd", "产出", h[3] || "生成结果", "答案更具体，更像你的业务", "#11110f")}${text("知识库不是收藏夹，是可复用的业务上下文。", 88, 820, 25, 900, "#43a56f", 60)}`);
}

function browserCard(lesson) {
  const h = lesson.headings;
  return shell(lesson, `${text("让 Agent 通过浏览器完成‘打开 → 读取 → 操作 → 返回结果’", 88, 350, 27, 900, "#11110f", 60)}${box(88, 414, 310, 250, "#f8ded7", "打开", h[0] || "进入目标页面", "登录、验证码和权限由你确认")}${arrow(420, 545)}${box(480, 414, 310, 250, "#fff4a8", "定位", h[1] || "找到目标内容", "限定页面、收藏夹或字段")}${arrow(812, 545)}${box(872, 414, 310, 250, "#dff0e8", "处理", h[2] || "抓取并整理", "提取信息、分析变化或执行动作")}${arrow(1204, 545)}${box(1264, 414, 248, 250, "#e9e6dd", "交付", h[3] || "返回结果", "重要动作停在人工确认", "#11110f")}${text("浏览器自动化的价值：把网页里的重复动作交给 Agent。", 88, 820, 25, 900, "#f0523e", 66)}`);
}

function workflowCard(lesson) {
  return shell(lesson, `${text("案例不是讲概念，而是把一条真实任务完整跑通", 88, 350, 28, 900, "#11110f", 55)}${box(88, 430, 330, 190, "#fff4a8", "输入", "真实任务", "你每天反复做、结果可检查的事")}${arrow(448, 520)}${box(510, 430, 330, 190, "#dff0e8", "执行", "Agent + 工具", "按固定步骤推进，不靠每次重新猜")}${arrow(898, 520)}${box(960, 430, 330, 190, "#f8ded7", "检查", "关键节点确认", "登录、发送、发布和删除先停下")}${arrow(1348, 520)}${box(1400, 430, 112, 190, "#e9e6dd", "结果", "交付", "可复用", "#11110f")}${text("看完案例后，换成你自己的任务再跑一次。", 88, 820, 26, 900, "#f0523e", 60)}`);
}

for (const lesson of lessons) {
  if (lesson.index === 25) continue;
  let svg;
  if (lesson.week === "工作流和自动化案例") svg = workflowCard(lesson);
  else if (lesson.title.includes("Skill")) svg = skillCard(lesson);
  else if (lesson.title.includes("知识库")) svg = knowledgeCard(lesson);
  else if (lesson.title.includes("浏览器自动化")) svg = browserCard(lesson);
  else if (lesson.week === "从聊天到 Agent" || lesson.week === "做自己的 AI 工具") svg = setupCard(lesson);
  else svg = conceptCard(lesson);
  fs.writeFileSync(path.join(outputDir, `lesson-${String(lesson.index + 1).padStart(2, "0")}.svg`), svg);
}

console.log(`generated ${lessons.length - 1} varied knowledge cards; lesson-26 is preserved as the approved sample`);
