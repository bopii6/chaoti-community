import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const files = readdirSync(".").filter((name) => name.endsWith(".excalidraw"));
const units = (value) => [...String(value)].reduce((sum, ch) => sum + (/[A-Za-z0-9]/u.test(ch) ? 0.52 : 0.82), 0);
const issues = [];

for (const file of files) {
  const board = JSON.parse(readFileSync(join(".", file), "utf8"));
  for (const element of board.elements.filter((item) => item.type === "text")) {
    const widest = Math.max(...String(element.text).split("\n").map(units));
    const screenY = Math.floor(element.y / 1020) * 1020;
    if (widest * element.fontSize > element.width + 0.5) {
      issues.push(`${file}: horizontal overflow: ${element.text.slice(0, 32)}`);
    }
    if (element.y + element.height > screenY + 900) {
      issues.push(`${file}: vertical overflow: ${element.text.slice(0, 32)}`);
    }
  }
}

console.log(`boards=${files.length}; issues=${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
}
