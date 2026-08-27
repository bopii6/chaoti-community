# 2.12｜知识库进阶：让 Agent 读你的知识库
> 知识库模块（七十二变之一变：让 Agent 懂你）｜ 状态：待确认 ｜ 2026-08-24

## 课眼
先不讲复杂整理，完成最小连通：下载 Obsidian、创建本地 Vault，再让 Codex 等 Agent 的代码工具列出其中的 Markdown 文件。Agent 能看见文件，就算打通。

- **主标题**：知识库进阶：让 Agent 读你的知识库
- **小副标题**：先让 Agent 找到你的 Obsidian 文件，今天只做打通
- **当天产出**：一个本地 Obsidian Vault + 一次 Agent 连通测试结果

## 学员痛点
「我已经建了知识库，但 Agent 到底能不能读到？」——先不要急着整理，先把本地文件和 Agent 的代码工具连通。

## 核心内容
1. 从 Obsidian 官方网站下载并安装：https://obsidian.md/download；
2. 创建一个本地 Vault，并新建一篇「连通测试」Markdown 笔记；
3. 找到 Vault 的真实本地路径；
4. 在 Codex 等知识 Agent 的代码工具中运行 PowerShell 连通测试；
5. 看到 Agent 列出 `.md` 文件，即完成今天的目标；
6. 今天只做读取和连通，不做批量修改、删除或复杂知识库整理。

## 直播演示
打开 Obsidian 官方下载页，创建本地 Vault 和「连通测试」笔记；在 Codex 的代码工具中运行下面的 PowerShell 命令，把路径替换成自己的 Vault 路径：

```powershell
$vault = 'D:\我的知识库'; $files = Get-ChildItem -LiteralPath $vault -Recurse -File -Filter *.md; Write-Output "发现 $($files.Count) 个 Markdown 文件"; $files | Select-Object -First 10 -ExpandProperty FullName
```

看到文件名后停止，不继续做目录路由和三层结构。

## 学员练习
下载 Obsidian，创建本地 Vault 和「连通测试」笔记，在 Agent 的代码工具中替换真实路径并运行测试命令，保存一张能看到 Markdown 文件名的结果截图。

## 验收标准
能从官网安装 Obsidian；能创建本地 Vault 并找到真实路径；能运行连通测试命令；Agent 能列出至少一个 `.md` 文件；知道今天只做连通，不做复杂整理。

## 常见误区
从不明网站下载；拿示例路径直接运行；路径含空格却不加引号；第一次测试就使用客户资料、密码或 Token；一上来让 Agent 改名、移动或删除文件；把「能列出文件」误认为已经完成知识库结构化。

## 配套模板
连通测试卡：Obsidian 下载地址 / Vault 路径 / 测试笔记名称 / PowerShell 命令 / Agent 输出 / 是否看到 `.md` 文件 / 下一步问题。
