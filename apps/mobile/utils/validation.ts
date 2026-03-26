export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function minLength(s: string, n: number): boolean {
  return s.trim().length >= n;
}
