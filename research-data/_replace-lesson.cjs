const fs = require('fs');
const path = 'E:/超体社区/app.js';
const c = fs.readFileSync(path, 'utf8');

const lesson1 = `{
        title: "你的 AI 只会聊天，还是能干活？",
        summary: "现场看 AI 把一件真事干完：整理桌面、清理 C 盘、检查网速",
        duration: "25 分钟",
        goal: "你能第一次亲眼看见：AI 不是问一句答一句的搜索框，而是能领活、干活、交成品的员工。",
        conclusion: "大多数人用 AI 停留在“问”——问它要答案、要文字、要建议，它回一段话就结束。但 AI 真正的价值是“派”：你交代一件事，它自己拆任务、读材料、操作文件、交付成品，像雇了一个员工。这一课不教概念，只让你亲眼看见差距。",
        sections: [
          { heading: "问 AI 和派 AI，是两个世界", paragraphs: ["同一个任务做两遍：在对话框里“问”AI，它回一段建议，啥也没干；换成 Agent“派”活，它自己扫文件、建文件夹、重命名、交付结果。一个像搜索框，一个像员工。"] },
          { heading: "三个日常任务，都能派", bullets: ["整理桌面：20 个乱文件，Agent 自己分类、重命名，前后对比一目了然。", "清理 C 盘垃圾：Agent 扫描出可清理项 TOP10、预估释放空间，出报告由人确认。", "检查/提升网速：Agent 跑 ping、测速、查占用带宽进程，给出原因和对应操作。"] },
          { heading: "一句话记住", paragraphs: ["问 AI 得到一段话，派 AI 得到一个结果。", "Chat 适合判断、解释、头脑风暴；Agent 适合资料多、步骤长、结果可验收的工作。"] }
        ],
        demo: "主演示“整理桌面”：准备一个模拟桌面文件夹（20 个乱文件）。第 1 遍在对话框问“帮我把桌面整理一下”，AI 回一段“可以按类型建文件夹”的建议；第 2 遍用 Agent 派活，给出目标/材料/要求（图片按日期_序号重命名并归类、文档归一个夹、压缩包归一个夹）/验收，Agent 自己跑完，前后截图对比。",
        prompt: "我想让你替我干完这件事：____。\\n1. 目标：要交付什么成品；2. 材料：给你什么输入；3. 边界：不许做什么、用什么风格；4. 验收：怎么算干好了。\\n请先复述任务，列出你没明说但存在的假设，确认后再动手。",
        pitfalls: ["把 Agent 当高级搜索框，只会问不会派。", "以为“会用 ChatGPT = 会用 AI”。", "以为 AI 干活必须会写代码（不需要）。"],
        exercise: "写下本周最想交给 AI 的 3 件事，填一页《我的 AI 员工画像》：我有什么活想交给它 / 它替我干什么 / 要什么产出 / 怎么算干好了。",
        acceptance: ["能说出“问 AI”和“管 AI”的 3 点区别。", "能列出一件自己真正想交给 AI 的事。", "知道 AI 能操作文件、电脑，不只是回话。"]
      },
      {
        title: "给你的 AI 员工办入职：装好三个工具",
        summary: "30 分钟装好 Codex / WorkBuddy / Trae，各跑通一件最小的事",
        duration: "30 分钟",
        goal: "你能装好至少一个工具并跑通最小任务，知道三个工具各管什么、门槛如何。",
        conclusion: "开完眼就要有真家伙。WorkBuddy 管办公交付（零基础首选），Codex 管操作电脑和编程，Trae 管写代码。一主两备：先把 WorkBuddy 装好用熟，另两个按方向选装，别一次装一堆。",
        sections: [
          { heading: "三个工具的地图", paragraphs: ["WorkBuddy（腾讯）：AI 办公工作台，写周报、整理文件、做表格、派活给智能体，官网 codebuddy.cn，微信扫码登录，门槛最低。", "Codex（OpenAI）：编程 Agent，能操作电脑、读文件、改代码，官网 chatgpt.com/codex/get-started，需要 ChatGPT 账号，国内访问可能要梯子。", "Trae（字节）：AI 编程 IDE，会说话就让 AI 写代码，国内版 trae.com.cn，有免费额度。"] },
          { heading: "装好并跑通一件小事", bullets: ["WorkBuddy：下载→安装→微信扫码→把一段话整理成一张表格。", "Codex：下载桌面 App→登录→让它生成一个 hello 网页并在本地打开。", "Trae：下载国内版→登录→让它写一个“批量重命名图片”的小工具。"] },
          { heading: "一主两备，别贪多", paragraphs: ["先把一个工具用熟，完成 3 到 5 个真实任务后再加下一个。工具越多，注意力越分散。安装包只从官网下，别用第三方捆绑包。"] }
        ],
        demo: "逐个装、逐个跑通：先演示 WorkBuddy 完整安装到跑通第一个任务；Codex 和 Trae 用提前录好的安装视频兜底（现场装可能慢或失败），每台都展示“装完→登录→跑通最小任务”。",
        prompt: "我刚装好了 WorkBuddy，想跑通第一个任务：把下面这段文字整理成一张表格（列：事项/负责人/截止时间）。\\n请先复述我的要求，确认后再做。",
        pitfalls: ["三个工具一次全装，结果一个都没用熟。", "以为装 Codex 必须会编程（不需要，跟着点）。", "安装失败就放弃——90% 是网络、账号、路径问题，都有解法。"],
        exercise: "至少装好一个工具（推荐 WorkBuddy），跑通一个最小任务，填《工具入职卡》：工具名 / 管什么 / 下载地址 / 跑通了什么 / 免费还是付费。",
        acceptance: ["至少一个工具装好并跑通最小任务。", "能说出 Codex / WorkBuddy / Trae 各管什么、各自门槛。", "知道从官网下载、先一主两备。"]
      }`;

const key = 'title: "聊天工具和 Agent 智能体工具的本质区别"';
const kIdx = c.indexOf(key);
const start = c.lastIndexOf('{', kIdx);
let depth = 0, end = -1;
for (let i = start; i < c.length; i++) {
  if (c[i] === '{') depth++;
  else if (c[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
}
const replaced = c.slice(0, start) + lesson1 + c.slice(end + 1);
// 校验：新文本里两课都在、旧课没了
console.log('含第1课:', replaced.includes('你的 AI 只会聊天，还是能干活？'));
console.log('含第2课:', replaced.includes('给你的 AI 员工办入职'));
console.log('旧课已移除:', !replaced.includes('聊天工具和 Agent 智能体工具的本质区别'));
// 语法粗校验：括号配平
let bal = 0; for (const ch of replaced) { if (ch === '{') bal++; if (ch === '}') bal--; }
console.log('花括号配平:', bal === 0 ? 'OK' : '不平衡: ' + bal);
fs.writeFileSync('E:/超体社区/app.js.bak', c, 'utf8');
fs.writeFileSync(path, replaced, 'utf8');
console.log('已备份 app.js.bak 并写入新 app.js');
