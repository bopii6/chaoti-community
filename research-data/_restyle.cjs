const fs = require('fs');
const path = 'E:/超体社区/styles.css';
let c = fs.readFileSync(path, 'utf8');

const start = c.indexOf('.lesson-block {');
const end = c.indexOf('.lesson-placeholder {');
if (start < 0 || end < 0 || end <= start) { console.error('定位失败', start, end); process.exit(1); }

const newStyles = `.lesson-block {
  margin: 0 0 44px;
  padding: 0;
  background: none;
  border: 0;
  box-shadow: none;
}

.lesson-block h2 {
  margin: 0 0 18px;
  font-family: var(--display);
  font-size: clamp(20px, 2.2vw, 25px);
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: 0.01em;
}

.lesson-block p {
  margin: 0 0 14px;
  font-size: 16px;
  line-height: 2;
}

.lesson-block p:last-child {
  margin-bottom: 0;
}

.lesson-sec-num {
  display: inline-block;
  margin-right: 10px;
  color: var(--red);
  font-family: var(--display);
  letter-spacing: 0.05em;
}

.lesson-goal-block {
  border: 0;
  border-left: 4px solid var(--yellow);
  padding: 2px 0 2px 20px;
  background: none;
  margin-bottom: 36px;
}

.lesson-goal-block .eyebrow {
  margin-bottom: 8px;
}

.lesson-goal {
  margin: 0;
  font-size: 18px !important;
  font-weight: 700;
  line-height: 1.8;
}

.lesson-conclusion {
  background: none;
  border: 0;
}

.lesson-conclusion p {
  color: var(--ink);
  font-size: 16px;
  line-height: 2;
}

.lesson-toc {
  margin: 0 0 40px;
  padding: 0;
  background: none;
  border: 0;
}

.lesson-toc h2 {
  margin: 0 0 14px;
  font-family: var(--display);
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.lesson-toc ol {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 24px;
}

.lesson-toc button {
  padding: 8px 0;
  text-align: left;
  color: var(--ink);
  background: none;
  border: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
}

.lesson-toc button:hover {
  color: var(--red);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.lesson-bullets {
  margin: 10px 0 0;
  padding-left: 24px;
}

.lesson-bullets li {
  margin: 10px 0;
  font-size: 15.5px;
  line-height: 1.9;
}

.lesson-demo {
  background: none;
  border: 0;
}

.lesson-demo p {
  font-weight: 500;
}

.lesson-prompt {
  position: relative;
  padding: 0;
  background: none;
  border: 0;
}

.lesson-prompt h2 {
  color: var(--ink);
}

.lesson-prompt .prompt-block {
  margin-top: 14px;
  padding: 20px 22px;
  color: #f3f1ea;
  background: var(--ink);
  border: 0;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.copy-prompt {
  position: absolute;
  top: 0;
  right: 0;
  padding: 7px 12px;
  color: var(--ink);
  background: var(--yellow);
  border: 2px solid var(--ink);
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.copy-prompt:hover {
  background: white;
}

.lesson-pitfall-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
  counter-reset: pitfall;
}

.lesson-pitfall-list li {
  position: relative;
  margin: 12px 0;
  padding: 2px 0 2px 44px;
  border: 0;
  background: none;
  font-size: 15.5px;
  line-height: 1.85;
  counter-increment: pitfall;
}

.lesson-pitfall-list li::before {
  content: counter(pitfall, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0;
  display: inline-block;
  color: var(--red);
  font-family: var(--display);
  font-size: 13px;
  font-weight: 900;
}

.lesson-exercise {
  background: none;
  border: 0;
  border-left: 4px solid var(--mint);
  padding: 2px 0 2px 20px;
}

.lesson-exercise p {
  font-weight: 500;
}

.lesson-acceptance {
  background: none;
  border: 0;
}

.lesson-acceptance-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.lesson-acceptance-list li {
  position: relative;
  margin: 10px 0;
  padding-left: 34px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.7;
}

.lesson-acceptance-list li::before {
  content: "\\2713";
  position: absolute;
  left: 0;
  top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: white;
  background: var(--green);
  border-radius: 50%;
  font-size: 12px;
  font-weight: 900;
}

`;

c = c.slice(0, start) + newStyles + c.slice(end);

// 移动端 media query 里的 .lesson-block padding 也改掉
c = c.replace(/@media \(max-width: 760px\) \{\n  \.lesson-block \{\n    padding: 22px 18px;\n  \}/, `@media (max-width: 760px) {
  .lesson-block {
    padding: 0;
  }`);

fs.writeFileSync('E:/超体社区/styles.css.bak', fs.readFileSync(path, 'utf8'), 'utf8');
fs.writeFileSync(path, c, 'utf8');
console.log('styles.css 已改为文章式，备份 styles.css.bak');
