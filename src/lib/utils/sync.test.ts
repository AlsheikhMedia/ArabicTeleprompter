import { describe, it, expect } from 'vitest';
import { isValidSyncState, type SyncState } from './sync';

const validState: SyncState = {
	scrollPosition: 100,
	isPlaying: true,
	text: '<p>مرحبا</p>',
	fontSize: 56,
	fontFamily: 'Amiri',
	lineHeight: 2.0,
	margins: 10,
	mirrorMode: false,
	showTashkeel: true
};

describe('isValidSyncState', () => {
	it('returns true for a complete valid state', () => {
		expect(isValidSyncState(validState)).toBe(true);
	});

	it('returns true for an empty object (all fields optional in validator)', () => {
		expect(isValidSyncState({})).toBe(true);
	});

	it('returns true for partial valid state', () => {
		expect(isValidSyncState({ scrollPosition: 50, isPlaying: false })).toBe(true);
	});

	it('returns false for null', () => {
		expect(isValidSyncState(null)).toBe(false);
	});

	it('returns false for non-object types', () => {
		expect(isValidSyncState('string')).toBe(false);
		expect(isValidSyncState(42)).toBe(false);
		expect(isValidSyncState(undefined)).toBe(false);
	});

	it('returns false when scrollPosition is wrong type', () => {
		expect(isValidSyncState({ scrollPosition: '100' })).toBe(false);
	});

	it('returns false when isPlaying is wrong type', () => {
		expect(isValidSyncState({ isPlaying: 'yes' })).toBe(false);
	});

	it('returns false when fontSize is wrong type', () => {
		expect(isValidSyncState({ fontSize: '56' })).toBe(false);
	});

	it('returns false when mirrorMode is wrong type', () => {
		expect(isValidSyncState({ mirrorMode: 1 })).toBe(false);
	});

	it('returns false when text is wrong type', () => {
		expect(isValidSyncState({ text: 123 })).toBe(false);
	});

	it('returns false when lineHeight is wrong type', () => {
		expect(isValidSyncState({ lineHeight: '2.0' })).toBe(false);
	});

	it('returns false when margins is wrong type', () => {
		expect(isValidSyncState({ margins: true })).toBe(false);
	});

	it('returns false when showTashkeel is wrong type', () => {
		expect(isValidSyncState({ showTashkeel: 0 })).toBe(false);
	});
});
