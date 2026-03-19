import { describe, it, expect } from 'vitest';
import { plainTextToHtml, isHtml, countWordsInHtml, importTxt } from './import';

describe('plainTextToHtml', () => {
	it('wraps lines in <p> tags', () => {
		expect(plainTextToHtml('سطر أول\nسطر ثاني')).toBe('<p>سطر أول</p><p>سطر ثاني</p>');
	});

	it('converts empty lines to empty <p> tags', () => {
		expect(plainTextToHtml('أول\n\nثاني')).toBe('<p>أول</p><p></p><p>ثاني</p>');
	});

	it('escapes HTML entities', () => {
		expect(plainTextToHtml('a & b < c > d "e"')).toBe(
			'<p>a &amp; b &lt; c &gt; d &quot;e&quot;</p>'
		);
	});

	it('handles single line', () => {
		expect(plainTextToHtml('مرحبا')).toBe('<p>مرحبا</p>');
	});

	it('handles empty string', () => {
		expect(plainTextToHtml('')).toBe('<p></p>');
	});
});

describe('isHtml', () => {
	it('returns true for HTML content', () => {
		expect(isHtml('<p>مرحبا</p>')).toBe(true);
	});

	it('returns true for nested HTML', () => {
		expect(isHtml('<div><strong>نص</strong></div>')).toBe(true);
	});

	it('returns false for plain text', () => {
		expect(isHtml('مرحبا بالعالم')).toBe(false);
	});

	it('returns false for empty string', () => {
		expect(isHtml('')).toBe(false);
	});

	it('returns false for text with angle brackets but no tags', () => {
		expect(isHtml('5 > 3 and 2 < 4')).toBe(false);
	});
});

describe('countWordsInHtml', () => {
	it('counts Arabic words', () => {
		expect(countWordsInHtml('<p>أهلاً وسهلاً بكم</p>')).toBe(3);
	});

	it('counts words across multiple tags', () => {
		expect(countWordsInHtml('<p>كلمة</p><p>كلمتان اثنتان</p>')).toBe(3);
	});

	it('strips HTML tags before counting', () => {
		expect(countWordsInHtml('<p><strong>غامق</strong> وعادي</p>')).toBe(2);
	});

	it('handles HTML entities as separators', () => {
		expect(countWordsInHtml('كلمة&nbsp;أخرى')).toBe(2);
	});

	it('returns 0 for empty content', () => {
		expect(countWordsInHtml('')).toBe(0);
		expect(countWordsInHtml('<p></p>')).toBe(0);
		expect(countWordsInHtml('<p>   </p>')).toBe(0);
	});

	it('counts mixed Arabic and Latin words', () => {
		expect(countWordsInHtml('<p>Hello مرحبا World عالم</p>')).toBe(4);
	});
});

describe('importTxt', () => {
	it('reads a File and converts to HTML paragraphs', async () => {
		const file = new File(['سطر أول\nسطر ثاني'], 'test.txt', { type: 'text/plain' });
		const result = await importTxt(file);
		expect(result).toBe('<p>سطر أول</p><p>سطر ثاني</p>');
	});

	it('handles empty file', async () => {
		const file = new File([''], 'empty.txt', { type: 'text/plain' });
		const result = await importTxt(file);
		expect(result).toBe('<p></p>');
	});
});
