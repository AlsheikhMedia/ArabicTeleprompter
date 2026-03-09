const STORAGE_KEY = 'arabic-teleprompter-script';

const DEFAULT_TEXT = `بسم الله الرحمن الرحيم

أهلاً وسهلاً بكم في نشرة الأخبار المسائية

نبدأ نشرتنا هذا المساء بآخر المستجدات والأحداث التي شهدها العالم العربي اليوم. تابعوا معنا التفاصيل في التقرير التالي.

في الخبر الأول، أعلنت وزارة التعليم عن خطة جديدة لتطوير المناهج الدراسية في جميع المراحل التعليمية. وقال وزير التعليم في مؤتمر صحفي إن الخطة تهدف إلى مواكبة التطورات التكنولوجية الحديثة وتعزيز مهارات التفكير النقدي لدى الطلاب.

وفي الشأن الاقتصادي، سجلت أسواق المال ارتفاعاً ملحوظاً في تعاملات اليوم، حيث ارتفع المؤشر العام بنسبة اثنين في المائة، مدفوعاً بأداء قوي لقطاعي البنوك والطاقة.

ومن أخبار الرياضة، تأهل المنتخب الوطني لكرة القدم إلى الدور نصف النهائي من بطولة كأس العرب، بعد فوزه على نظيره بهدفين مقابل هدف واحد في مباراة مثيرة شهدها استاد المدينة الرياضية.

وفي أخبار الطقس، تتوقع هيئة الأرصاد الجوية أن يكون الطقس غداً معتدلاً في معظم المناطق، مع احتمال هطول أمطار خفيفة على المناطق الشمالية.

هذا وقد شهدت العاصمة اليوم افتتاح المعرض الدولي للكتاب في دورته الخامسة والثلاثين، بمشاركة أكثر من خمسمائة دار نشر من مختلف أنحاء العالم العربي والعالم.

نشكركم على متابعتكم، ونلتقي بكم في النشرة القادمة. دمتم بخير.`;

class ScriptStore {
	text = $state(DEFAULT_TEXT);
	title = $state('نص جديد');
	isPlaying = $state(false);
	scrollPosition = $state(0);
	mode = $state<'edit' | 'prompt'>('edit');
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
	} catch {
		// localStorage unavailable or full
	}
}

export function loadScript(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		const data = JSON.parse(raw);
		if (data.text != null) scriptStore.text = data.text;
		if (data.title != null) scriptStore.title = data.title;
	} catch {
		// corrupted data, use defaults
	}
}
