const fs = require('fs');
let c = fs.readFileSync('E:/超体社区/app.js', 'utf8');
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
// 1. 02 周改名
c = c.split('short: "给 AI 插上翅膀"').join('short: "Agent 员工进阶"');
c = c.split('title: "给 AI 插上翅膀"').join('title: "Agent 员工进阶"');
console.log('02改名:', c.includes('short: "Agent 员工进阶"'));

// 2. 定位 03 周
const wkIdx = c.indexOf('short: "工作流和自动化"');
const wkStart = c.lastIndexOf('{', wkIdx);
const wkEnd = matchBracket(c, wkStart, '{', '}');
const weekText = c.slice(wkStart, wkEnd + 1);
console.log('03周范围:', wkStart, wkEnd);

// 提取现有 lessons（2课）
const lsIdx = weekText.indexOf('lessons: [');
const arrStart = wkStart + lsIdx + 'lessons: ['.length - 1;
const arrEnd = matchBracket(c, arrStart, '[', ']');
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
const existing = extractObjects(c.slice(arrStart + 1, arrEnd));
console.log('现有03周课程:', existing.length);
existing.forEach(o => console.log(' -', o.title.slice(0, 30)));

// 3. 构造 6 新课
function mk(o) {
  return `{
        title: "${o.t}",
        summary: "${o.s}",
        duration: "${o.d}",
        goal: "${o.g}",
        conclusion: "${o.c}",
        sections: [
          ${o.sec.map(s => `{ heading: "${s.h}", ${s.b ? 'bullets: ' + JSON.stringify(s.b) : 'paragraphs: ' + JSON.stringify(s.p)} }`).join(',\n          ')}
        ],
        demo: "${o.demo}",
        prompt: "${o.prompt}",
        pitfalls: ${JSON.stringify(o.pit)},
        exercise: "${o.ex}",
        acceptance: ${JSON.stringify(o.ac)}
      }`;
}
const n1 = mk({
  t: '什么值得自动化', s: '重复三次、步骤稳定、结果可检查的，才值得交给 AI', d: '20 分钟',
  g: '你能识别哪些事值得自动化，哪些先别碰。',
  c: '不是所有事都值得自动化。判断三标准：重复（你每周都做）、稳定（步骤不会天天变）、可检查（做完能验收）。符合的才交给 AI，先把手工流程跑通一次再自动。',
  sec: [
    { h: '三标准', b: ['重复：每周至少做三次。', '稳定：步骤基本不变。', '可检查：做完能验收对错。'] },
    { h: '先手工跑通', p: ['自动化前先手工做一遍，把流程摸清。', '流程没跑通，自动化只会把混乱加速。'] },
    { h: '不适合自动化的', p: ['一次性、没标准、涉及大额/敏感的，先不碰。'] }
  ],
  demo: '现场列一个学员的重复工作清单，逐个用三标准判断值不值得自动化。',
  prompt: '帮我判断这些事值不值得自动化：____。\\n1. 用三标准（重复/稳定/可检查）逐个打分；\\n2. 标出最值得先做的一个；\\n3. 告诉我先手工跑通再自动化的步骤。',
  pit: ['什么都想自动化（先选一个）', '流程没跑通就自动（会加速混乱）', '忽略风险（敏感操作先不碰）'],
  ex: '列自己 5 件重复工作，用三标准挑出最值得自动化的 1 件。',
  ac: ['能用三标准判断', '挑出最值得自动化的 1 件事']
});
const n2 = mk({
  t: '搭第一条流水线：从素材到成品', s: '人只按最后一个键——输入、处理、检查、交付一条线', d: '30 分钟',
  g: '你能搭一条「素材→成品」的流水线，人只在关键处把关。',
  c: '流水线 = 输入 → AI 处理 → 检查 → 交付，人只在关键处按一下。从素材到成品一条线，重复的碎活全交给 AI。',
  sec: [
    { h: '流水线五段', b: ['输入：把素材给 AI。', '处理：AI 加工（写/排/整理）。', '检查：按验收标准查。', '交付：产出成品。', '人只在检查和交付把关。'] },
    { h: '典型：内容流水线', p: ['从选题到发布：选题→成稿→配图→排版→发布，人只按最后一个发布键。'] },
    { h: '先跑通再优化', p: ['第一版能跑就行，别追求完美。跑通了再一步步加检查。'] }
  ],
  demo: '现场搭一条最小流水线：丢一篇素材 → AI 整理成稿 → 按检查清单查 → 导出成品。',
  prompt: '帮我搭一条「____→____」的流水线：\\n1. 输入是什么；2. AI 处理哪几步；3. 检查清单是什么；4. 交付物是什么；5. 人在哪一步把关。',
  pit: ['一步到位追求完美（先跑通）', '没有检查点（AI 干了就算）', '人什么都管（要放手）'],
  ex: '选一个重复任务，画出「输入→处理→检查→交付」流水线图。',
  ac: ['能画出流水线五段', '知道人在哪把关']
});
const n3 = mk({
  t: '定时任务：让员工到点自动开工', s: '到点自动跑，你睡它干活——测试输入/停止条件/失败恢复', d: '25 分钟',
  g: '你能配一个定时任务，并装好安全三件套。',
  c: '定时任务让员工到点自动开工：每天早 8 点生成日报、每周一整理周报。但先装安全三件套：测试输入、停止条件、失败恢复，不然半夜跑飞钱就没了。',
  sec: [
    { h: '到点自动开工', p: ['设定时间/频率，AI 自动跑。', '典型：日报、周报、归档、抓取。'] },
    { h: '安全三件套', b: ['测试输入：先用假数据试跑。', '停止条件：做到 X 就停/遇到 Y 停下等人。', '失败恢复：出错退到哪、怎么通知人。'] },
    { h: '先手动触发验证', p: ['定时前先手动触发一次，确认流程对。', '再设定时，让它自己跑。'] }
  ],
  demo: '现场配一个定时任务（如每天早上整理笔记生成日报），先手动触发验证，再设定时。',
  prompt: '帮我配一个定时任务：任务____，每天____点跑。\\n1. 先列「测试输入、停止条件、失败恢复」三件事；\\n2. 用假数据试跑一次；\\n3. 确认后再设定时。',
  pit: ['不设停止条件（半夜跑飞）', '直接用正式数据试（要假数据）', '不先手动验证（直接定时）'],
  ex: '给自己配一个定时任务，装好三件套，先手动触发验证。',
  ac: ['能配定时任务', '装好安全三件套']
});
const n4 = mk({
  t: '多 Agent 协作：一个主 Agent 指挥几个子 Agent', s: '分工不是开十个窗口——谁干什么、结果合到哪，先分好', d: '25 分钟',
  g: '你能把一个任务拆给多个 Agent，有明确分工。',
  c: '多 Agent 的本质是分工：一个主 Agent 拆活，几个子 Agent 各干一块，主 Agent 汇总验收。不是开十个窗口乱跑。',
  sec: [
    { h: '主 Agent 与子 Agent', p: ['主 Agent：拆需求、分配、汇总、验收。', '子 Agent：各负责一块，干完交回。'] },
    { h: '分工三问', b: ['谁干什么：每个子 Agent 的职责。', '结果合到哪：怎么汇总。', '谁验收：主 Agent 还是人。'] },
    { h: '什么时候用', p: ['任务能拆成独立几块时才用多 Agent。', '小任务用单个 Agent 更快。'] }
  ],
  demo: '现场把一个大任务（如整理 10 份资料出报告）拆给 3 个子 Agent 并行，主 Agent 汇总。',
  prompt: '帮我把这个任务拆给多个 Agent：任务____。\\n1. 拆成几块、每块谁干；\\n2. 结果怎么汇总；\\n3. 哪些不能并行（有依赖）。',
  pit: ['没有分工就开一堆窗口', '任务不可拆硬拆（有依赖）', '没人验收（结果乱）'],
  ex: '把一个任务拆成 3 块，指定子 Agent 分工和汇总方式。',
  ac: ['能拆任务给多个 Agent', '分工明确、有汇总验收']
});
const n5 = mk({
  t: '人工检查点与故障恢复', s: 'AI 干 90%，关键处人拍板；出错能回来，不一路传下去', d: '25 分钟',
  g: '你能给流程设人工检查点，并准备故障恢复方案。',
  c: '自动化不是全自动撒手：AI 干 90%，关键处（发布/付款/对外）人拍板；出错要能回来，错误不一路传下去。一张故障恢复卡就够了。',
  sec: [
    { h: '人工检查点', b: ['哪些步骤必须人拍板：发布、付款、对外。', '其他让 AI 自己干，别每步都管。'] },
    { h: '故障恢复卡', p: ['出错退到哪、怎么恢复、通知谁。', '错误不一路传下去，先停再修。'] },
    { h: '安全边界', p: ['高权限/高隐私的操作谨慎。', '低风险/高重复的大胆试。'] }
  ],
  demo: '现场给一条流水线标出人工检查点，并写一张故障恢复卡（出错→回退→通知）。',
  prompt: '帮我的流水线设检查点和故障恢复：\\n1. 哪些步骤该人拍板；2. 出错退到哪、怎么恢复；3. 写一张故障恢复卡。',
  pit: ['全自动撒手（出事没人负责）', '每步都要人管（失去了自动化的意义）', '没故障恢复（错了不会回来）'],
  ex: '给自己的一条流水线标出 1 个检查点 + 写一张故障恢复卡。',
  ac: ['能设人工检查点', '有故障恢复方案']
});
const n6 = mk({
  t: '稳定验收：跑三次都稳才算自动化', s: '第一次手工、第二次半自动、第三次复盘', d: '20 分钟',
  g: '你能用「跑三次」的方法验收一条流水线是否真的稳定。',
  c: '跑一次成功不算数。第一次手工摸清、第二次半自动、第三次全自动并复盘——三次都稳，才算真的自动化。',
  sec: [
    { h: '跑三次', b: ['第一次：手工跑通，记录步骤。', '第二次：半自动，人盯。', '第三次：全自动 + 复盘问题。'] },
    { h: '稳定性检查', p: ['每次输出对不对、卡在哪、花了多久。', '三次都稳，才算真自动化。'] },
    { h: '留说明书', p: ['把流程写成说明书，交给别人/未来的自己也能照跑。'] }
  ],
  demo: '现场演示一条流水线跑三次，对比三次的稳定性和问题。',
  prompt: '帮我验收这条流水线稳不稳定：____。\\n1. 跑三次，记录每次的问题；\\n2. 三次对比，标出不稳定点；\\n3. 给出改进建议。',
  pit: ['跑一次就宣布成功', '不稳定还硬用（返工更多）', '不留说明书（别人不会跑）'],
  ex: '把自己的流水线跑三次，写一份稳定性记录。',
  ac: ['能跑三次并复盘', '知道什么算真稳定']
});

