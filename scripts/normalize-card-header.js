const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const dir = path.join(root, "assets", "knowledge-cards");
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = path.join(root, ".card-header-tmp");
fs.mkdirSync(tempDir, { recursive: true });

for (let i = 1; i <= 28; i += 1) {
  const name = `lesson-${String(i).padStart(2, "0")}`;
  const source = path.join(dir, `${name}.png`);
  const svg = path.join(tempDir, `${name}.svg`);
  const output = path.join(tempDir, `${name}.png`);
  const href = `file:///${source.replace(/\\/g, "/")}`;
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536" viewBox="0 0 1024 1536"><image href="${href}" width="1024" height="1536"/><rect x="36" y="28" width="952" height="116" rx="4" fill="#fffdf8" stroke="#1b3d30" stroke-width="3"/><line x1="300" y1="86" x2="390" y2="86" stroke="#a63b2b" stroke-width="3"/><circle cx="410" cy="86" r="5" fill="#a63b2b"/><text x="512" y="100" text-anchor="middle" font-family="Arial, Microsoft YaHei, sans-serif" font-size="40" font-weight="700" fill="#1b3d30">课程笔记</text><circle cx="614" cy="86" r="5" fill="#a63b2b"/><line x1="634" y1="86" x2="724" y2="86" stroke="#a63b2b" stroke-width="3"/></svg>`;
  fs.writeFileSync(svg, markup);
  execFileSync(chrome, ["--headless", "--disable-gpu", "--no-sandbox", "--allow-file-access-from-files", `--screenshot=${output}`, "--window-size=1024,1536", `file:///${svg.replace(/\\/g, "/")}`], { stdio: "ignore" });
  fs.copyFileSync(output, source);
  console.log(`normalized ${name}`);
}
