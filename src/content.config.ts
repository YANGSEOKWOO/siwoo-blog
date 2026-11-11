import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { GLOSSARY_GROUP_KEYS, SERIES_KEYS } from './consts';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			/** tech(기술) | book(책) — src/consts.ts의 CATEGORIES와 일치 */
			category: z.enum(['tech', 'book']),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
			/** 책 글일 때 책 정보 (선택) */
			book: z
				.object({
					title: z.string(),
					author: z.string(),
					publisher: z.string().optional(),
					year: z.number().optional(),
				})
				.optional(),
			/** 연재 글이면 시리즈 id와 순서 (0 = 용어 사전, 1 = 1장 ...) — src/consts.ts의 SERIES */
			series: z
				.object({
					id: z.enum(SERIES_KEYS),
					order: z.number(),
				})
				.optional(),
			// true면 빌드/목록/RSS/사이트맵에서 제외됩니다.
			draft: z.boolean().default(false),
		}),
});

/**
 * 용어 사전. 파일 이름이 용어 id가 됩니다 (예: virtual-thread.mdx → <Term id="virtual-thread">).
 * 본문은 용어 사전 카드에 그대로 렌더링됩니다.
 */
const glossary = defineCollection({
	loader: glob({ base: './src/content/glossary', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		/** 한국어 표기 */
		term: z.string(),
		/** 영어 표기 */
		en: z.string(),
		/** 묶음 — src/consts.ts의 GLOSSARY_GROUPS */
		group: z.enum(GLOSSARY_GROUP_KEYS),
		/** 묶음 안에서의 순서 (읽는 순서대로) */
		order: z.number(),
		/** 한 줄 요약. 툴팁과 카드 상단에 나옵니다. */
		summary: z.string(),
		/** 함께 보면 좋은 용어 id. 없는 id를 쓰면 빌드 오류가 납니다. */
		related: z.array(reference('glossary')).default([]),
	}),
});

export const collections = { blog, glossary };
