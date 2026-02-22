# Vibe Research - AI 科研指南

> 从 Idea 到论文发表的完整 AI 科研工作流指南

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)
[![Deploy to GitHub Pages](https://github.com/yiweinanzi/ai-research-ebook/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/yiweinanzi/ai-research-ebook/actions)

## 简介

本书是一份面向 AI 研究者的实用指南，使用 **Astro + Starlight** 构建，涵盖了从 idea 生成到论文发表的完整工作流程。

## 在线阅读

📖 **默认地址：`https://yiweinanzi.github.io/ai-research-ebook`**

你也可以通过环境变量覆盖站点地址（无需改代码）：

```bash
GITHUB_USERNAME=<你的用户名> npm run build
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 部署前配置

`astro.config.mjs` 已支持环境变量配置：

- `GITHUB_USERNAME`：GitHub 用户名（默认 `yiweinanzi`）
- `GITHUB_REPO`：仓库名（默认 `ai-research-ebook`）
- `SITE_URL`：站点域名（默认 `https://<username>.github.io`）
- `BASE_PATH`：子路径（默认 `/<repo>`）
- `GITHUB_REPOSITORY_URL`：仓库完整 URL

示例：

```bash
GITHUB_USERNAME=<你的用户名> GITHUB_REPO=ai-research-ebook npm run build
```

## 内容大纲

- **1. Idea 生成**: 系统化的文献调研方法，使用多模型交叉验证
- **2. 代码实现**: Claude Code、GPT-5.2、多Agent框架的最佳实践
- **3. 论文图表**: 自动化绘图工具推荐，专业图表设计规范
- **4. 论文写作**: 论证链构建方法，多模型协作写作
- **5. 审稿与 Rebuttal**: 结构化审稿流水线，Rebuttal 写作策略
- **6. 工具生态**: Elicit、Zotero-MCP 等最新工具，构建完整科研工具链

## 技术栈

- [Astro](https://astro.build) - 现代静态站点生成器
- [Starlight](https://starlight.astro.build) - Astro 的文档主题
- [GitHub Pages](https://pages.github.com) - 免费静态托管
- [GitHub Actions](https://github.com/features/actions) - 自动部署

## 项目结构

```
.
├── public/
│   └── logo.svg
├── src/
│   ├── content/
│   │   └── docs/          # Markdown 内容文件
│   ├── styles/
│   │   └── custom.css     # 自定义样式
│   └── content.config.ts
├── astro.config.mjs
└── package.json
```

## 许可证

MIT License

---

最后更新: 2026年2月9日
