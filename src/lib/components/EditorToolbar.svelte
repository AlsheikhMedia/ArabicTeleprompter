<script lang="ts">
	import type { Editor } from '@tiptap/core';

	let { editor }: { editor: Editor } = $props();

	let isBold = $state(false);
	let isItalic = $state(false);
	let isUnderline = $state(false);
	let isRtl = $state(true);
	let textColor = $state('#e0e0f0');

	$effect(() => {
		const update = () => {
			isBold = editor.isActive('bold');
			isItalic = editor.isActive('italic');
			isUnderline = editor.isActive('underline');
			const dir = editor.getAttributes('paragraph').dir;
			isRtl = dir !== 'ltr';
		};

		editor.on('selectionUpdate', update);
		editor.on('transaction', update);
		update();

		return () => {
			editor.off('selectionUpdate', update);
			editor.off('transaction', update);
		};
	});

	function setColor(e: Event) {
		const color = (e.target as HTMLInputElement).value;
		textColor = color;
		editor.chain().focus().setColor(color).run();
	}

	function setHighlight(e: Event) {
		const color = (e.target as HTMLInputElement).value;
		editor.chain().focus().toggleHighlight({ color }).run();
	}

	function toggleDirection() {
		const newDir = isRtl ? 'ltr' : 'rtl';
		editor.chain().focus().setTextDirection(newDir).run();
	}

	function insertSegment() {
		const label = prompt('اسم المقطع (اتركه فارغاً للفاصل الافتراضي):') ?? '';
		editor.chain().focus().insertSegmentMarker(label).run();
	}
</script>

<div class="editor-toolbar" dir="rtl">
	<div class="toolbar-group">
		<button
			class="format-btn"
			class:active={isBold}
			onclick={() => editor.chain().focus().toggleBold().run()}
			title="غامق (Ctrl+B)"
		>
			<strong>غ</strong>
		</button>
		<button
			class="format-btn"
			class:active={isItalic}
			onclick={() => editor.chain().focus().toggleItalic().run()}
			title="مائل (Ctrl+I)"
		>
			<em>م</em>
		</button>
		<button
			class="format-btn"
			class:active={isUnderline}
			onclick={() => editor.chain().focus().toggleUnderline().run()}
			title="تحته خط (Ctrl+U)"
		>
			<u>خ</u>
		</button>
	</div>

	<div class="toolbar-sep"></div>

	<div class="toolbar-group">
		<label class="color-btn" title="لون النص">
			<span class="color-swatch" style="background: {textColor}"></span>
			<input type="color" value={textColor} onchange={setColor} />
		</label>
		<label class="color-btn" title="تظليل">
			<span class="highlight-label">هـ</span>
			<input type="color" value="#ffd43b" onchange={setHighlight} />
		</label>
	</div>

	<div class="toolbar-sep"></div>

	<div class="toolbar-group">
		<button class="format-btn" class:active={!isRtl} onclick={toggleDirection} title="اتجاه النص">
			{isRtl ? 'عربي' : 'LTR'}
		</button>
	</div>

	<div class="toolbar-sep"></div>

	<div class="toolbar-group">
		<button class="format-btn" onclick={insertSegment} title="إدراج فاصل مقطع">
			فاصل
		</button>
	</div>
</div>

<style>
	.editor-toolbar {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.4rem 1rem;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		flex-wrap: wrap;
	}

	.toolbar-group {
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	.toolbar-sep {
		width: 1px;
		height: 22px;
		background: var(--border);
		margin: 0 0.4rem;
	}

	.format-btn {
		min-width: 32px;
		height: 32px;
		padding: 0 0.5rem;
		font-size: 0.85rem;
		border-radius: 4px;
		background: transparent;
		color: var(--text-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.format-btn:hover {
		background: var(--bg-tertiary);
		color: var(--text-primary);
	}

	.format-btn.active {
		background: var(--accent);
		color: #fff;
	}

	.color-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		cursor: pointer;
		border-radius: 4px;
	}

	.color-btn:hover {
		background: var(--bg-tertiary);
	}

	.color-btn input[type='color'] {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
		width: 100%;
		height: 100%;
	}

	.color-swatch {
		width: 16px;
		height: 16px;
		border-radius: 3px;
		border: 1px solid var(--border);
	}

	.highlight-label {
		font-size: 0.9rem;
		color: var(--text-secondary);
		background: rgba(255, 212, 59, 0.3);
		padding: 0 4px;
		border-radius: 2px;
	}
</style>
