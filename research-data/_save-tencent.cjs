const fs = require('fs');
const dir = 'E:/超体社区/research-data/tencent-articles';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// 已抓到: 卡尔160条、苍何20条（从浏览器获取，这里先记录标题清单用于文档生成）
const data = {
  '卡尔的AI沃茨': {
    url: 'https://news.qq.com/omn/author/8QIf3n9U5YEUuDrf5Qc%3D',
    note: '腾讯新闻作者主页图文tab抓取，课程匹配度极高',
    count: 160,
    sample: ['第一个能帮你做生意的Agent现在打通国内电商了','实测DeepSeek Harness，原来PTC模式和Cordis插件才是隐藏大招','Claude/Codex能跨会话传消息，我重构工作流','烧了5亿token后，这是我给codex和claude做Skill上下文瘦身的新技巧！','分享2个让Codex和Claude跨机器共用记忆技巧','实测腾讯首个设计Agent Miora，13个真实场景把品牌设计全案包圆了','想用Codex做科研，可以先从这9个Skills开始','开源TODO Skill，我这三年用AI做知识管理和代办的经验都在这了','把电脑里所有文件塞给Agent后，我实现了代办24h全托管','分享一个把Skill工作流打包成电脑App的新玩法','开源一个为演讲而生的PPT Skill','把200k的Github项目转成元Skill工作流','Obsidian+OpenClaw组合技！花9分钟重构你的AI知识管理体系','春节7天，我彻底重构了用AI获取一手信息的工作流','Kimi上线了OpenClaw手机版，分享5种知识管理的神级技巧']
  },
  '苍何AI': {
    url: 'https://news.qq.com/omn/author/8QIf3n5d64QZvDrY5QY%3D',
    note: '腾讯新闻作者主页图文tab抓取',
    count: 20,
    items: ['DeepSeek 终于支持多模态了','豆包，开始做普通人的 Codex','做AI视频还在拆盲盒？手把手教你导演级运镜（附教程）','全球首款原生全模态交互式世界模型来了','偷偷分享 DeepSeek Harness 热榜挖到的 2 个实用插件','保姆级教程，Codex 接入 DeepSeek V4 Pro 和 Grok 4.6','做了个微信聊天爆款视频 Skill，Codex/WorkBuddy一键复刻','用 WorkBuddy / Codex + Obsidian 搭建自生长的个人知识库实战','几千人催我的 Codex +Obsidian 公众号创作工作流，开源了！','源神归来，阿里发布最强模型Qwen3.8-Max（附实测）','国内首个实时语音交互 Agent，阿里开卷','当 AI 一天写完一周的代码，谁来兜底安全？','AI 短剧出海，门槛已经低到离谱了','又一个 Agent 开源知识库爆火，夯爆了！','用 AI 做了套品牌周边，感觉能挂Shopify开卖了','给 Codex 换皮肤这门生意，被我开源了','AI出海最大的坑，不是模型','试了腾讯首个设计 Agent-Miora，彻底回不去了！','WAIC深度体验：能跨端使用的 Agent 才是好 Agent！','WAIC镇馆之宝+央视世界杯，百度搭子站上C位了']
  }
};
fs.writeFileSync(dir + '/tencent-抓取记录.json', JSON.stringify(data, null, 1));
console.log('saved');
