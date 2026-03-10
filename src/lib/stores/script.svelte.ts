const STORAGE_KEY = 'arabic-teleprompter-script';
const CRASH_KEY = 'arabic-teleprompter-crash';

const DEFAULT_HTML = `<p>بسم الله الرحمن الرحيم</p>
<p></p>
<p>أهلاً وسهلاً بكم في نشرة الأخبار المسائية</p>
<p></p>
<p>نبدأ نشرتنا هذا المساء بآخر المستجدات والأحداث التي شهدها العالم العربي اليوم. تابعوا معنا التفاصيل في التقرير التالي.</p>
<p></p>
<p>في الخبر الأول، أعلنت وزارة التعليم عن خطة جديدة لتطوير المناهج الدراسية في جميع المراحل التعليمية. وقال وزير التعليم في مؤتمر صحفي إن الخطة تهدف إلى مواكبة التطورات التكنولوجية الحديثة وتعزيز مهارات التفكير النقدي لدى الطلاب.</p>
<p></p>
<p>وفي الشأن الاقتصادي، سجلت أسواق المال ارتفاعاً ملحوظاً في تعاملات اليوم، حيث ارتفع المؤشر العام بنسبة اثنين في المائة، مدفوعاً بأداء قوي لقطاعي البنوك والطاقة.</p>
<p></p>
<p>ومن أخبار الرياضة، تأهل المنتخب الوطني لكرة القدم إلى الدور نصف النهائي من بطولة كأس العرب، بعد فوزه على نظيره بهدفين مقابل هدف واحد في مباراة مثيرة شهدها استاد المدينة الرياضية.</p>
<p></p>
<p>وفي أخبار الطقس، تتوقع هيئة الأرصاد الجوية أن يكون الطقس غداً معتدلاً في معظم المناطق، مع احتمال هطول أمطار خفيفة على المناطق الشمالية.</p>
<p></p>
<p>هذا وقد شهدت العاصمة اليوم افتتاح المعرض الدولي للكتاب في دورته الخامسة والثلاثين، بمشاركة أكثر من خمسمائة دار نشر من مختلف أنحاء العالم العربي والعالم.</p>
<p></p>
<p>نشكركم على متابعتكم، ونلتقي بكم في النشرة القادمة. دمتم بخير.</p>`;

class ScriptStore {
	text = $state(DEFAULT_HTML);
	title = $state('نص جديد');
	isPlaying = $state(false);
	scrollPosition = $state(0);
	mode = $state<'edit' | 'prompt'>('edit');
	_contentVersion = $state(0);

	setContent(html: string, title?: string) {
		this.text = html;
		if (title) this.title = title;
		this._contentVersion++;
	}
}

export const scriptStore = new ScriptStore();

export function saveScript(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				text: scriptStore.text,
				title: scriptStore.title
			})
		);
	} catch {}
}

export function loadScript(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		const data = JSON.parse(raw);
		if (data.text != null) scriptStore.text = data.text;
		if (data.title != null) scriptStore.title = data.title;
	} catch {}
}

// --- Crash Recovery ---

interface CrashState {
	scrollPosition: number;
	mode: 'edit' | 'prompt';
	timestamp: number;
	active: boolean;
}

export function saveCrashState(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(
			CRASH_KEY,
			JSON.stringify({
				scrollPosition: scriptStore.scrollPosition,
				mode: scriptStore.mode,
				timestamp: Date.now(),
				active: true
			})
		);
	} catch {}
}

export function loadCrashState(): CrashState | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		const raw = localStorage.getItem(CRASH_KEY);
		if (!raw) return null;
		const state: CrashState = JSON.parse(raw);
		if (state.active) return state;
		return null;
	} catch {
		return null;
	}
}

export function clearCrashState(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		const raw = localStorage.getItem(CRASH_KEY);
		if (raw) {
			const state = JSON.parse(raw);
			state.active = false;
			localStorage.setItem(CRASH_KEY, JSON.stringify(state));
		}
	} catch {}
}
