<script lang="ts">
	import { settings, FONTS } from '$lib/stores/settings.svelte';
	import { scriptStore } from '$lib/stores/script.svelte';
	import Controls from './Controls.svelte';

	let textEl: HTMLDivElement | undefined = $state();
	let animationFrameId: number;
	let lastTimestamp = 0;
	let controlsVisible = $state(true);
	let controlsTimeout: number;

	const fontConfig = $derived(FONTS.find((f) => f.name === settings.fontFamily));

	const lines = $derived(scriptStore.text.split('\n'));

	function scrollLoop(timestamp: number) {
		if (lastTimestamp > 0 && scriptStore.isPlaying) {
			const delta = timestamp - lastTimestamp;
			const pxPerSecond = settings.scrollSpeed * 50;
			const newPosition = scriptStore.scrollPosition + (delta / 1000) * pxPerSecond;

			if (textEl) {
				const maxScroll = Math.max(0, textEl.scrollHeight - window.innerHeight * 0.7);
				if (newPosition >= maxScroll) {
					scriptStore.scrollPosition = maxScroll;
					scriptStore.isPlaying = false;
				} else {
					scriptStore.scrollPosition = newPosition;
				}
			} else {
				scriptStore.scrollPosition = newPosition;
			}
		}
		lastTimestamp = timestamp;
		animationFrameId = requestAnimationFrame(scrollLoop);
	}

	$effect(() => {
		lastTimestamp = 0;
		animationFrameId = requestAnimationFrame(scrollLoop);
		return () => cancelAnimationFrame(animationFrameId);
	});

	function showControls() {
		controlsVisible = true;
		clearTimeout(controlsTimeout);
		controlsTimeout = window.setTimeout(() => {
			if (scriptStore.isPlaying) controlsVisible = false;
		}, 3000);
	}

	function handleKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case ' ':
				e.preventDefault();
				scriptStore.isPlaying = !scriptStore.isPlaying;
				showControls();
				break;
			case 'ArrowUp':
				e.preventDefault();
				scriptStore.scrollPosition = Math.max(0, scriptStore.scrollPosition - 100);
				break;
			case 'ArrowDown':
				e.preventDefault();
				scriptStore.scrollPosition += 100;
				break;
			case '+':
			case '=':
				settings.scrollSpeed = Math.min(10, settings.scrollSpeed + 0.5);
				showControls();
				break;
			case '-':
				settings.scrollSpeed = Math.max(0.5, settings.scrollSpeed - 0.5);
				showControls();
				break;
			case 'Escape':
				scriptStore.mode = 'edit';
				scriptStore.isPlaying = false;
				break;
		}
	}

	function handleMouseMove() {
		showControls();
	}

	let touchStartY = 0;
	let touchStartScroll = 0;
	let wasTouchDrag = false;

	function handleTouchStart(e: TouchEvent) {
		touchStartY = e.touches[0].clientY;
		touchStartScroll = scriptStore.scrollPosition;
		wasTouchDrag = false;
	}

	function handleTouchMove(e: TouchEvent) {
		e.preventDefault();
		const deltaY = touchStartY - e.touches[0].clientY;
		if (Math.abs(deltaY) > 5) wasTouchDrag = true;
		scriptStore.scrollPosition = Math.max(0, touchStartScroll + deltaY);
	}

	function handleTouchEnd() {
		if (!wasTouchDrag) {
			scriptStore.isPlaying = !scriptStore.isPlaying;
			showControls();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="teleprompter"
	role="presentation"
	onmousemove={handleMouseMove}
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
>
	<div class="reading-guide"></div>

	<div
		class="text-content"
		bind:this={textEl}
		dir="rtl"
		style="
			transform: translateY(-{scriptStore.scrollPosition}px);
			font-size: {settings.fontSize}px;
			font-family: {fontConfig?.family ?? "'Amiri', serif"};
			line-height: {settings.lineHeight};
			padding-left: {settings.margins}%;
			padding-right: {settings.margins}%;
		"
	>
		{#each lines as line}
			{#if line.trim() === ''}
				<div
					class="empty-line"
					style="height: {settings.fontSize * settings.lineHeight * 0.5}px"
				></div>
			{:else}
				<p>{line}</p>
			{/if}
		{/each}
	</div>

	<div class="controls-overlay" class:visible={controlsVisible}>
		<Controls />
	</div>
</div>

<style>
	.teleprompter {
		position: fixed;
		inset: 0;
		background: var(--prompter-bg, #000);
		overflow: hidden;
		z-index: 100;
		cursor: none;
	}

	.teleprompter:hover {
		cursor: default;
	}

	.reading-guide {
		position: fixed;
		top: 30%;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--reading-guide, rgba(255, 60, 60, 0.25));
		z-index: 101;
		pointer-events: none;
		box-shadow: 0 0 20px 4px rgba(255, 60, 60, 0.08);
	}

	.text-content {
		color: var(--prompter-text, #fff);
		text-align: right;
		padding-top: 30vh;
		padding-bottom: 100vh;
		will-change: transform;
		user-select: none;
		-webkit-user-select: none;
	}

	.text-content p {
		margin: 0;
		padding: 0.1em 0;
	}

	.controls-overlay {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 102;
		pointer-events: none;
	}

	.controls-overlay.visible {
		opacity: 1;
		pointer-events: auto;
	}
</style>
