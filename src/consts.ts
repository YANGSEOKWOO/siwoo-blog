// 사이트 전역 설정
export const AUTHOR_NAME = 'Siwoo';
export const SITE_TITLE = 'Siwoo';
export const SITE_DESCRIPTION = '개발하며 배운 것과 읽은 책을 기록합니다.';
export const CONTACT_EMAIL = 'yangseokwoo@gmail.com';
export const GITHUB_URL = 'https://github.com/yangseokwoo';

/** 카테고리 정의. 글 frontmatter의 `category` 값과 키가 일치해야 합니다. */
export const CATEGORIES = {
	tech: { label: '기술', description: '개발하며 배우고 실험한 것들' },
	book: { label: '책', description: '읽은 책과 생각 정리' },
} as const;

export type Category = keyof typeof CATEGORIES;
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];
