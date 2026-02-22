// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const repoName = process.env.GITHUB_REPO ?? 'ai-research-ebook';
const githubUsername = process.env.GITHUB_USERNAME ?? 'yiweinanzi';
const siteUrl = process.env.SITE_URL ?? `https://${githubUsername}.github.io`;
const basePath = process.env.BASE_PATH ?? `/${repoName}`;
const normalizedBasePath = basePath === '/' ? '' : basePath;
const mermaidScriptVersion = process.env.MERMAID_SCRIPT_VERSION ?? '20260209e';
const repositoryUrl =
	process.env.GITHUB_REPOSITORY_URL ?? `https://github.com/${githubUsername}/${repoName}`;

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	base: basePath,
	integrations: [
		starlight({
			title: 'Vibe Research - AI 科研指南',
			description: 'AI研究电子书 - 从idea到论文的完整指南',
			head: [
				{
					tag: 'script',
					content:
						"(() => { try { const key = 'starlight-theme'; localStorage.setItem(key, 'light'); document.documentElement.dataset.theme = 'light'; } catch { document.documentElement.dataset.theme = 'light'; } })();",
				},
				{
					tag: 'script',
					attrs: {
						type: 'module',
						src: `${normalizedBasePath}/scripts/mermaid-init.js?v=${mermaidScriptVersion}`,
					},
				},
			],
			logo: {
				src: './src/assets/logo.svg',
				alt: 'Vibe Research',
			},
			social: [{ icon: 'github', label: 'GitHub', href: repositoryUrl }],
			sidebar: [
				{
					label: '首页',
					items: [{ label: '关于本书', slug: 'index' }],
				},
				{
					label: '1. Idea 生成',
					items: [
						{ label: '1.1 调研方法', slug: 'idea/research' },
						{ label: '1.2 调研项目', slug: 'idea/projects' },
					],
				},
				{
					label: '2. 代码实现',
					items: [
						{ label: '2.1 Claude Code', slug: 'code/claude' },
						{ label: '2.2 GPT-5.2 系列', slug: 'code/gpt' },
						{ label: '2.3 多Agent框架', slug: 'code/agents' },
					],
				},
				{
					label: '3. 论文图表',
					items: [
						{ label: '3.1 自动化绘图工具', slug: 'figures/tools' },
						{ label: '3.2 专业绘图对比', slug: 'figures/comparison' },
						{ label: '3.3 图表设计规范', slug: 'figures/design' },
					],
				},
				{
					label: '4. 论文写作',
					items: [
						{ label: '4.1 写作方法', slug: 'writing/methods' },
						{ label: '4.2 Prism 编辑器', slug: 'writing/prism' },
						{ label: '4.3 多模型协作', slug: 'writing/collaboration' },
					],
				},
				{
					label: '5. 审稿与Rebuttal',
					items: [
						{ label: '5.1 结构化审稿', slug: 'review/structured' },
						{ label: '5.2 会议审稿模板', slug: 'review/templates' },
						{ label: '5.3 Rebuttal策略', slug: 'writing/rebuttal' },
					],
				},
				{
					label: '6. 工具生态',
					items: [
						{ label: '6.1 工具总览', slug: 'tools/overview' },
						{ label: '6.2 完整工作流', slug: 'tools/workflow' },
					],
				},
				{
					label: '7. 资料库',
					items: [
						{ label: '7.1 科研圣经', slug: 'library/root-assets' },
					],
				},
			],
			customCss: ['./src/styles/custom.css'],
		}),
	],
	output: 'static',
	build: {
		format: 'directory',
	},
});
