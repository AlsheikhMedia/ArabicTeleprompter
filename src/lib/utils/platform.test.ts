import { describe, it, expect } from 'vitest';
import { isTauri, isMobile, isTouchDevice } from './platform';

describe('isTauri', () => {
	it('returns false in jsdom (no __TAURI_INTERNALS__)', () => {
		expect(isTauri()).toBe(false);
	});

	it('returns true when __TAURI_INTERNALS__ exists', () => {
		(window as Record<string, unknown>).__TAURI_INTERNALS__ = {};
		expect(isTauri()).toBe(true);
		delete (window as Record<string, unknown>).__TAURI_INTERNALS__;
	});
});

describe('isMobile', () => {
	it('returns false for desktop userAgent', () => {
		expect(isMobile()).toBe(false);
	});
});

describe('isTouchDevice', () => {
	it('returns a boolean', () => {
		expect(typeof isTouchDevice()).toBe('boolean');
	});
});
