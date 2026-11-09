import { getCollection } from 'astro:content';
import type { Category } from '../consts';

/**
 * 글 목록을 최신순으로 반환합니다. category를 주면 해당 카테고리만.
 * 초안(draft: true)은 개발 서버(npm run dev)에서만 보이고, 배포 빌드에서는 빠집니다.
 */
export async function getPublishedPosts(category?: Category) {
	const showDrafts = import.meta.env.DEV;
	const posts = await getCollection(
		'blog',
		({ data }) => (showDrafts || !data.draft) && (!category || data.category === category),
	);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
