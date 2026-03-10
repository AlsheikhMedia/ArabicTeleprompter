import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		segmentMarker: {
			insertSegmentMarker: (label?: string) => ReturnType;
		};
	}
}

export const SegmentMarker = Node.create({
	name: 'segmentMarker',
	group: 'block',
	atom: true,
	draggable: true,
	selectable: true,

	addAttributes() {
		return {
			label: {
				default: ''
			}
		};
	},

	parseHTML() {
		return [
			{
				tag: 'div[data-segment-marker]'
			}
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				'data-segment-marker': '',
				class: 'segment-marker'
			}),
			HTMLAttributes.label || '---'
		];
	},

	addCommands() {
		return {
			insertSegmentMarker:
				(label: string = '') =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: { label }
					});
				}
		};
	}
});
