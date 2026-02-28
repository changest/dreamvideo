# DreamVideo - 项目开发指南

## 项目简介

DreamVideo 是一个文生视频工具，支持用户自行接入各种视频生成 API（如可灵、Runway、Pika、Luma 等），采用魅族 Flyme 风格的简洁优雅设计。

---

## 魅族设计规范

### 颜色系统
```css
--color-primary: #0085FA;        /* 魅族蓝 - 主色调 */
--color-primary-hover: #0070D9;  /* 悬停状态 */
--color-background: #F5F6F7;     /* 页面背景 - 浅灰 */
--color-surface: #FFFFFF;        /* 卡片表面 - 纯白 */
--color-text: #333333;           /* 主文字 - 深灰 */
--color-text-secondary: #666666; /* 次要文字 */
--color-border: #E5E6E7;         /* 边框 */
--color-success: #52C41A;        /* 成功 */
--color-warning: #FAAD14;        /* 警告 */
--color-error: #FF4D4F;          /* 错误 */
```

### 设计特点
- **圆角**: 统一使用 12px 圆角（按钮、卡片、输入框）
- **阴影**: 卡片阴影 `0 2px 12px rgba(0,0,0,0.08)`
- **字体**: PingFang SC, -apple-system, sans-serif
- **间距**: 16px 基础间距，24px 大间距
- **动效**: 流畅的 200-300ms 过渡动画

### UI 组件风格
- **按钮**: 圆角 12px，魅族蓝渐变，点击有轻微缩放
- **输入框**: 底部边框风格或圆角卡片式
- **卡片**: 白色背景，圆角，柔和阴影
- **提示**: 顶部轻提示 Toast，底部滑出 Modal

---

## 开发工作流

### Step 1: 启动项目

```bash
./init.sh
```

这会安装依赖并启动开发服务器。

### Step 2: 选择任务

查看 `task.json`，选择 `passes: false` 的任务。

### Step 3: 实现功能

按照任务步骤逐一实现，遵循魅族设计风格。

### Step 4: 测试验证

**UI 修改必须在浏览器测试！**
- 运行 `npm run lint` 检查代码
- 运行 `npm run build` 确保构建成功
- 浏览器测试 UI 显示和交互

### Step 5: 更新进度

在 `progress.txt` 添加记录。

### Step 6: 提交更改

```bash
git add .
git commit -m "Task [编号]: [任务标题] - completed"
```

---

## 项目结构

```
dreamvideo/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── generate/          # 视频生成页
│   ├── history/           # 历史记录页
│   ├── settings/          # 设置页
│   └── layout.tsx         # 根布局
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件 (魅族风格)
│   ├── api-config/       # API 配置相关
│   ├── generate/         # 生成页面组件
│   └── layout/           # 布局组件
├── lib/                  # 工具函数
│   ├── utils.ts          # 通用工具
│   ├── adapters/         # API 适配器
│   └── storage.ts        # 本地存储
├── types/                # TypeScript 类型
├── public/               # 静态资源
├── tailwind.config.ts    # Tailwind 配置
└── globals.css           # 全局样式
```

---

## 命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run lint     # 代码检查
```

---

## 关键规则

1. **魅族风格优先**: 所有 UI 必须符合魅族设计规范
2. **组件复用**: 优先使用已创建的 UI 组件
3. **类型安全**: 使用 TypeScript 严格模式
4. **本地存储**: API 配置使用 localStorage 存储
5. **测试要求**: UI 修改必须浏览器测试
6. **单任务提交**: 一个任务的所有更改一次性提交

---

## 阻塞处理

如果遇到无法解决的问题：
- 在 progress.txt 记录阻塞原因
- 不提交未完成的代码
- 清晰说明需要人工介入的内容
