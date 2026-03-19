import { describe, it, expect } from 'vitest';
import { stripTashkeel, stripTashkeelFromHtml } from './tashkeel';

describe('stripTashkeel', () => {
	it('removes fathah, dammah, kasrah, shadda, sukun', () => {
		// بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ → بسم الله الرحمن الرحيم
		expect(stripTashkeel('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ')).toBe(
			'بسم الله الرحمن الرحيم'
		);
	});

	it('removes tanween (fathatan, dammatan, kasratan)', () => {
		expect(stripTashkeel('كِتَابًا')).toBe('كتابا');
		expect(stripTashkeel('كِتَابٌ')).toBe('كتاب');
		expect(stripTashkeel('كِتَابٍ')).toBe('كتاب');
	});

	it('preserves Arabic base letters', () => {
		const base = 'مرحبا بالعالم';
		expect(stripTashkeel(base)).toBe(base);
	});

	it('preserves Latin text unchanged', () => {
		expect(stripTashkeel('Hello World')).toBe('Hello World');
	});

	it('handles empty string', () => {
		expect(stripTashkeel('')).toBe('');
	});

	it('handles mixed Arabic and Latin', () => {
		expect(stripTashkeel('مَرْحَبًا Hello')).toBe('مرحبا Hello');
	});
});

describe('stripTashkeelFromHtml', () => {
	it('strips diacritics from text content but preserves HTML tags', () => {
		expect(stripTashkeelFromHtml('<p>بِسْمِ اللَّهِ</p>')).toBe('<p>بسم الله</p>');
	});

	it('preserves HTML attributes', () => {
		expect(stripTashkeelFromHtml('<p dir="rtl">بِسْمِ</p>')).toBe('<p dir="rtl">بسم</p>');
	});

	it('handles nested tags', () => {
		expect(stripTashkeelFromHtml('<p><strong>بِسْمِ</strong> اللَّهِ</p>')).toBe(
			'<p><strong>بسم</strong> الله</p>'
		);
	});

	it('handles empty tags', () => {
		expect(stripTashkeelFromHtml('<p></p>')).toBe('<p></p>');
	});

	it('handles multiple paragraphs', () => {
		const input = '<p>بِسْمِ</p><p>اللَّهِ</p>';
		expect(stripTashkeelFromHtml(input)).toBe('<p>بسم</p><p>الله</p>');
	});
});
