<script lang="ts">
	import { settings, FONTS } from '$lib/stores/settings.svelte';
	import { scriptStore } from '$lib/stores/script.svelte';
	import { stripTashkeelFromHtml } from '$lib/utils/tashkeel';
	import { broadcastState } from '$lib/utils/sync';
	import Controls from './Controls.svelte';

	let textEl: HTMLDivElement | undefined = $state();
	let animationFrameId: number;
	let lastTimestamp = 0;
	let controlsVisible = $state(true);
	let controlsTimeout: number;

	const fontConfig = $derived(FONTS.find((f) => f.name === settings.fontFamily));
	const displayHtml = $derived(
		settings.showTashkeel ? scriptStore.text : stripTashkeelFromHtml(scriptStore.text)
	);

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

	// Broadcast state for dual-screen sync
	let syncThrottle = 0;
	$effect(() => {
		const now = Date.now();
		if (now - syncThrottle < 50) return;
		syncThrottle = now;

		broadcastState({
			scrollPosition: scriptStore.scrollPosition,
			isPlaying: scriptStore.isPlaying,
			text: scriptStore.text,
			fontSize: settings.fontSize,
			fontFamily: settings.fontFamily,
			lineHeight: settings.lineHeight,
			margins: settings.margins,
			mirrorMode: settings.mirrorMode,
			showTashkeel: settings.showTashkeel
		});
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
			case 'PageUp':
				e.preventDefault();
				scriptStore.scrollPosition = Math.max(
					0,
					scriptStore.scrollPosition - (e.key === 'PageUp' ? 500 : 100)
				);
				break;
			case 'ArrowDown':
			case 'PageDown':
				e.preventDefault();
				scriptStore.scrollPosition += e.key === 'PageDown' ? 500 : 100;
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
			case 'm':
			case 'M':
				settings.mirrorMode = !settings.mirrorMode;
				showControls();
				break;
		}
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		scriptStore.scrollPosition = Math.max(0, scriptStore.scrollPosition + e.deltaY * 0.5);
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
	onwheel={handleWheel}
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
			transform: {settings.mirrorMode ? 'scaleX(-1) ' : ''}translateY(-{scriptStore.scrollPosition}px);
			font-size: {settings.fontSize}px;
			font-family: {fontConfig?.family ?? "'Amiri', serif"};
			line-height: {settings.lineHeight};
			padding-left: {settings.margins}%;
			padding-right: {settings.margins}%;
		"
	>
		{@html displayHtml}
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

	.text-content :global(p) {
		margin: 0;
		padding: 0.1em 0;
	}

	.text-content :global(p:empty) {
		min-height: 0.5em;
	}

	.text-content :global(p[dir='ltr']) {
		text-align: left;
	}

	.text-content :global(mark) {
		border-radius: 2px;
		padding: 0 3px;
	}

	.text-content :global(.segment-marker) {
		border-top: 2px solid rgba(255, 255, 255, 0.15);
		margin: 0.8em 0;
		padding: 0.3em 0;
		color: rgba(255, 255, 255, 0.35);
		font-size: 0.6em;
		text-align: center;
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
