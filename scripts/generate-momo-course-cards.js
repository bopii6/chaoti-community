const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
const outputDir = path.join(root, "assets", "knowledge-cards");
const apiKey = process.env.MOMO_API_KEY;
if (!apiKey) throw new Error("MOMO_API_KEY is required");
fs.mkdirSync(outputDir, { recursive: true });

const starts = [...source.matchAll(/^        title: "([^\"]+)"/gm)].map((m) => m.index);
const lessons = starts.map((start, index) => {
  const end = source.indexOf("\n      },", start);
  const block = source.slice(start, end > start ? end : source.length);
  const field = (name) => {
    const match = block.match(new RegExp(`^        ${name}: "((?:\\\\.|[^"\\\\])*)"`, "m"));
    return match ? match[1].replace(/\\n/g, " ").replace(/\\"/g, '"') : "";
  };
  const headings = [...block.matchAll(/heading: "([^\"]+)"/g)].map((m) => m[1]).slice(0, 3);
  return { index, title: field("title"), summary: field("summary"), goal: field("goal"), conclusion: field("conclusion"), headings };
});

const common = `Create a complete Chinese collectible learning card / educational infographic for a premium AI Agent course. Vertical 1024x1536 card, warm ivory paper background, deep forest green thin double border, ink black typography, restrained brick-red accent, small simple line icons only. Text is the main content and must be large, crisp, exact Chinese. Make it feel worth saving and carefully prepared for a live teaching session. Use generous whitespace, elegant editorial study-card style, no people, no scenery, no large illustration, no gradients, no decorative clutter, no fake screenshots, no extra words, no watermark, no logo.`;

function prompt(lesson) {
  const principle = lesson.conclusion || lesson.goal || lesson.summary;
  const steps = lesson.headings.length ? lesson.headings : ["先理解核心问题", "再按步骤执行", "最后检查并复用"];
  return `${common}\n\nLesson title: ${lesson.title}\nCore principle: ${principle}\nCourse summary: ${lesson.summary}\n\nCreate exactly three numbered knowledge points based on this lesson:\n01 ${steps[0]}\n02 ${steps[1]}\n03 ${steps[2]}\n\nBottom takeaway: ${lesson.goal || lesson.summary}\n\nLayout: a small module/lesson label at top, large lesson title, one prominent core principle, three clearly separated numbered points in the middle, and one bottom takeaway strip. Keep sentences short and readable from a livestream screen. Do not add any text beyond the lesson information above. Use modern Chinese typography and consistent alignment. If a heading is long, shorten it naturally while preserving its meaning.`;
}

async function generate(lesson) {
  const response = await fetch("https://momoai.asia/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-2", prompt: prompt(lesson), size: "1024x1536", quality: "high", output_format: "png" }),
  });
  const body = await response.json();
  if (!response.ok || !body.data?.[0]?.b64_json) throw new Error(`${lesson.index + 1}: ${JSON.stringify(body).slice(0, 600)}`);
  const file = path.join(outputDir, `lesson-${String(lesson.index + 1).padStart(2, "0")}.png`);
  fs.writeFileSync(file, Buffer.from(body.data[0].b64_json, "base64"));
  console.log(`saved ${String(lesson.index + 1).padStart(2, "0")} ${lesson.title}`);
}

async function main() {
  const queue = lessons.slice(7);
  let cursor = 0;
  async function worker() {
    while (cursor < queue.length) {
      const lesson = queue[cursor++];
      await generate(lesson);
    }
  }
  await Promise.all([worker(), worker(), worker()]);
  console.log(`generated ${queue.length} cards`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
