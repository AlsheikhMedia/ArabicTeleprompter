<script lang="ts">
	import { scriptStore } from '$lib/stores/script.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import Teleprompter from '$lib/components/Teleprompter.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
</script>

{#if scriptStore.mode === 'prompt'}
	<Teleprompter />
{:else}
	<Toolbar />
	<Editor />
{/if}

<SettingsPanel />
