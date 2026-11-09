---
name: publish-post
description: Siwoo 블로그의 초안 글을 발행 상태로 바꾸고 발행 전 점검을 한다. "발행", "글 올려", "publish", "/publish-post" 요청에 사용.
argument-hint: "[slug]"
---

# 글 발행

초안(`draft: true`) 글을 점검한 뒤 발행 상태로 바꾼다.

입력: `$ARGUMENTS` = slug. 비어 있으면 `grep -l "draft: true" src/content/blog/*` 로 초안 목록을 보여주고 고르게 한다 (AskUserQuestion).

## 1. 발행 전 점검

`src/content/blog/<slug>.md(x)`를 읽고 아래를 확인한다. 문제가 있으면 목록으로 보여주고, 고칠지 사용자에게 묻는다. 내용(사실·경험)은 사용자 확인 없이 바꾸지 않는다.

- [ ] `<!-- TODO` 주석이 남아 있지 않다
- [ ] `description`이 비어 있지 않고 80~120자 안팎이다
- [ ] `tags`가 1개 이상이다
- [ ] 책 글이면 `book.title`, `book.author`가 채워져 있다
- [ ] 이미지에 alt 텍스트가 있다
- [ ] 코드 블록에 언어가 지정되어 있다
- [ ] 비어 있는 `##` 섹션이 없다

## 2. 발행

1. frontmatter에서 `draft: true` → `draft: false`
2. `pubDate`를 오늘 날짜(YYYY-MM-DD)로. 이미 발행됐던 글을 고친 경우라면 `pubDate`는 두고 `updatedDate`를 오늘로 추가한다.
3. `npm run build`가 오류 없이 끝나는지 확인하고, `dist/blog/<slug>/index.html`이 생성됐는지 본다.

## 3. 마무리 안내

- 배포: git 저장소가 연결되어 있으면 커밋/푸시하면 자동 배포된다. 커밋·푸시는 사용자가 요청할 때만 한다.
- 배포 후 할 일 (사용자에게 안내):
  - Google Search Console → URL 검사 → 색인 생성 요청 (`<SITE_URL>/blog/<slug>/`)
  - 네이버 서치어드바이저 → 웹페이지 수집 요청
