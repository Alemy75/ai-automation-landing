import { describe, it, expect } from 'vitest';
import { validateContactForm } from '../../src/lib/contact-validator';

describe('validateContactForm', () => {
  it('returns valid for correct data', () => {
    const result = validateContactForm({ name: 'Иван', email: 'ivan@example.com', message: 'Хочу проект' });
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('rejects empty name', () => {
    const result = validateContactForm({ name: '', email: 'a@b.com', message: 'text' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Имя обязательно');
  });

  it('rejects whitespace-only name', () => {
    const result = validateContactForm({ name: '   ', email: 'a@b.com', message: 'text' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Имя обязательно');
  });

  it('rejects invalid email', () => {
    const result = validateContactForm({ name: 'Ivan', email: 'not-an-email', message: 'text' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Укажите корректный email');
  });

  it('rejects empty email', () => {
    const result = validateContactForm({ name: 'Ivan', email: '', message: 'text' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Укажите корректный email');
  });

  it('rejects empty message', () => {
    const result = validateContactForm({ name: 'Ivan', email: 'a@b.com', message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Сообщение обязательно');
  });

  it('rejects non-object input', () => {
    const result = validateContactForm(null);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Некорректный запрос');
  });

  it('rejects missing fields', () => {
    const result = validateContactForm({});
    expect(result.valid).toBe(false);
  });
});
