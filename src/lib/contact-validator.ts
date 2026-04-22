// src/lib/contact-validator.ts
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateContactForm(data: unknown): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Некорректный запрос' };
  }

  const { name, email, message } = data as Record<string, unknown>;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Имя обязательно' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return { valid: false, error: 'Укажите корректный email' };
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return { valid: false, error: 'Сообщение обязательно' };
  }

  return { valid: true };
}
