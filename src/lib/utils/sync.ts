const CHANNEL_NAME = 'arabic-teleprompter-sync';

export interface SyncState {
	scrollPosition: number;
	isPlaying: boolean;
	text: string;
	fontSize: number;
	fontFamily: string;
	lineHeight: number;
	margins: number;
	mirrorMode: boolean;
	showTashkeel: boolean;
}

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel {
	if (!channel && typeof BroadcastChannel !== 'undefined') {
		channel = new BroadcastChannel(CHANNEL_NAME);
	}
	return channel!;
}

export function broadcastState(state: SyncState): void {
	try {
		getChannel()?.postMessage(state);
	} catch {
		// BroadcastChannel not available
	}
}

export function onSyncMessage(callback: (state: SyncState) => void): () => void {
	try {
		const ch = getChannel();
		if (!ch) return () => {};
		const handler = (e: MessageEvent) => callback(e.data);
		ch.addEventListener('message', handler);
		return () => ch.removeEventListener('message', handler);
	} catch {
		return () => {};
	}
}
