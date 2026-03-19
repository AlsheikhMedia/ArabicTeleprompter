import { describe, it, expect, beforeEach } from 'vitest';
import {
	scriptStore,
	saveScript,
	loadScript,
	saveCrashState,
	loadCrashState,
	clearCrashState
} from './script.svelte';

const STORAGE_KEY = 'arabic-teleprompter-script';

function resetScript() {
	scriptStore.text = '<p>بسم الله الرحمن الرحيم</p>';
	scriptStore.title = 'نص جديد';
	scriptStore.isPlaying = false;
	scriptStore.scrollPosition = 0;
	scriptStore.mode = 'edit';
}

describe('ScriptStore', () => {
	beforeEach(() => {
		localStorage.clear();
		resetScript();
	});

	it('has correct default title', () => {
		expect(scriptStore.title).toBe('نص جديد');
	});

	it('has correct default mode', () => {
		expect(scriptStore.mode).toBe('edit');
	});

	it('setContent updates text and increments _contentVersion', () => {
		const versionBefore = scriptStore._contentVersion;
		scriptStore.setContent('<p>نص جديد تماماً</p>');
		expect(scriptStore.text).toBe('<p>نص جديد تماماً</p>');
		expect(scriptStore._contentVersion).toBe(versionBefore + 1);
	});

	it('setContent with title updates both', () => {
		scriptStore.setContent('<p>محتوى</p>', 'عنوان جديد');
		expect(scriptStore.text).toBe('<p>محتوى</p>');
		expect(scriptStore.title).toBe('عنوان جديد');
	});

	it('setContent without title keeps existing title', () => {
		scriptStore.title = 'عنوان أصلي';
		scriptStore.setContent('<p>محتوى</p>');
		expect(scriptStore.title).toBe('عنوان أصلي');
	});
});

describe('saveScript / loadScript', () => {
	beforeEach(() => {
		localStorage.clear();
		resetScript();
	});

	it('round-trips script through localStorage', () => {
		scriptStore.text = '<p>نص محفوظ</p>';
		scriptStore.title = 'عنوان محفوظ';
		saveScript();

		resetScript();
		loadScript();

		expect(scriptStore.text).toBe('<p>نص محفوظ</p>');
		expect(scriptStore.title).toBe('عنوان محفوظ');
	});

	it('migrates legacy plain text to HTML paragraphs', () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ text: 'سطر أول\nسطر ثاني', title: 'قديم' })
		);
		loadScript();
		expect(scriptStore.text).toBe('<p>سطر أول</p><p>سطر ثاني</p>');
	});

	it('does not migrate text that already contains HTML', () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ text: '<p>نص HTML</p>', title: 'حديث' })
		);
		loadScript();
		expect(scriptStore.text).toBe('<p>نص HTML</p>');
	});

	it('handles corrupted JSON gracefully', () => {
		localStorage.setItem(STORAGE_KEY, 'not json');
		loadScript();
		expect(scriptStore.text).toContain('بسم الله');
	});

	it('handles missing localStorage gracefully', () => {
		loadScript();
		expect(scriptStore.text).toContain('بسم الله');
	});
});

describe('crash recovery', () => {
	beforeEach(() => {
		localStorage.clear();
		resetScript();
	});

	it('saveCrashState writes state with active: true', () => {
		scriptStore.scrollPosition = 500;
		scriptStore.mode = 'prompt';
		saveCrashState();

		const state = loadCrashState();
		expect(state).not.toBeNull();
		expect(state!.scrollPosition).toBe(500);
		expect(state!.mode).toBe('prompt');
		expect(state!.active).toBe(true);
		expect(state!.timestamp).toBeGreaterThan(0);
	});

	it('loadCrashState returns null when no state exists', () => {
		expect(loadCrashState()).toBeNull();
	});

	it('clearCrashState makes loadCrashState return null', () => {
		saveCrashState();
		expect(loadCrashState()).not.toBeNull();

		clearCrashState();
		expect(loadCrashState()).toBeNull();
	});

	it('clearCrashState preserves data but sets active to false', () => {
		scriptStore.scrollPosition = 300;
		saveCrashState();
		clearCrashState();

		const raw = localStorage.getItem('arabic-teleprompter-crash');
		expect(raw).not.toBeNull();
		const data = JSON.parse(raw!);
		expect(data.active).toBe(false);
		expect(data.scrollPosition).toBe(300);
	});
});
