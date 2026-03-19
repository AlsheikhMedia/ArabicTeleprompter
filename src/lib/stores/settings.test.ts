import { describe, it, expect, beforeEach } from 'vitest';
import { settings, saveSettings, loadSettings, FONTS } from './settings.svelte';

const STORAGE_KEY = 'arabic-teleprompter-settings';

function resetSettings() {
	settings.fontSize = 56;
	settings.scrollSpeed = 2;
	settings.fontFamily = 'Amiri';
	settings.lineHeight = 2.0;
	settings.margins = 10;
	settings.highContrast = true;
	settings.showSettings = false;
	settings.mirrorMode = false;
	settings.showTashkeel = true;
}

describe('SettingsStore', () => {
	beforeEach(() => {
		localStorage.clear();
		resetSettings();
	});

	it('has correct default values', () => {
		expect(settings.fontSize).toBe(56);
		expect(settings.scrollSpeed).toBe(2);
		expect(settings.fontFamily).toBe('Amiri');
		expect(settings.lineHeight).toBe(2.0);
		expect(settings.margins).toBe(10);
		expect(settings.highContrast).toBe(true);
		expect(settings.mirrorMode).toBe(false);
		expect(settings.showTashkeel).toBe(true);
	});

	it('FONTS array has 4 entries', () => {
		expect(FONTS).toHaveLength(4);
		expect(FONTS.map((f) => f.name)).toEqual([
			'Amiri',
			'Cairo',
			'Noto Naskh Arabic',
			'Tajawal'
		]);
	});
});

describe('saveSettings / loadSettings', () => {
	beforeEach(() => {
		localStorage.clear();
		resetSettings();
	});

	it('round-trips settings through localStorage', () => {
		settings.fontSize = 72;
		settings.scrollSpeed = 5;
		settings.fontFamily = 'Cairo';
		settings.mirrorMode = true;
		settings.showTashkeel = false;

		saveSettings();
		resetSettings();

		expect(settings.fontSize).toBe(56);

		loadSettings();

		expect(settings.fontSize).toBe(72);
		expect(settings.scrollSpeed).toBe(5);
		expect(settings.fontFamily).toBe('Cairo');
		expect(settings.mirrorMode).toBe(true);
		expect(settings.showTashkeel).toBe(false);
	});

	it('loadSettings handles missing localStorage gracefully', () => {
		loadSettings();
		expect(settings.fontSize).toBe(56);
	});

	it('loadSettings handles corrupted JSON gracefully', () => {
		localStorage.setItem(STORAGE_KEY, '{invalid json!!!');
		loadSettings();
		expect(settings.fontSize).toBe(56);
	});

	it('loadSettings partial data only updates present fields', () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 100 }));
		loadSettings();
		expect(settings.fontSize).toBe(100);
		expect(settings.scrollSpeed).toBe(2);
		expect(settings.fontFamily).toBe('Amiri');
	});
});
