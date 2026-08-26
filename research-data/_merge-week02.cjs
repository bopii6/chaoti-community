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
// 定位周对象边界
function findWeek(key) {
  const ki = c.indexOf('short: "' + key + '"');
  if (ki < 0) return null;
  const start = c.lastIndexOf('{', ki);
  const end = matchBracket(c, start, '{', '}');
  return { start, end, text: c.slice(start, end + 1) };
}
const week02 = findWeek('给 AI 一个第二大脑');
const week2nd = findWeek('第二套');
if (!week02 || !week2nd) { console.error('周定位失败'); process.exit(1); }
console.log('02周:', week02.start, week02.end, '第二套:', week2nd.start, week2nd.end);

// 提取第二套周的 14 课
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
const lsIdx2nd = week2nd.text.indexOf('lessons: [');
const arrStart2nd = week2nd.start + lsIdx2nd + 'lessons: ['.length - 1;
const arrEnd2nd = matchBracket(c, arrStart2nd, '[', ']');
const lessons14 = extractObjects(c.slice(arrStart2nd + 1, arrEnd2nd));
console.log('翅膀课数:', lessons14.length);
lessons14.forEach(o => console.log(' -', o.title.slice(0, 30)));

// 构造新 02 周
const new02 = `  {
    short: "给 AI 插上翅膀",
    title: "给 AI 插上翅膀",
    outcome: "让 Agent 掌握三样翅膀：Skill（会干）、知识库（懂你）、浏览器自动化（能上网干活）",
    description: "从「会用 Agent」到「让 Agent 七十二变」：把三样翅膀逐个拆开讲透——Skill 进阶、知识库进阶、浏览器自动化进阶。",
    lessons: [
      ${lessons14.map(o => o.text).join(',\n      ')}
    ]
  }`;

// 替换 02 周
let replaced = c.slice(0, week02.start) + new02 + c.slice(week02.end + 1);
// 删除第二套周（注意：删除 02 后第二套周位置变了，用"第二套"重新定位）
const w2 = replaced.indexOf('short: "第二套"');
if (w2 >= 0) {
  const start2 = replaced.lastIndexOf('{', w2);
  const end2 = matchBracket(replaced, start2, '{', '}');
  // 保留前面部分 + 数组闭合，去掉第二套周对象
  const before = replaced.slice(0, start2);
  const after = replaced.slice(end2 + 1);
  // before 末尾是 ",\n    " 或 "],\n  }"，需要清理
  replaced = before + after;
  // 清理可能的多余逗号：数组里最后一个周对象后不应有逗号
  // 查找 courseWeeks 数组结束前的 ",\n  }\n  }]" 之类
}

// 校验
console.log('含新02标题:', replaced.includes('short: "给 AI 插上翅膀"'));
console.log('第二套已删:', !replaced.includes('short: "第二套"'));
console.log('旧第二大脑标题已删:', !replaced.includes('short: "给 AI 一个第二大脑"'));
console.log('含S1:', replaced.includes('为什么 Skill 这么神奇'));
console.log('含B4:', replaced.includes('操作网页后台与发布'));
let bal = 0; for (const ch of replaced) { if (ch === '{') bal++; if (ch === '}') bal--; }
console.log('括号配平:', bal === 0 ? 'OK' : '不平衡 ' + bal);
// 检查数组尾部是否有悬空逗号
const cwStart = replaced.indexOf('const courseWeeks = [');
const arrS = replaced.indexOf('[', cwStart);
const arrE = matchBracket(replaced, arrS, '[', ']');
const tail = replaced.slice(arrE - 60, arrE + 5);
console.log('数组尾部:', JSON.stringify(tail));
fs.writeFileSync('E:/超体社区/app.js.bak4', c, 'utf8');
fs.writeFileSync('E:/超体社区/app.js', replaced, 'utf8');
console.log('已写入（备份 app.js.bak4）');
