import DOMPurify from 'dompurify';

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export function plainTextToHtml(text: string): string {
	return text
		.split('\n')
		.map((line) => (line.trim() === '' ? '<p></p>' : `<p>${escapeHtml(line)}</p>`))
		.join('');
}

export function isHtml(content: string): boolean {
	return /<[a-z][\s\S]*>/i.test(content.trim());
}

export async function importTxt(file: File): Promise<string> {
	const text = await file.text();
	return plainTextToHtml(text);
}

export async function importDocx(file: File): Promise<string> {
	const mammothModule = await import('mammoth');
	const mammoth = (mammothModule as Record<string, unknown>).default ?? mammothModule;
	const arrayBuffer = await file.arrayBuffer();
	const result = await (mammoth as typeof mammothModule).convertToHtml({ arrayBuffer });
	return DOMPurify.sanitize(result.value, {
		ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span', 'mark', 'sub', 'sup', 'div'],
		ALLOWED_ATTR: ['dir', 'class', 'data-segment-marker']
	});
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const SUPPORTED_EXTENSIONS: Record<string, (file: File) => Promise<string>> = {
	docx: importDocx,
	txt: importTxt,
	text: importTxt
};

const EXPECTED_MIME_TYPES: Record<string, string> = {
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	txt: 'text/plain',
	text: 'text/plain'
};

export async function parseFile(file: File): Promise<string> {
	if (file.size > MAX_FILE_SIZE) {
		throw new Error('حجم الملف يتجاوز الحد الأقصى (10 ميغابايت)');
	}

	// Extract extension in a single pass
	const dotIndex = file.name.lastIndexOf('.');
	if (dotIndex <= 0 || dotIndex === file.name.length - 1) {
		throw new Error('الملف بدون امتداد — يرجى استخدام ملف بصيغة TXT أو DOCX');
	}
	const ext = file.name.slice(dotIndex + 1).toLowerCase();

	// Reject unsupported extensions
	const importer = SUPPORTED_EXTENSIONS[ext];
	if (!importer) {
		throw new Error(`صيغة الملف .${ext} غير مدعومة — يرجى استخدام TXT أو DOCX`);
	}

	// Validate MIME type matches extension (defense-in-depth)
	const expectedType = EXPECTED_MIME_TYPES[ext];
	if (file.type && file.type !== expectedType) {
		throw new Error(`نوع الملف غير مطابق للامتداد (${file.type} ≠ .${ext})`);
	}

	return importer(file);
}

export function countWordsInHtml(html: string): number {
	const text = html
		.replace(/<[^>]+>/g, ' ')
		.replace(/&[a-z]+;/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	return text ? text.split(/\s+/).length : 0;
}
