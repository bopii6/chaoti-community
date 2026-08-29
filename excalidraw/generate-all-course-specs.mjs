import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const appPath = join(root, "app.js");
const outDir = join(root, "excalidraw");
mkdirSync(outDir, { recursive: true });

function extractCourseWeeks(source) {
  const start = source.indexOf("const courseWeeks = [");
  if (start < 0) throw new Error("courseWeeks not found");
  const open = source.indexOf("[", start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "\"" || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "[") depth += 1;
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        const expression = source.slice(open, i + 1);
        return Function(`return (${expression})`)();
      }
    }
  }
  throw new Error("courseWeeks array not closed");
}

const source = readFileSync(appPath, "utf8");
const weeks = extractCourseWeeks(source);
const lessons = weeks.flatMap((week) => (week.lessons || []).map((lesson) => ({ ...lesson, week: week.short, moduleTitle: week.title })));

const chars = (value) => [...String(value || "")];
const strip = (value) => String(value || "").replace(/[`*_#]/g, "").replace(/\s+/g, " ").trim();
const shorten = (value, max = 32) => {
  const text = strip(value);
  return chars(text).length > max ? `${chars(text).slice(0, max - 1).join("")}…` : text;
};
const lines = (value, perLine = 12, maxLines = 3) => {
  const text = strip(value);
  const tokens = text.match(/[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*|./gu) || [];
  const out = [];
  let current = "";
  for (const token of tokens) {
    const next = current + token;
    const currentEndsWord = /[A-Za-z0-9]$/u.test(current);
    const tokenStartsWord = /^[A-Za-z0-9]/u.test(token);
    if (current && next.length > perLine && !(currentEndsWord && tokenStartsWord)) {
      if (current.trim()) out.push(current.trim());
      current = token === " " ? "" : token;
    } else {
      current = next;
    }
  }
  if (out.length < maxLines && current.trim()) out.push(current.trim());
  return out.slice(0, maxLines).join("\n") || "待补充";
};
const titleLines = (value) => lines(shorten(value, 20), 10, 2);
const cardTitle = (value) => {
  const text = strip(value).replace(/^\d+[.、：:]?\s*/u, "");
  const afterColon = text.split(/[：:]/u).at(-1)?.trim() || text;
  const normalized = afterColon.replace("Codex 和 WorkBuddy 怎么选", "Codex vs WorkBuddy");
  return lines(shorten(normalized.length >= 4 ? normalized : text, 18), 8, 2);
};
const firstUseful = (section, index = 0) => {
  if (!section) return "先看清问题，再开始行动";
  const raw = section.bullets?.[0] || section.paragraphs?.[0];
  const heading = strip(section.heading);
  if (!raw) {
    if (heading.includes("Codex")) return "按任务类型记录返工次数";
    if (heading.includes("Trae")) return "做一次同类任务，记录顺手程度";
    if (heading.includes("豆包")) return "横向试用，保留备用方案";
    return ["先看懂重点", "先做一次小试验", "记下关键判断", "确认结果边界"][index % 4];
  }
  const value = strip(raw).split(/[。！？；]/u)[0];
  if (chars(value).length > 24) {
    const prefix = heading.split(/[：:]/u)[0];
    if (chars(prefix).length >= 4 && chars(prefix).length <= 14 && !/^第[一二三四五六七八九十]+条$/u.test(prefix)) return lines(prefix, 10, 2);
    return ["先看懂重点", "先做一次小试验", "记下关键判断", "确认结果边界"][index % 4];
  }
  return lines(value, 10, 3);
};
const sectionCards = (lesson, count = 4) => (lesson.sections || []).slice(0, count).map((section, i) => ({
  title: cardTitle(section.heading),
  body: firstUseful(section, i),
}));

function flowItems(lesson) {
  const t = lesson.title;
  if (t.includes("监控")) return ["选监控对象", "设检查频率", "对比页面变化", "按规则通知", "达到目标就停"];
  if (t.includes("网页后台") || t.includes("发布")) return ["登录并授权", "定位页面元素", "填写或上传", "人工确认", "提交并记录"];
  if (t.includes("收藏宝贝")) return ["进入我的收藏", "限定主题范围", "提取观点与链接", "整理成 Markdown", "写入知识库"];
  if (t.includes("知识库")) return ["采集真实素材", "补来源与判断", "写入知识库", "Agent 检索调用", "生成业务结果"];
  if (t.includes("Skill")) return ["原始经验", "提炼规则", "加入示例", "写入自检", "跑新任务验证"];
  if (t.includes("上下文")) return ["给目标截图", "标出具体问题", "补充约束", "让 AI 复述", "再开始执行"];
  if (t.includes("72 变") || t.includes("翅膀")) return ["浏览器自动化", "MCP 外部插头", "Skill 专业能力", "知识库第二大脑", "按任务逐个加"];
  if (t.includes("定时") || t.includes("7×24")) return ["测试输入", "设触发时间", "写停止条件", "准备失败恢复", "通知执行结果"];
  if (t.includes("CC Switch") || t.includes("成本")) return ["判断任务难度", "选择合适模型", "切换供应商", "跑小测试", "记录质量与成本"];
  if (t.includes("GitHub")) return ["创建工作仓库", "提交一次成果", "查看差异记录", "需要时回退", "长期积累方法"];
  if (t.includes("工作流") || t.includes("内容流程")) return ["收藏素材", "筛选与分析", "写入 Obsidian", "生成选题初稿", "人工确认发布"];
  if (t.includes("手机") || t.includes("远程")) return ["电脑先跑通", "接入浏览器", "手机远程查看", "关键节点确认", "回电脑复核"];
  if (t.includes("小程序")) return ["讨论需求范围", "Agent 生成代码", "导入开发工具", "模拟器与真机测试", "体验版交付"];
  if (t.includes("入门故事")) return ["承认真实焦虑", "找到可靠老师", "投入时间或预算", "选一个交付项目", "持续复盘沉淀"];
  if (t.includes("卡住")) return ["保留失败现场", "写清目标与输入", "对比预期与实际", "一次只改一处", "保存修复方法"];
  if (t.includes("撒手") || t.includes("不要怕")) return ["真实目标", "最小任务", "完成初版", "检查结果", "留下方法"];
  return ["明确目标", "准备材料", "让 Agent 提方案", "执行并检查", "沉淀可复用结果"];
}

function screen1(lesson) {
  const goal = shorten(lesson.goal || lesson.summary, 42);
  return {
    title: titleLines(lesson.title),
    subtitle: lines(shorten(lesson.summary || lesson.goal, 58), 22, 2),
    layout: {
      type: "comparison",
      left: { title: "旧习惯", body: "只看概念\n临场猜步骤\n做完就丢", bg: "#fee2e2", color: "#991b1b" },
      right: { title: "本课结果", body: lines(goal, 11, 3), bg: "#ecfdf5", color: "#065f46" },
      footer: "先交付一个可检查的小结果，再把方法留下来",
    },
  };
}

function screen2(lesson) {
  const cards = sectionCards(lesson, 4);
  while (cards.length < 3) cards.push({ title: `${String(cards.length + 1).padStart(2, "0")} 关键动作`, body: "带着真实任务做一遍" });
  return {
    title: "这节课，先抓住这几件事",
    subtitle: "直播时按卡片顺序讲，讲一张就做一个小动作。",
    layout: { type: "cards", cards: cards.slice(0, 4), footer: "不要一次学完所有东西，先把主线跑通" },
  };
}

function screen3(lesson) {
  const stepNotes = ["先限定范围", "只准备必要材料", "观察 Agent 执行", "遇到风险先停", "保存可检查结果", "复盘并留下方法"];
  const steps = flowItems(lesson).slice(0, 6).map((item, i) => ({ title: lines(item, 8, 2), body: stepNotes[i] || "完成后再进入下一步", bg: ["#ecfdf5", "#eff6ff", "#fff7ed", "#f5f3ff", "#fef3c7", "#f8fafc"][i % 6] }));
  return {
    title: "直播演示：一步一步跑通",
    subtitle: lines(shorten(lesson.demo || lesson.exercise, 62), 24, 2),
    layout: { type: "steps", columns: steps.length > 4 ? 3 : 2, steps: steps.slice(0, 6), footer: "每一步都留下输入、输出和检查信号" },
  };
}

function screen4(lesson) {
  return {
    title: "把方法画成一条线",
    subtitle: "真正能复用的能力，都应该能从输入走到结果。",
    layout: { type: "flow", perRow: 5, items: flowItems(lesson), footer: "流程跑通一次，才算真正学会" },
  };
}

function screen5(lesson) {
  const acceptance = lesson.acceptance || [];
  const exercise = shorten(lesson.exercise || lesson.demo, 30);
  return {
    title: "当天交付与验收",
    subtitle: "下播前一定要留下一个文件、记录或跑通结果。",
    layout: {
      type: "table",
      headers: ["当天产出", "必须做到", "不要做", "验收信号"],
      widths: [310, 340, 320, 350],
      rows: [
        [lines(exercise, 11, 2), lines(acceptance[0] || "至少跑通一次", 12, 2), "不要追求一次做大", lines(acceptance[1] || "结果可检查", 12, 2)],
        ["保留原始输入", lines(acceptance[2] || "记录关键步骤", 12, 2), "不要只听懂概念", lines(acceptance[3] || "下次可以复用", 12, 2)],
        ["写下下一步", "知道哪里要人工确认", "不要越过安全边界", "能向别人解释方法"],
      ],
      footer: "学习成果不是听完，而是留下一个可复用的交付物",
    },
  };
}

function screen6(lesson) {
  const conclusion = strip(lesson.conclusion || lesson.goal || lesson.summary);
  return {
    title: "把这一课带回真实工作",
    subtitle: "下一次遇到相似任务，直接复用今天留下的模板和检查方法。",
    layout: {
      type: "quote",
      lines: [lines(shorten(conclusion, 30), 15, 2), "先做一遍，再把有效方法沉淀成自己的工作方式"],
      footer: `下一节：${shorten("继续补齐你的 Agent 能力", 26)}`,
    },
  };
}

const manifest = [];
lessons.forEach((lesson, index) => {
  const number = String(index + 1).padStart(2, "0");
  const spec = {
    title: `第${number}课｜${lesson.title}`,
    seed: 2026082700 + index + 1,
    screens: [screen1(lesson), screen2(lesson), screen3(lesson), screen4(lesson), screen5(lesson), screen6(lesson)],
  };
  const specPath = join(outDir, `course-${number}.spec.json`);
  writeFileSync(specPath, JSON.stringify(spec, null, 2));
  manifest.push({ number, title: lesson.title, week: lesson.week, spec: specPath });
});
writeFileSync(join(outDir, "course-manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`generated ${lessons.length} course specs`);
