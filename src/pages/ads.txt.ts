import type { APIRoute } from 'astro';

/**
 * AdSense 승인 후 필요한 ads.txt를 PUBLIC_ADSENSE_CLIENT 값으로 자동 생성합니다.
 * (ca-pub-1234 → pub-1234). 값이 없으면 빈 파일을 반환합니다.
 */
export const GET: APIRoute = () => {
	const client = import.meta.env.PUBLIC_ADSENSE_CLIENT ?? '';
	const pubId = client.replace(/^ca-/, '');
	const body = pubId ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n` : '';
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
