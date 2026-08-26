const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "assets", "knowledge-cards");
const apiKey = process.env.MOMO_API_KEY;
if (!apiKey) throw new Error("MOMO_API_KEY is required");
fs.mkdirSync(outputDir, { recursive: true });

const common = `Create a premium Chinese collectible learning card for a live AI course. Vertical portrait 1024x1536. Warm ivory paper background, thin deep forest-green double border, black editorial Chinese typography, restrained brick-red accents, small simple line icons only. The text is the main subject and must be crisp, readable, exact, and complete. Use generous whitespace and a carefully prepared study-card feeling. No people, no large illustration, no gradients, no decorative clutter, no fake screenshots, no watermark, no logo, no extra text.

CRITICAL LAYOUT RULE: use a compact top header of about 110 pixels with only the small label “课程笔记”. Place the lesson title immediately below it with only a modest 35-55 pixel gap. The title and content must fill the page in a continuous, balanced rhythm. Do not leave a large empty rectangle or empty band anywhere. Do not create any empty outlined box. Do not put a red frame or red divider around an area with no text. Do not create a large white overlay panel over the lesson title. Keep every line of body text inside the page and fully visible.`;

const cards = [
  {
    file: "lesson-01.png",
    prompt: `${common}

Lesson: 心态篇第 1 课《撒手去干，不要怕》
Main title, exact: “撒手去干，不要怕”
Core conclusion, exact: “先完成真实任务，再补需要的知识”
Three knowledge points:
01 不从底层绕路：先说清问题、给材料、看结果、做检查
02 先用手边设备：普通电脑、浏览器和一个主工具就能开始
03 选一个主工具：连续完成 3 到 5 个真实任务，再考虑增加工具
Bottom takeaway, exact: “今天没有学完所有知识，但已经完成了一件事”

Layout: compact header, exact main title immediately below it, prominent core-conclusion strip, three clearly separated numbered rows, and bottom takeaway. Use the available vertical space for these content blocks; no empty band between header and title. Do not add any lesson title or words other than the exact content above.`
  },
  {
    file: "lesson-02.png",
    prompt: `${common}

Lesson: 心态篇第 2 课《我的 AI Agent 入门故事》
Main title, exact: “我的 AI Agent 入门故事”
Core conclusion, exact: “先行动，再形成 AI 体感”
Story line, exact: “找老师 · 付费学习 · 做项目 · 在试错里学会”
Three knowledge points:
01 承认着急：不再继续围观，承认自己需要更短的试错路径
02 找到老师：看长期分享、真实案例、清晰方法和可验证交付
03 立刻做项目：选择 7 天内能交付、结果能检查的小项目
Bottom takeaway, exact: “不复制别人的平台和老师，只复制投入、行动、复盘”

Layout: compact header, exact main title immediately below it, core conclusion and story line, three numbered story steps, and final takeaway strip. Keep the title completely visible and use a continuous vertical composition; no large blank gap below the header and no empty outlined box. Do not add any other text.`
  },
  {
    file: "lesson-03.png",
    prompt: `${common}

Lesson: 心态篇第 3 课《第一次卡住怎么办》
Main title, exact: “第一次卡住怎么办”
Core conclusion, exact: “卡住不是不适合，而是问题还没被说清楚”
Three knowledge points:
01 记录目标与输入：我想完成什么，给了 AI 什么材料
02 对比预期与结果：我原本期待什么，实际发生了什么
03 只改一个地方：先查材料、目标和验收，再考虑换工具
Bottom takeaway, exact: “先保存失败现场，再开始修复”

Layout: compact header, exact main title immediately below it, one prominent core-conclusion strip, three numbered rows with small line icons, and bottom takeaway. Keep the title and first content block close enough to form one coherent composition; no large blank gap or empty outlined box. Do not add a second title or extra text.`
  },
  {
    file: "lesson-27.png",
    prompt: `${common}

Lesson: 工作流和自动化案例第 2 课《人在外面玩，活照样干：手机自动化办公》
Main title, exact: “人在外面玩，活照样干：手机自动化办公”
Core conclusion, exact: “手机自动化办公，不是让你 24 小时待命，而是把必须坐在电脑前拆掉”
Three knowledge points:
01 这套组合各管什么：Codex 负责动脑和执行；浏览器自动化负责网页操作；悠悠远程把电脑画面接到手机
02 一条完整链路：手机查看进度；关键步骤审批；电脑继续自动跑；结果回到手机
03 三步搭起最小链路：先让 Codex 跑通；再接浏览器自动化；最后用悠悠远程在手机确认
Bottom takeaway, exact: “人在外面，也能随时查看进度、审批关键步骤、收结果”

Layout: compact header, exact two-line main title immediately below it, compact core-conclusion box, three numbered columns or rows, and final takeaway strip. Use a tight, balanced composition with no empty band between header and title. Keep all words readable and do not add extra text.`
  }
];

async function generate(card) {
  const response = await fetch("https://momoai.asia/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-image-2",
      prompt: card.prompt,
      size: "1024x1536",
      quality: "high",
      output_format: "png"
    })
  });
  const body = await response.json();
  if (!response.ok || !body.data?.[0]?.b64_json) {
    throw new Error(`${card.file}: ${JSON.stringify(body).slice(0, 800)}`);
  }
  fs.writeFileSync(path.join(outputDir, card.file), Buffer.from(body.data[0].b64_json, "base64"));
  console.log(`saved ${card.file}`);
}

async function main() {
  const requested = process.argv.slice(2);
  const queue = requested.length
    ? cards.filter((card) => requested.includes(card.file.replace(".png", "")))
    : cards;
  if (!queue.length) throw new Error("No matching card requested");
  for (const card of queue) await generate(card);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
