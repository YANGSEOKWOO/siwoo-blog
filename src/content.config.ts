import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
			// true면 빌드/목록/RSS/사이트맵에서 제외됩니다.
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
