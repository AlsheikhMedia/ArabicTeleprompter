import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		textDirection: {
			setTextDirection: (direction: 'rtl' | 'ltr') => ReturnType;
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
						parseHTML: (element) => element.getAttribute('dir') || 'rtl',
						renderHTML: (attributes) => {
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
				(direction: 'rtl' | 'ltr') =>
				({ commands }) => {
					return commands.updateAttributes('paragraph', { dir: direction });
				}
		};
	}
});
