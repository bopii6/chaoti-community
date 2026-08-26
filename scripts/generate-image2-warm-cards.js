const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const outputDir = path.join(root, 'assets', 'knowledge-cards-image2-warm');
const apiKey = process.env.QILIN_API_KEY;
if (!apiKey) throw new Error('QILIN_API_KEY is required');
fs.mkdirSync(outputDir, { recursive: true });

const starts = [...app.matchAll(/^        title: "([^"]+)"/gm)].map((m) => m.index);
const lessons = starts.map((start, index) => {
  const end = app.indexOf('\n      },', start);
  const block = app.slice(start, end > start ? end : app.length);
  const field = (name) => {
    const match = block.match(new RegExp(`^        ${name}: "((?:\\\\.|[^"\\\\])*)"`, 'm'));
    return match ? match[1].replace(/\\n/g, ' ').replace(/\\"/g, '"') : '';
  };
  const headings = [...block.matchAll(/heading: "([^"]+)"/g)].map((m) => m[1]);
  return {
    index: index + 1,
    title: field('title'),
    summary: field('summary') || field('goal'),
    goal: field('goal'),
    headings: headings.slice(0, 5),
  };
});

const clean = (value, max = 90) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
const promptFor = (lesson) => {
  const points = lesson.headings.length ? lesson.headings.join(' / ') : clean(lesson.goal || lesson.summary, 150);
  return `Create a complete Chinese educational infographic card for a premium live-stream course. This is lesson ${lesson.index}: ${lesson.title}.

Use a refined warm paper editorial theme: light cream paper background, dark brown-black Chinese typography, deep brick red as the main accent, mustard yellow as a secondary accent, thin rules, simple restrained line icons. Landscape 3:2 composition. The card must be simple, elegant, highly legible from a livestream screen, and feel carefully prepared by an expert instructor.

The lesson content is: ${clean(lesson.summary || lesson.goal, 180)}
Important lesson points: ${clean(points, 220)}

Design the information hierarchy around this lesson's actual content. Use a clear title, one concise core conclusion, and no more than three or four essential steps, roles, contrasts, or takeaways. Choose the structure that best fits the lesson: a horizontal process for workflows, three columns for steps, a before/after comparison for contrasts, a role map for division of labor, or a simple concept-to-result path for ideas. Do not force unrelated content into the card.

Use these exact visible text elements where appropriate, preserving Chinese characters and punctuation: lesson title: ${lesson.title}; core content: ${clean(lesson.summary || lesson.goal, 150)}; supporting points: ${clean(points, 180)}. You may shorten supporting text for readability, but do not invent claims or add unrelated words. Keep text much more important than decoration.

No people, no large illustrations, no photorealistic scenes, no gradients, no decorative clutter, no fake screenshots, no logo, no watermark, no English except technical words already present in the lesson. Do not use tiny dense paragraphs. Make the result look like a clear knowledge card that a teacher can explain in 30 seconds.`;
};

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(`${response.status}: ${JSON.stringify(data)}`);
  return data;
}

async function generate(lesson) {
  const out = path.join(outputDir, `lesson-${String(lesson.index).padStart(2, '0')}.png`);
  if (fs.existsSync(out) && process.env.REGENERATE !== '1') return `skip ${lesson.index}`;
  const created = await request('https://image.hyhschool.com/api/generate-async', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'generate',
      base_url: 'https://www.qilinapi.com/v1',
      api_key: apiKey,
      protocol: 'openai',
      prompt: promptFor(lesson),
      model: 'gpt-image-2',
      size: '1536x1024',
      n: 1,
      timeout: 300,
    }),
  });
  let job;
  const deadline = Date.now() + 8 * 60 * 1000;
  do {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    job = await request(`https://image.hyhschool.com/api/jobs/${encodeURIComponent(created.job_id)}`);
  } while (!['success', 'error', 'failed', 'cancelled'].includes(job.status) && Date.now() < deadline);
  if (job.status !== 'success') throw new Error(`${lesson.index} ${job.status || 'timeout'}`);
  const image = await fetch(`https://image.hyhschool.com${job.result.images[0]}`);
  if (!image.ok) throw new Error(`${lesson.index} image download ${image.status}`);
  fs.writeFileSync(out, Buffer.from(await image.arrayBuffer()));
  return `done ${lesson.index} ${lesson.title}`;
}

async function main() {
  let cursor = 0;
  const workers = Array.from({ length: 5 }, async () => {
    while (cursor < lessons.length) {
      const lesson = lessons[cursor++];
      try { console.log(await generate(lesson)); }
      catch (error) { console.error(`failed ${lesson.index} ${lesson.title}: ${error.message}`); }
    }
  });
  await Promise.all(workers);
  console.log(`output ${outputDir}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