// 4. 组装 03 周：6 新 + 2 旧
const oldOrder = existing.map(o => o.text);
const newLessons = [n1, n2, n3, n4, n5, n6].concat(oldOrder);
const lessonsText = newLessons.join(',\n      ');

// 更新周对象：保留原 title/outcome/description，替换 lessons
const newWeek = weekText.replace(/lessons: \[[\s\S]*?\]/, 'lessons: [\n      ' + lessonsText + '\n    ]');
let replaced = c.slice(0, wkStart) + newWeek + c.slice(wkEnd + 1);
console.log('03周含6新课:', ['什么值得自动化','搭第一条流水线','定时任务：让员工到点自动开工','多 Agent 协作','人工检查点与故障恢复','稳定验收'].every(t => replaced.includes(t)));
console.log('03周保留旧课:', replaced.includes('人在外面玩') && replaced.includes('揭秘小王AI课'));
let bal = 0; for (const ch of replaced) { if (ch === '{') bal++; if (ch === '}') bal--; }
console.log('括号配平:', bal === 0 ? 'OK' : '不平衡 ' + bal);
fs.writeFileSync('E:/超体社区/app.js.bak5', c, 'utf8');
fs.writeFileSync('E:/超体社区/app.js', replaced, 'utf8');
console.log('已写入（备份 app.js.bak5）');
