import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { Node as PmNode } from '@tiptap/pm/model';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

const TASHKEEL_REGEX =
	/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g;

const tashkeelPluginKey = new PluginKey('tashkeelToggle');

function buildDecorations(doc: PmNode, hide: boolean): DecorationSet {
	if (!hide) return DecorationSet.empty;

	const decorations: Decoration[] = [];

	doc.descendants((node, pos) => {
		if (!node.isText || !node.text) return;

		let match;
		TASHKEEL_REGEX.lastIndex = 0;
		while ((match = TASHKEEL_REGEX.exec(node.text)) !== null) {
			const from = pos + match.index;
			const to = from + match[0].length;
			decorations.push(
				Decoration.inline(from, to, { class: 'tashkeel-hidden' })
			);
		}
	});

	return DecorationSet.create(doc, decorations);
}

export const TashkeelToggle = Extension.create<{ hideTashkeel: boolean }>({
	name: 'tashkeelToggle',

	addOptions() {
		return { hideTashkeel: false };
	},

	addProseMirrorPlugins() {
		const ext = this;
		return [
			new Plugin({
				key: tashkeelPluginKey,
				state: {
					init(_, { doc }) {
						return buildDecorations(doc as any, ext.options.hideTashkeel);
					},
					apply(tr, oldSet, _, newState) {
						const meta = tr.getMeta(tashkeelPluginKey);
						if (meta !== undefined) {
							ext.options.hideTashkeel = meta.hide;
							return buildDecorations(newState.doc, meta.hide);
						}
						if (tr.docChanged) {
							return buildDecorations(newState.doc, ext.options.hideTashkeel);
						}
						return oldSet;
					}
				},
				props: {
					decorations(state) {
						return tashkeelPluginKey.getState(state);
					}
				}
			})
		];
	}
});

export { tashkeelPluginKey };
