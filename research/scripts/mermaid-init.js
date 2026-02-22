// Mermaid initialization for Starlight + Expressive Code
(function () {
	'use strict';

	const SCRIPT_VERSION = '20260209e';
	const SOURCE_SELECTOR = '.sl-markdown-content pre[data-language="mermaid"]';
	const RENDER_CLASS = 'mermaid-diagram';
	const HIDDEN_CLASS = 'mermaid-source-hidden';
	const THEME_OBSERVER_FLAG = '__vrMermaidThemeObserver';
	let mermaidModule = null;
	let isRendering = false;
	let needsRerender = false;

	function isDarkTheme() {
		return document.documentElement.dataset.theme === 'dark';
	}

	function getSourceRoot(block) {
		return block.closest('.expressive-code') || block;
	}

	function normalizeMermaidCode(rawText) {
		return String(rawText || '')
			.replace(/\u007f/g, '\n')
			.replace(/\u001f/g, '\n')
			.replace(/[\u2028\u2029]/g, '\n')
			.replace(/\u00a0/g, ' ')
			.replace(/\r\n?/g, '\n')
			.replace(/[\u200B-\u200D\uFEFF]/g, '')
			.replace(/[\x00-\x08\x0B\x0C\x0E-\x1E]/g, '')
			.split('\n')
			.map((line) => line.replace(/\s+$/g, ''))
			.join('\n')
			.trim();
	}

	function fixLegacySubgraphSyntax(code) {
		let autoSubgraphId = 0;
		const lines = code.split('\n').map((line) => {
			const legacyParen = line.match(/^(\s*)subgraph\s+([A-Za-z_][\w-]*)\s+\((.+)\)\s*$/);
			if (legacyParen) {
				const [, indent, id, title] = legacyParen;
				return `${indent}subgraph ${id}["${String(title).replace(/"/g, '\\"')}"]`;
			}

			const bracketOnly = line.match(/^(\s*)subgraph\s+\[(.+)\]\s*$/);
			if (bracketOnly) {
				autoSubgraphId += 1;
				const [, indent, rawTitle] = bracketOnly;
				const trimmed = String(rawTitle).trim();
				const title = /^".*"$/.test(trimmed) ? trimmed : `"${trimmed.replace(/"/g, '\\"')}"`;
				return `${indent}subgraph SG_AUTO_${autoSubgraphId}[${title}]`;
			}

			const quoteOnly = line.match(/^(\s*)subgraph\s+"(.+)"\s*$/);
			if (quoteOnly) {
				autoSubgraphId += 1;
				const [, indent, title] = quoteOnly;
				return `${indent}subgraph SG_AUTO_${autoSubgraphId}["${String(title).replace(/"/g, '\\"')}"]`;
			}

			return line;
		});

		return lines
			.join('\n')
			.replace(/subgraph\s+([A-Za-z_][\w-]*)\s+\(([^\n\)]*)\)/g, (_, id, title) => {
				return `subgraph ${id}["${String(title).replace(/"/g, '\\"')}"]`;
			});
	}

	function finalizeMermaidCode(rawText) {
		const normalized = normalizeMermaidCode(rawText);
		return fixLegacySubgraphSyntax(normalized);
	}

	function getCodeFromEcLines(block) {
		const lineNodes = block.querySelectorAll('.ec-line .code');
		if (!lineNodes.length) return '';
		return Array.from(lineNodes)
			.map((node) => node.textContent || '')
			.join('\n');
	}

	function getCodeFromCopyButton(block) {
		const button = block.closest('.expressive-code')?.querySelector('.copy button[data-code]');
		return button?.dataset.code || '';
	}

	function extractMermaidSource(block) {
		const fromEcLines = getCodeFromEcLines(block);
		if (fromEcLines.trim()) return finalizeMermaidCode(fromEcLines);

		const fromCopy = getCodeFromCopyButton(block);
		if (fromCopy.trim()) return finalizeMermaidCode(fromCopy);

		const codeNode = block.querySelector('code');
		const fallback = codeNode ? codeNode.textContent || codeNode.innerText || '' : '';
		return finalizeMermaidCode(fallback);
	}

	function cleanupRenderedDiagrams() {
		document.querySelectorAll(`.${RENDER_CLASS}[data-vr-mermaid="true"]`).forEach((node) => node.remove());
		document.querySelectorAll(SOURCE_SELECTOR).forEach((block) => {
			const root = getSourceRoot(block);
			root.classList.remove(HIDDEN_CLASS);
			root.style.display = '';
			block.removeAttribute('data-vr-mermaid-rendered');
		});
	}

	function buildErrorFallback(message, source) {
		const wrapper = document.createElement('div');
		wrapper.className = RENDER_CLASS;
		wrapper.dataset.vrMermaid = 'true';
		wrapper.style.borderColor = 'rgba(239, 68, 68, 0.45)';

		const title = document.createElement('div');
		title.textContent = `[mermaid] render failed: ${message}`;
		title.style.cssText = 'color:#b91c1c;font-weight:600;margin-bottom:8px;';
		wrapper.appendChild(title);

		const pre = document.createElement('pre');
		pre.textContent = source;
		pre.style.cssText = 'white-space:pre-wrap;word-break:break-word;max-height:320px;overflow:auto;margin:0;';
		wrapper.appendChild(pre);

		return wrapper;
	}

	async function ensureMermaid() {
		if (mermaidModule) return mermaidModule;
		const mod = await import('https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.esm.min.mjs');
		mermaidModule = mod.default || mod;
		return mermaidModule;
	}

	async function doRender() {
		console.log('[mermaid] init script', SCRIPT_VERSION);
		const mermaid = await ensureMermaid();
		mermaid.initialize({
			startOnLoad: false,
			securityLevel: 'loose',
			theme: isDarkTheme() ? 'dark' : 'base',
		});

		cleanupRenderedDiagrams();
		const blocks = Array.from(document.querySelectorAll(SOURCE_SELECTOR));
		if (!blocks.length) return;

		console.log('[mermaid] Found', blocks.length, 'diagrams');

		let ok = 0;
		let failed = 0;
		for (let index = 0; index < blocks.length; index += 1) {
			const block = blocks[index];
			const sourceRoot = getSourceRoot(block);
			const source = extractMermaidSource(block);
			if (!source) continue;

			const wrapper = document.createElement('div');
			wrapper.className = RENDER_CLASS;
			wrapper.dataset.vrMermaid = 'true';

			const host = document.createElement('div');
			host.className = 'mermaid';
			host.textContent = source;
			wrapper.appendChild(host);
			sourceRoot.insertAdjacentElement('afterend', wrapper);

			try {
				await mermaid.run({ nodes: [host] });
				sourceRoot.classList.add(HIDDEN_CLASS);
				sourceRoot.style.display = 'none';
				block.dataset.vrMermaidRendered = 'true';
				ok += 1;
			} catch (error) {
				wrapper.remove();
				sourceRoot.classList.remove(HIDDEN_CLASS);
				sourceRoot.style.display = '';
				const fallback = buildErrorFallback(error?.message || String(error), source);
				sourceRoot.insertAdjacentElement('afterend', fallback);
				console.warn(`[mermaid] Diagram ${index + 1} render failed:`, error?.message || error);
				failed += 1;
			}
		}

		console.log('[mermaid] render done:', { ok, failed, total: blocks.length });
	}

	async function renderAllDiagrams() {
		if (isRendering) {
			needsRerender = true;
			return;
		}

		isRendering = true;
		try {
			do {
				needsRerender = false;
				await doRender();
			} while (needsRerender);
		} catch (error) {
			console.error('[mermaid] Load failed:', error);
		} finally {
			isRendering = false;
		}
	}

	function observeThemeChanges() {
		if (window[THEME_OBSERVER_FLAG]) return;

		let themeTimer = null;
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
					if (themeTimer) clearTimeout(themeTimer);
					themeTimer = setTimeout(() => {
						renderAllDiagrams();
					}, 80);
					break;
				}
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme'],
		});

		window[THEME_OBSERVER_FLAG] = observer;
	}

	function bootMermaid() {
		renderAllDiagrams();
		observeThemeChanges();
	}

	document.addEventListener('astro:after-swap', bootMermaid);

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bootMermaid, { once: true });
	} else {
		bootMermaid();
	}

	window.renderMermaidDiagrams = renderAllDiagrams;
})();
