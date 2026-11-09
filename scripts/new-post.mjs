#!/usr/bin/env node
/**
 * 새 글 파일을 초안(draft: true) 상태로 만듭니다.
 *
 *   npm run new -- <tech|book> <slug> ["제목"] [--mdx]
 *
 *   npm run new -- tech redis-cache-stampede "Redis 캐시 스탬피드 막기"
 *   npm run new -- tech k8s-network --mdx          # ServerFlow 같은 컴포넌트를 쓸 글
 *   npm run new -- book ddia "『데이터 중심 애플리케이션 설계』를 읽고"
 *
 * slug는 URL이 됩니다 (/blog/<slug>/). 영문 소문자, 숫자, 하이픈만 사용하세요.
 */
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = join(root, 'src', 'content', 'blog');

const args = process.argv.slice(2);
const mdx = args.includes('--mdx');
const [category, slug, title = '제목을 입력하세요'] = args.filter((a) => a !== '--mdx');

function fail(msg) {
	console.error(`\n✖ ${msg}\n\n사용법: npm run new -- <tech|book> <slug> ["제목"] [--mdx]\n`);
	process.exit(1);
}

if (!['tech', 'book'].includes(category)) fail(`카테고리는 tech 또는 book 이어야 합니다 (입력: ${category ?? '없음'})`);
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(`slug는 영문 소문자/숫자/하이픈만 가능합니다 (입력: ${slug ?? '없음'})`);

mkdirSync(blogDir, { recursive: true });
const taken = readdirSync(blogDir).some((f) => f.replace(/\.mdx?$/, '') === slug);
if (taken) fail(`이미 같은 slug의 글이 있습니다: ${slug}`);

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

const frontmatter = [
	'---',
	`title: ${q(title)}`,
	`description: ''`,
	`category: '${category}'`,
	`pubDate: '${today}'`,
	`tags: []`,
	...(category === 'book'
		? ['book:', `  title: ''`, `  author: ''`, `  # publisher: ''`, `  # year: 2024`]
		: []),
	'draft: true',
	'---',
].join('\n');

const imports = mdx ? "\nimport ServerFlow from '../../components/diagrams/ServerFlow.astro';\n" : '';

const body =
	category === 'book'
		? `
## 이 책을 읽은 이유

## 인상 깊었던 부분

## 생각 정리

## 실무에 적용해 볼 것
`
		: `
## 배경

## 문제

## 해결

## 정리
`;

const file = join(blogDir, `${slug}.${mdx ? 'mdx' : 'md'}`);
writeFileSync(file, `${frontmatter}\n${imports}${body}`, 'utf8');

console.log(`\n✔ 초안 생성: src/content/blog/${slug}.${mdx ? 'mdx' : 'md'}`);
console.log(`  미리보기: http://localhost:4321/blog/${slug}/  (npm run dev 실행 중일 때, 초안은 개발 서버에서만 보임)`);
console.log(`  발행: frontmatter의 draft를 false로 바꾸세요.\n`);
