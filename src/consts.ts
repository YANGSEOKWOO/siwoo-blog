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

/**
 * 연재(시리즈). 글 frontmatter의 `series.id`와 키가 일치해야 합니다.
 * glossary: 이 시리즈의 용어 사전 글 slug. <Term> 링크가 이 글로 연결됩니다.
 */
export const SERIES = {
	'modern-java-concurrency': {
		title: '모던 자바 동시성 프로그래밍 읽기',
		glossary: 'modern-java-concurrency-glossary',
	},
} as const;
export type SeriesId = keyof typeof SERIES;
export const SERIES_KEYS = Object.keys(SERIES) as [SeriesId, ...SeriesId[]];

/** 용어 사전 글 slug. 지금은 용어 사전이 하나뿐이라 모든 <Term>이 여기로 연결됩니다. */
export const GLOSSARY_SLUG = SERIES['modern-java-concurrency'].glossary;

/**
 * 용어 묶음 (key: 표시 이름). 적힌 순서대로 용어 사전에 나옵니다.
 * 용어 파일의 `group`에 key를 씁니다.
 */
export const GLOSSARY_GROUPS = {
	basics: '기본 개념',
	jvm: 'JVM 이해하기',
	task: '스레드에 일 맡기기',
	sync: '동기화',
} as const;
export type GlossaryGroup = keyof typeof GLOSSARY_GROUPS;
export const GLOSSARY_GROUP_KEYS = Object.keys(GLOSSARY_GROUPS) as [GlossaryGroup, ...GlossaryGroup[]];
