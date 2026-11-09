# Siwoo 블로그

Astro 7 기반 개인 블로그 (카테고리: 기술 `/tech/`, 책 `/book/`). GA4/GTM, AdSense, SEO, 커스텀 이벤트 측정이 미리 연결되어 있습니다.

## 명령어

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (`localhost:4321`). 분석/광고 스크립트는 로드되지 않고 이벤트는 콘솔에만 출력 |
| `npm run build` | 프로덕션 빌드 → `dist/` |
| `npm run preview` | 빌드 결과 미리보기 |
| `npx astro check` | 타입 검사 |

## 글 쓰기

### Claude Code로 (추천)

| 명령 | 하는 일 |
| --- | --- |
| `/write-post tech Redis 캐시 스탬피드 겪은 일` | 초안 생성 → 메모를 바탕으로 같이 작성 → 타입 검사 → 미리보기 주소 안내 |
| `/write-post book 데이터 중심 애플리케이션 설계` | 책 글 초안 (책 정보 박스 포함) |
| `/publish-post <slug>` | 발행 전 점검(TODO, 설명, 태그 등) → `draft: false` → 빌드 확인 |

스킬 정의: `.claude/skills/write-post/`, `.claude/skills/publish-post/`

### 직접

```bash
npm run new -- tech redis-cache-stampede "Redis 캐시 스탬피드 막기"
npm run new -- tech k8s-network "쿠버네티스 네트워크" --mdx   # ServerFlow 다이어그램을 쓸 때
npm run new -- book book-ddia "『데이터 중심 애플리케이션 설계』를 읽고"
```

초안(`draft: true`)은 개발 서버에서만 보이고(빨간 "초안" 표시) 배포 빌드에는 포함되지 않습니다. 발행하려면 `draft: false`로 바꿉니다.

### frontmatter

```yaml
---
title: '제목'
description: '검색 결과/공유 카드에 보이는 요약 (120자 안팎 권장)'
category: 'tech'            # tech(기술) | book(책) — 필수
pubDate: '2026-11-09'
updatedDate: '2026-11-20'   # 선택
tags: ['network', 'redis']
draft: true                 # true면 사이트/RSS/사이트맵에서 제외
heroImage: '../../assets/xxx.jpg'  # 선택 (공유 카드 이미지로도 사용)
book:                       # 선택 — 책 글이면 책 정보 박스 표시
  title: '책 제목'
  author: '저자'
  publisher: '출판사'
  year: 2024
---
```

지원 기능 (자세한 예시는 `.claude/skills/write-post/reference.md`):

- 코드 블록: 파일명(`title="..."`), 줄 강조(`{3-5}`), diff, 복사 버튼 — [Expressive Code](https://expressive-code.com)
- Mermaid: ` ```mermaid ` 코드 블록 → 다이어그램이 있는 글에서만 mermaid.js 로드
- 수식: `$...$`, `$$...$$` (KaTeX)
- **애니메이션 서버 통신 다이어그램**: `.mdx`에서 `<ServerFlow />` 사용

### ServerFlow 옵션

```mdx
import ServerFlow from '../../components/diagrams/ServerFlow.astro';

<ServerFlow
  caption="그림 설명"
  nodes={[
    { id: 'a', label: 'API', x: 0, y: 0 },              // kind: client | server | db | cache | queue | external
    { id: 'b', label: 'DB', x: 1, y: 0, kind: 'db' },   // x, y는 격자 좌표
  ]}
  edges={[
    { from: 'a', to: 'b', label: 'SELECT',
      response: true,   // 응답 패킷(초록)이 되돌아옴
      duration: 2,      // 이동 시간(초)
      packets: 1,       // 동시 패킷 수 (트래픽 양)
      dashed: false,    // 비동기/이벤트 흐름
      fail: false },    // 실패/타임아웃 (빨간 패킷이 도중에 사라짐)
  ]}
/>
```

더 복잡한 인터랙티브 데모(슬라이더, 시뮬레이션 등)가 필요하면 `npx astro add react`로 React를 추가하고
`<MyDemo client:visible />`처럼 아일랜드로 넣으면 됩니다 (화면에 보일 때만 JS 로드).

## 배포 전 체크리스트

1. `astro.config.mjs`의 `SITE_URL`을 실제 도메인으로 변경
2. `src/consts.ts`의 이메일, GitHub 주소 수정
3. `src/pages/about.astro`, `privacy.astro`의 TODO 수정
4. Vercel(또는 Cloudflare Pages)에 GitHub 저장소 연결 → 커스텀 도메인 연결
5. 호스팅 환경변수에 `.env.example` 항목 설정

## 환경변수 (`.env.example` 참고)

| 변수 | 용도 |
| --- | --- |
| `PUBLIC_GTM_ID` | Google Tag Manager 컨테이너 ID (권장) |
| `PUBLIC_GA_ID` | GTM 없이 GA4 직접 연결 시 |
| `PUBLIC_ADSENSE_CLIENT` | `ca-pub-...` — 설정 시 AdSense 스크립트와 `/ads.txt` 자동 생성 |
| `PUBLIC_ADSENSE_SLOT_POST_BOTTOM` | 글 하단 광고 단위 슬롯 ID |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console 소유권 확인 메타 태그 값 |
| `PUBLIC_NAVER_SITE_VERIFICATION` | 네이버 서치어드바이저 소유권 확인 값 |

## 측정 (GA4)

GA4 기본(향상된 측정)으로 페이지뷰, 스크롤 90%, 외부 링크 클릭이 수집됩니다. 추가로 글 페이지에서 커스텀 이벤트를 보냅니다.

| 이벤트 | 시점 | 파라미터 |
| --- | --- | --- |
| `code_copy` | 코드 블록 복사 버튼 클릭 | `post_slug`, `post_category`, `post_tags`, `code_language` |
| `read_complete` | 본문 끝 도달 | `post_slug`, `post_category`, `post_tags`, `seconds_to_complete` |

### GTM 설정 (1회)

사이트는 GTM 컨테이너(`PUBLIC_GTM_ID`)만 로드하고, 커스텀 이벤트는 `gtag('event', ...)`로 보냅니다.
GTM 안에 **Google 태그(GA4)** 하나만 있으면 페이지뷰·향상된 측정·커스텀 이벤트가 모두 GA4로 들어갑니다.

1. GTM → 태그 → 새로 만들기 → **Google 태그**, 태그 ID `G-YQJFYJYNDT`
2. 트리거: **Initialization - All Pages**
3. 제출 → 게시
4. GA4 관리 → 맞춤 정의 → 이벤트 범위 맞춤 측정기준으로 `post_slug`, `post_category`, `post_tags`, `code_language` 등록

`PUBLIC_GA_ID`(gtag 직접 모드)를 쓰면 GTM 없이 같은 방식으로 동작합니다.

## 검색 등록

- `/sitemap-index.xml`, `/robots.txt`, `/rss.xml` 자동 생성
- Google Search Console, 네이버 서치어드바이저, Bing Webmaster Tools에 사이트맵 제출
