<script lang="ts">
	import { scriptStore, saveScript } from '$lib/stores/script.svelte';
	import { settings, FONTS } from '$lib/stores/settings.svelte';

	const fontConfig = $derived(FONTS.find((f) => f.name === settings.fontFamily));
	const wordCount = $derived(
		scriptStore.text.trim() ? scriptStore.text.trim().split(/\s+/).length : 0
	);
	const readingTime = $derived(Math.ceil(wordCount / 150));
</script>

<main class="editor" dir="rtl">
	<div class="editor-stats">
		<span>{wordCount} كلمة</span>
		<span class="separator">|</span>
		<span>~{readingTime} دقيقة قراءة</span>
	</div>

	<textarea
		bind:value={scriptStore.text}
		dir="rtl"
		placeholder="اكتب أو الصق النص هنا..."
		style="font-family: {fontConfig?.family ?? "'Amiri', serif"};"
		onblur={() => saveScript()}
	></textarea>
</main>

<style>
	.editor {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 56px);
		padding: 0;
	}

	.editor-stats {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1.25rem;
		font-size: 0.8rem;
		color: var(--text-secondary);
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border);
	}

	.separator {
		opacity: 0.4;
	}

	textarea {
		flex: 1;
		background: var(--bg-primary);
		color: var(--text-primary);
		border: none;
		padding: 1.5rem 2rem;
		font-size: 1.2rem;
		line-height: 2;
		resize: none;
		direction: rtl;
		text-align: right;
		outline: none;
		font-family: inherit;
	}

	textarea::placeholder {
		color: var(--text-secondary);
		opacity: 0.6;
	}
</style>
