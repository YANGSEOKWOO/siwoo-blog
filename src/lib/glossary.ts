import { getCollection, getEntry } from 'astro:content';
import { GLOSSARY_SLUG } from '../consts';
import { getPublishedPosts } from './posts';

/** 용어 사전에서 해당 용어 카드로 가는 주소 */
export const termHref = (id: string) => `/blog/${GLOSSARY_SLUG}/#term-${id}`;

/** 글 본문(MDX 원문)에서 <Term id="..."> 로 쓴 용어 id를 등장 순서대로, 중복 없이 뽑습니다. */
export function extractTermIds(body: string | undefined): string[] {
	if (!body) return [];
	const ids = [...body.matchAll(/<Term\s+id=["']([a-z0-9-]+)["']/g)].map((m) => m[1]);
	return [...new Set(ids)];
}

/** 용어를 가져오고, 없으면 오타를 바로 알 수 있게 빌드를 멈춥니다. */
export async function getTerm(id: string) {
	const entry = await getEntry('glossary', id);
	if (!entry) throw new Error(`용어 사전에 없는 용어 id입니다: "${id}" (src/content/glossary/${id}.md 를 만들거나 id를 확인하세요)`);
	return entry;
}

export async function getTermsInGroup(group: string) {
	const terms = await getCollection('glossary', ({ data }) => data.group === group);
	return terms.sort((a, b) => a.data.order - b.data.order);
}

/** 용어 id → 그 용어를 <Term>으로 쓴 글 목록 (용어 사전 자신은 제외) */
export async function getTermBacklinks() {
	const posts = await getPublishedPosts();
	const map = new Map<string, { slug: string; title: string; order?: number }[]>();
	for (const post of posts) {
		if (post.id === GLOSSARY_SLUG) continue;
		for (const id of extractTermIds(post.body)) {
			const list = map.get(id) ?? [];
			list.push({ slug: post.id, title: post.data.title, order: post.data.series?.order });
			map.set(id, list);
		}
	}
	for (const list of map.values()) list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
	return map;
}
