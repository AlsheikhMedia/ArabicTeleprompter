<script lang="ts">
	import { settings, FONTS, saveSettings } from '$lib/stores/settings.svelte';

	function close() {
		settings.showSettings = false;
		saveSettings();
	}
</script>

{#if settings.showSettings}
	<div class="overlay" role="presentation" onclick={close}></div>
	<aside class="panel" dir="rtl">
		<div class="panel-header">
			<h2>الإعدادات</h2>
			<button class="btn-close" onclick={close} aria-label="إغلاق">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>

		<div class="settings-body">
			<div class="setting">
				<label for="s-fontsize">حجم الخط</label>
				<div class="setting-control">
					<input id="s-fontsize" type="range" min="24" max="120" step="2" bind:value={settings.fontSize} />
					<span class="setting-value">{settings.fontSize}px</span>
				</div>
			</div>

			<div class="setting">
				<label for="s-speed">سرعة التمرير</label>
				<div class="setting-control">
					<input id="s-speed" type="range" min="0.5" max="10" step="0.5" bind:value={settings.scrollSpeed} />
					<span class="setting-value">{settings.scrollSpeed}</span>
				</div>
			</div>

			<div class="setting">
				<label for="s-font">الخط</label>
				<select id="s-font" bind:value={settings.fontFamily}>
					{#each FONTS as font}
						<option value={font.name}>{font.label}</option>
					{/each}
				</select>
			</div>

			<div class="setting">
				<label for="s-lineheight">تباعد الأسطر</label>
				<div class="setting-control">
					<input id="s-lineheight" type="range" min="1.2" max="3.5" step="0.1" bind:value={settings.lineHeight} />
					<span class="setting-value">{settings.lineHeight}</span>
				</div>
			</div>

			<div class="setting">
				<label for="s-margins">الهوامش</label>
				<div class="setting-control">
					<input id="s-margins" type="range" min="2" max="25" step="1" bind:value={settings.margins} />
					<span class="setting-value">{settings.margins}%</span>
				</div>
			</div>

			<div class="setting-divider"></div>

			<div class="setting">
				<label class="toggle-label">
					<span>وضع المرآة</span>
					<input type="checkbox" bind:checked={settings.mirrorMode} />
					<span class="toggle-track">
						<span class="toggle-thumb"></span>
					</span>
				</label>
			</div>

			<div class="setting">
				<label class="toggle-label">
					<span>عرض التشكيل</span>
					<input type="checkbox" bind:checked={settings.showTashkeel} />
					<span class="toggle-track">
						<span class="toggle-thumb"></span>
					</span>
				</label>
			</div>
		</div>

		<div class="panel-footer">
			<p>التلقين العربي v0.5.0</p>
		</div>
	</aside>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 200;
	}

	.panel {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 340px;
		max-width: 90vw;
		background: var(--bg-secondary);
		border-left: 1px solid var(--border);
		z-index: 201;
		display: flex;
		flex-direction: column;
		animation: slide-in 0.2s ease-out;
	}

	@keyframes slide-in {
		from { transform: translateX(100%); }
		to { transform: translateX(0); }
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border);
	}

	.panel-header h2 {
		font-size: 1.1rem;
		font-weight: 600;
	}

	.btn-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		border-radius: 6px;
		background: transparent;
	}

	.btn-close svg {
		width: 18px;
		height: 18px;
	}

	.settings-body {
		flex: 1;
		overflow-y: auto;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.setting {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.setting label {
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.setting-control {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.setting-control input[type='range'] {
		flex: 1;
	}

	.setting-value {
		min-width: 3rem;
		text-align: left;
		font-size: 0.85rem;
		font-variant-numeric: tabular-nums;
		color: var(--text-secondary);
	}

	.setting select {
		width: 100%;
	}

	.setting-divider {
		height: 1px;
		background: var(--border);
		margin: 0.25rem 0;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		user-select: none;
	}

	.toggle-label input[type='checkbox'] {
		display: none;
	}

	.toggle-track {
		width: 40px;
		height: 22px;
		background: var(--border);
		border-radius: 11px;
		position: relative;
		transition: background 0.2s;
		flex-shrink: 0;
	}

	.toggle-label input:checked + .toggle-track {
		background: var(--accent);
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 18px;
		height: 18px;
		background: #fff;
		border-radius: 50%;
		transition: transform 0.2s;
	}

	.toggle-label input:checked + .toggle-track .toggle-thumb {
		transform: translateX(18px);
	}

	.panel-footer {
		padding: 1rem 1.25rem;
		border-top: 1px solid var(--border);
		text-align: center;
	}

	.panel-footer p {
		font-size: 0.75rem;
		color: var(--text-secondary);
		opacity: 0.6;
	}
</style>
