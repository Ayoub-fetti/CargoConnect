let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(fn: () => void): void {
  onSessionExpired = fn;
}

export function emitSessionExpired(): void {
  onSessionExpired?.();
}
