const STORAGE_KEY = 'arabic-teleprompter-settings';

export interface FontOption {
	name: string;
	family: string;
	label: string;
}

export const FONTS: FontOption[] = [
	{ name: 'Amiri', family: "'Amiri', serif", label: 'أميري' },
	{ name: 'Cairo', family: "'Cairo', sans-serif", label: 'القاهرة' },
	{ name: 'Noto Naskh Arabic', family: "'Noto Naskh Arabic', serif", label: 'نوتو نسخ' },
	{ name: 'Tajawal', family: "'Tajawal', sans-serif", label: 'تجوال' }
];

class SettingsStore {
	fontSize = $state(56);
	scrollSpeed = $state(2);
	fontFamily = $state('Amiri');
	lineHeight = $state(2.0);
	margins = $state(10);
	highContrast = $state(true);
	showSettings = $state(false);
	mirrorMode = $state(false);
	showTashkeel = $state(true);
}

export const settings = new SettingsStore();

export function saveSettings(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				fontSize: settings.fontSize,
				scrollSpeed: settings.scrollSpeed,
				fontFamily: settings.fontFamily,
				lineHeight: settings.lineHeight,
				margins: settings.margins,
				highContrast: settings.highContrast,
				mirrorMode: settings.mirrorMode,
				showTashkeel: settings.showTashkeel
			})
		);
	} catch {
		// localStorage unavailable or full
	}
}

export function loadSettings(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		const data = JSON.parse(raw);
		if (data.fontSize != null) settings.fontSize = data.fontSize;
		if (data.scrollSpeed != null) settings.scrollSpeed = data.scrollSpeed;
		if (data.fontFamily != null) settings.fontFamily = data.fontFamily;
		if (data.lineHeight != null) settings.lineHeight = data.lineHeight;
		if (data.margins != null) settings.margins = data.margins;
		if (data.highContrast != null) settings.highContrast = data.highContrast;
		if (data.mirrorMode != null) settings.mirrorMode = data.mirrorMode;
		if (data.showTashkeel != null) settings.showTashkeel = data.showTashkeel;
	} catch {
		// corrupted data, use defaults
	}
}
