<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { StarterKit } from '@tiptap/starter-kit';
	import { Underline } from '@tiptap/extension-underline';
	import { TextStyle } from '@tiptap/extension-text-style';
	import { Color } from '@tiptap/extension-color';
	import { Highlight } from '@tiptap/extension-highlight';
	import { TextDirection } from '$lib/extensions/text-direction';
	import { SegmentMarker } from '$lib/extensions/segment-marker';
	import { scriptStore, saveScript } from '$lib/stores/script.svelte';
	import { settings, FONTS } from '$lib/stores/settings.svelte';
	import { countWordsInHtml } from '$lib/utils/import';
	import EditorToolbar from './EditorToolbar.svelte';

	let editorElement: HTMLDivElement | undefined = $state();
	let editor: Editor | undefined;
	let editorReady = $state(false);
	let lastContentVersion = 0;

	const fontConfig = $derived(FONTS.find((f) => f.name === settings.fontFamily));
	const wordCount = $derived(countWordsInHtml(scriptStore.text));
	const readingTime = $derived(Math.ceil(wordCount / 150));

	$effect(() => {
		if (!editorElement) return;

		const ed = new Editor({
			element: editorElement,
			extensions: [
				StarterKit,
				Underline,
				TextStyle,
				Color,
				Highlight.configure({ multicolor: true }),
				TextDirection,
				SegmentMarker
			],
			content: scriptStore.text,
			editorProps: {
				attributes: {
					dir: 'rtl',
					class: 'prosemirror-editor'
				}
			},
			onUpdate: ({ editor: e }) => {
				scriptStore.text = e.getHTML();
				lastContentVersion = scriptStore._contentVersion;
			},
			onBlur: () => {
				saveScript();
			}
		});

		editor = ed;
		editorReady = true;
		lastContentVersion = scriptStore._contentVersion;

		return () => {
			ed.destroy();
			editor = undefined;
			editorReady = false;
		};
	});

	// Watch for external content changes (e.g. from file import)
	$effect(() => {
		const version = scriptStore._contentVersion;
		if (version > lastContentVersion && editor) {
			editor.commands.setContent(scriptStore.text);
			lastContentVersion = version;
		}
	});
</script>

<main class="editor" dir="rtl">
	{#if editorReady && editor}
		<EditorToolbar {editor} />
	{/if}

	<div class="editor-stats">
		<span>{wordCount} كلمة</span>
		<span class="separator">|</span>
		<span>~{readingTime} دقيقة قراءة</span>
	</div>

	<div
		class="editor-area"
		bind:this={editorElement}
		style="--editor-font: {fontConfig?.family ?? "'Amiri', serif"}"
	></div>
</main>

<style>
	.editor {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 56px);
	}

	.editor-stats {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 1rem;
		font-size: 0.8rem;
		color: var(--text-secondary);
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border);
	}

	.separator {
		opacity: 0.4;
	}

	.editor-area {
		flex: 1;
		overflow-y: auto;
		background: var(--bg-primary);
	}

	.editor-area :global(.prosemirror-editor) {
		direction: rtl;
		text-align: right;
		outline: none;
		min-height: 100%;
		padding: 1.5rem 2rem;
		font-size: 1.2rem;
		line-height: 2;
		font-family: var(--editor-font);
		color: var(--text-primary);
	}

	.editor-area :global(.prosemirror-editor p) {
		margin: 0;
		padding: 0.1em 0;
	}

	.editor-area :global(.prosemirror-editor p[dir='ltr']) {
		text-align: left;
	}

	.editor-area :global(.prosemirror-editor .segment-marker) {
		border-top: 2px dashed var(--accent);
		margin: 1em 0;
		padding: 0.4em 0.8em;
		color: var(--accent);
		font-size: 0.8em;
		text-align: center;
		user-select: none;
		cursor: pointer;
		border-radius: 4px;
		background: rgba(77, 166, 255, 0.05);
	}

	.editor-area :global(.prosemirror-editor .segment-marker:hover) {
		background: rgba(77, 166, 255, 0.1);
	}

	.editor-area :global(.ProseMirror-focused) {
		outline: none;
	}

	.editor-area :global(.prosemirror-editor mark) {
		border-radius: 2px;
		padding: 0 2px;
	}
</style>
