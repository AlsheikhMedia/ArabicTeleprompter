<script lang="ts">
	import '../app.css';
	import '@fontsource/amiri/400.css';
	import '@fontsource/amiri/700.css';
	import '@fontsource/cairo/400.css';
	import '@fontsource/cairo/700.css';
	import '@fontsource/noto-naskh-arabic/400.css';
	import '@fontsource/noto-naskh-arabic/700.css';
	import '@fontsource/tajawal/400.css';
	import '@fontsource/tajawal/700.css';
	import { loadSettings, saveSettings } from '$lib/stores/settings.svelte';
	import { loadScript, saveScript } from '$lib/stores/script.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import { scriptStore } from '$lib/stores/script.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	loadSettings();
	loadScript();

	$effect(() => {
		// Track reactive state for auto-save
		void settings.fontSize;
		void settings.scrollSpeed;
		void settings.fontFamily;
		void settings.lineHeight;
		void settings.margins;
		void settings.highContrast;
		saveSettings();
	});

	$effect(() => {
		void scriptStore.text;
		void scriptStore.title;
		saveScript();
	});
</script>

{@render children()}
