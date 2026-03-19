import { vi, beforeEach } from 'vitest';

// Node 22+ has a built-in localStorage that lacks .clear()
// Override with a proper in-memory implementation for tests
const store = new Map<string, string>();

vi.stubGlobal('localStorage', {
	getItem: (key: string) => store.get(key) ?? null,
	setItem: (key: string, value: string) => store.set(key, String(value)),
	removeItem: (key: string) => store.delete(key),
	clear: () => store.clear(),
	get length() {
		return store.size;
	},
	key: (index: number) => [...store.keys()][index] ?? null
});

beforeEach(() => {
	store.clear();
});
