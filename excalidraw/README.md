# 小王 AI 课｜Excalidraw 白板

已上线课程共 29 节，每节一份可导入的 `.excalidraw` 文件：

- `course-01.excalidraw` 到 `course-29.excalidraw`
- 课程名称与模块对应关系见 `course-manifest.json`
- 每节同时保留一个 `.spec.json`，用于后续修改和重新生成

## 导入方式

打开 [Excalidraw](https://excalidraw.com/)，选择菜单中的打开/导入文件，选中对应的 `.excalidraw` 文件即可。

## 编号顺序

编号按课程网站当前 `courseWeeks` 顺序排列：心态篇 → 从聊天到 Agent → Agent 能力扩展 → 工作流和自动化案例 → 做自己的 AI 工具。

## 重新生成

`generate-all-course-specs.mjs` 会从网站课程数据读取目标、章节、演示、练习和验收标准，生成全部课程的白板规格。第 04 课和第 07 课使用已确认的精细版样板。
