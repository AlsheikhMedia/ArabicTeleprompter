<script lang="ts">
	import { scriptStore, saveScript } from '$lib/stores/script.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import { parseFile } from '$lib/utils/import';

	function startPrompting() {
		if (!scriptStore.text.trim()) return;
		saveScript();
		scriptStore.scrollPosition = 0;
		scriptStore.isPlaying = true;
		scriptStore.mode = 'prompt';
	}

	async function importFile() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.txt,.text,.docx';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			try {
				const html = await parseFile(file);
				scriptStore.setContent(html, file.name.replace(/\.[^.]+$/, ''));
			} catch (err) {
				console.error('Import failed:', err);
				alert('فشل استيراد الملف. تأكد من أن الملف بصيغة مدعومة.');
			}
		};
		input.click();
	}

	function clearText() {
		if (scriptStore.text && confirm('هل تريد مسح النص الحالي؟')) {
			scriptStore.setContent('<p></p>');
		}
	}
</script>

<header class="toolbar" dir="rtl">
	<div class="toolbar-start">
		<h1 class="app-title">التلقين العربي</h1>
	</div>
	<div class="toolbar-end">
		<button class="btn-secondary" onclick={importFile}>استيراد</button>
		<button class="btn-secondary" onclick={clearText}>مسح</button>
		<button class="btn-play" onclick={startPrompting} disabled={!scriptStore.text.trim()}>
			تشغيل
		</button>
		<button
			class="btn-secondary"
			onclick={() => (settings.showSettings = !settings.showSettings)}
		>
			الإعدادات
		</button>
	</div>
</header>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 56px;
		padding: 0 1.25rem;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}

	.app-title {
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--accent);
		letter-spacing: -0.01em;
	}

	.toolbar-end {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.btn-secondary {
		background: var(--bg-tertiary);
		color: var(--text-primary);
	}

	.btn-play {
		background: var(--accent);
		color: #fff;
		font-weight: 600;
		padding: 0.5rem 1.5rem;
	}

	.btn-play:hover:not(:disabled) {
		background: var(--accent-hover);
	}

	.btn-play:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
