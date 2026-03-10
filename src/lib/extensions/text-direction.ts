import { Extension, type CommandProps } from '@tiptap/core';
import type { Node as PmNode } from '@tiptap/pm/model';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		textDirection: {
			setTextDirection: (direction: 'rtl' | 'ltr' | 'auto') => ReturnType;
		};
	}
}

export const TextDirection = Extension.create({
	name: 'textDirection',

	addGlobalAttributes() {
		return [
			{
				types: ['paragraph', 'heading'],
				attributes: {
					dir: {
						default: 'rtl',
						parseHTML: (element: HTMLElement) => element.getAttribute('dir') || 'rtl',
						renderHTML: (attributes: Record<string, string>) => {
							return { dir: attributes.dir, style: `text-align: ${attributes.dir === 'ltr' ? 'left' : 'right'}` };
						}
					}
				}
			}
		];
	},

	addCommands() {
		return {
			setTextDirection:
				(direction: 'rtl' | 'ltr' | 'auto') =>
				({ tr }: CommandProps) => {
					const { from, to } = tr.selection;
					const targets: { pos: number; node: PmNode }[] = [];
					tr.doc.nodesBetween(from, to, (node: PmNode, pos: number) => {
						if (node.type.name === 'paragraph' || node.type.name === 'heading') {
							targets.push({ pos, node });
						}
					});
					if (targets.length === 0) return false;
					// Apply in reverse to preserve positions
					for (let i = targets.length - 1; i >= 0; i--) {
						const { pos, node } = targets[i];
						tr.setNodeMarkup(pos, undefined, { ...node.attrs, dir: direction });
					}
					return true;
				}
		};
	}
});
