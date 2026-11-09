import { visit } from 'unist-util-visit';

/**
 * ```mermaid 코드 블록을 <pre class="mermaid">로 바꿉니다.
 * 코드 하이라이터(expressive-code)가 처리하기 전에 실행되고,
 * 실제 그림은 브라우저에서 mermaid.js가 그립니다 (다이어그램이 있는 글에서만 로드).
 * hName/hChildren을 사용하므로 .md와 .mdx 모두에서 동작합니다.
 */
export default function remarkMermaid() {
	return (tree) => {
		visit(tree, 'code', (node, index, parent) => {
			if (node.lang !== 'mermaid' || !parent || index === undefined) return;
			parent.children[index] = {
				type: 'mermaidBlock',
				data: {
					hName: 'pre',
					hProperties: { className: ['mermaid'] },
					hChildren: [{ type: 'text', value: node.value }],
				},
			};
		});
	};
}
