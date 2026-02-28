# 全自动编程 Agent 实验

## 免责声明

本项目所有（100%）代码和提示词均由 AI 生成。运行前请自行审查，任何后果概不负责。

## 前提（由人类撰写）

所有内容，建立在以下前提下，如果不认可，速速关闭这个页面：

**即使在非常复杂的项目中，AI 已经能够帮我们写绝大部分（甚至全部）代码。如果不行，不是 AI 的问题，是使用者本身的问题。AI 不是程序员的 bottleneck，程序员错误和老旧的工作方式是 AI 的 bottleneck。写代码本身将会越来越没有价值。**

程序员的工作内容将会转变，从写代码，变成如何控制 AI。高效使用 AI 生成可用的项目，成为程序员新的核心竞争力。因此我们要探索的是：如何更好的在开发中使用 AI。

## 项目背景（由人类撰写）

起因是[这篇 Anthropic 的文章](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)，他们做了一个自动编程 Agent。

为了测试新发布的 GLM-5，同时切身感受这种超长自动编程 Agent 的表现（一箭双雕），我做了这个 10 小时的实验。你在 git commit 记录里能看到 10 个小时我让 AI 做的所有事。

这种开发方式的目的，不是为了用 AI 替代程序员。对 AI 的“掌控”仍然由程序员负责。我们仍然需要人工判断 AI 做的是否正确，为 AI 指引方向。并不是无脑开发。

[这个视频](https://www.bilibili.com/video/BV1zZcYz1EMy/)详细解释了项目的完整过程。一些观众评论，认为视频内容有吹牛成分。标题党确实是我的惯用手段（不然你也不会看到这个项目和视频😂）。但视频里所有展示的开发过程，都没有任何夸大，均为客观事实。

## 超长时间自动编程 Agent 的具体内容

完整开发流程定义在 `CLAUDE.md` 中：

1. **初始化环境**：运行 `./init.sh`，安装依赖并启动开发服务器
2. **选择任务**：读取 `task.json`，选择一个 `passes: false` 的任务
3. **实现任务**：按照任务描述的步骤实现功能
4. **测试验证**：运行 `npm run lint` 和 `npm run build` 确保代码正确。使用浏览器打开应用测试（需要安装 playwright mcp）
5. **更新进度**：将工作记录到 `progress.txt`
6. **提交更改**：一次性提交所有更改（包括 task.json 更新）

这些内容也全部由 AI 生成。

## AI 视频项目

本仓库包含 **hello-nextjs** 项目，这是一个使用本上面提到的方式，开发的 AI 视频生成应用。项目本身并不复杂，但囊括了前后端、数据库、第三方生图、生视频大模型 API 等内容。可以查看 architecture.md 了解项目细节。

**hello-nextjs** 的目的是为了通过实战，调试和优化提示词，验证这套自动开发方式的运行情况。

progress.txt 和 Git 历史记录可以追溯 AI 生成这个项目的完整过程。除 2 个特别的git提交外，其他所有的 git 提交都是由 AI 完成的。那 2 个人工提交的 commit，是 markdown 文件的修改。但文件内容仍是 AI 生成。

项目的生成过程如下：
- 向 AI 描述需求，写出 architecture.md 和 task.json。
- 开始反复要求 AI 完成下一个任务。
- 任务全部完成后，要求 AI 完整测试项目流程。

## Prerequisites

- claude code
- playwright mcp（这是作者在该项目里唯一安装的 mcp）

## 使用方式

删除 hello-nextjs，然后让 AI 根据你的项目需求，重写 task.json 和 progress.txt。然后就可以让 AI 生成代码。生成中遇到流程上的问题，可以让 AI 修改 CLAUDE.md。

### 方式一：通过 Claude Code 运行（最稳妥）

手动启动 Claude Code，让 AI 执行下一个任务。

### 方式二：使用 dangerously skip permission 模式（次选）

使用 `--dangerously-skip-permissions` 参数运行 Claude Code，AI 可以在无需人工确认的情况下完成下一个任务。这是作者在实验中最常用的方式。

```bash
claude -p --dangerously-skip-permissions
```

### 方式三：使用自动化脚本（不推荐）

使用 `run-automation.sh` 脚本让 AI 循环运行多次：

```bash
./run-automation.sh 10  # 运行 10 次
```

**警告**：这种方式最危险，最容易浪费资源。人不在电脑边，又想让 AI 工作时可以使用。
