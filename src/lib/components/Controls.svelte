<script lang="ts">
	import { settings } from '$lib/stores/settings.svelte';
	import { scriptStore } from '$lib/stores/script.svelte';

	function exitToEditor() {
		scriptStore.mode = 'edit';
		scriptStore.isPlaying = false;
	}
</script>

<div class="controls" dir="rtl">
	<div class="controls-row">
		<button class="btn-icon btn-back" onclick={exitToEditor} title="رجوع">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>

		<button
			class="btn-icon btn-play"
			onclick={() => (scriptStore.isPlaying = !scriptStore.isPlaying)}
			title={scriptStore.isPlaying ? 'إيقاف' : 'تشغيل'}
		>
			{#if scriptStore.isPlaying}
				<svg viewBox="0 0 24 24" fill="currentColor">
					<rect x="6" y="4" width="4" height="16" />
					<rect x="14" y="4" width="4" height="16" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" fill="currentColor">
					<polygon points="6,4 20,12 6,20" />
				</svg>
			{/if}
		</button>

		<div class="control-group">
			<span class="control-label">السرعة</span>
			<input type="range" min="0.5" max="10" step="0.5" bind:value={settings.scrollSpeed} />
			<span class="control-value">{settings.scrollSpeed}</span>
		</div>

		<div class="control-group">
			<span class="control-label">الخط</span>
			<input type="range" min="24" max="120" step="2" bind:value={settings.fontSize} />
			<span class="control-value">{settings.fontSize}</span>
		</div>

		<button
			class="btn-icon btn-reset"
			onclick={() => (scriptStore.scrollPosition = 0)}
			title="البداية"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="1 4 1 10 7 10" />
				<path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
			</svg>
		</button>
	</div>

	<div class="controls-hint">
		مسافة: تشغيل/إيقاف &nbsp; | &nbsp; سهم لأعلى/لأسفل: تمرير &nbsp; | &nbsp; +/−: سرعة
		&nbsp; | &nbsp; Esc: رجوع
	</div>
</div>

<style>
	.controls {
		background: linear-gradient(transparent, var(--controls-bg) 30%);
		padding: 3rem 2rem 1.25rem;
	}

	.controls-row {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	.btn-icon:hover {
		background: rgba(255, 255, 255, 0.2);
		color: #fff;
	}

	.btn-icon svg {
		width: 20px;
		height: 20px;
	}

	.btn-play {
		width: 52px;
		height: 52px;
		background: var(--accent);
	}

	.btn-play:hover {
		background: var(--accent-hover);
	}

	.btn-play svg {
		width: 22px;
		height: 22px;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.85rem;
	}

	.control-label {
		white-space: nowrap;
	}

	.control-value {
		min-width: 2rem;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.control-group input[type='range'] {
		width: 100px;
		background: rgba(255, 255, 255, 0.15);
	}

	.controls-hint {
		text-align: center;
		margin-top: 0.75rem;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.3);
	}
</style>
