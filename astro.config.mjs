// @ts-check

import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkMermaid from './src/plugins/remark-mermaid.mjs';

// 사이트 주소 — canonical, sitemap, RSS, robots.txt에 사용됩니다.
// 우선순위: SITE_URL 환경변수(커스텀 도메인 연결 후 설정) → Vercel 프로덕션 도메인(자동) → 로컬
const SITE_URL =
	process.env.SITE_URL ??
	(process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: 'http://localhost:4321');

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	// expressiveCode는 mdx()보다 앞에 있어야 MDX 코드 블록에도 적용됩니다.
	integrations: [
		expressiveCode({
			themes: ['github-light', 'github-dark'],
			// <html data-theme="light|dark">에 맞춰 코드 테마 전환
			useDarkModeMediaQuery: false,
			themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
			styleOverrides: {
				codeFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
				codeFontSize: '0.84rem',
				codeLineHeight: '1.7',
				uiFontFamily: 'inherit',
				borderRadius: '10px',
				borderColor: 'var(--line)',
				frames: { shadowColor: 'transparent' },
			},
		}),
		mdx(),
		sitemap(),
	],
	markdown: {
		// Astro 7 기본 마크다운 처리기(Sätteri) 대신 remark/rehype 플러그인을 쓰기 위해 unified 사용
		processor: unified({
			remarkPlugins: [remarkMermaid, remarkMath],
			rehypePlugins: [rehypeKatex],
		}),
	},
	vite: {
		// mermaid의 지연 로드 청크(다이어그램 있는 글에서만 로드)가 커서 나는 경고를 끕니다.
		build: { chunkSizeWarningLimit: 2000 },
	},
});
