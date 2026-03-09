export function isTauri(): boolean {
	return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export function isMobile(): boolean {
	if (typeof navigator === 'undefined') return false;
	return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isTouchDevice(): boolean {
	if (typeof window === 'undefined') return false;
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
