/**
 * Genera un identificador único para la sesión.
 * Intenta usar crypto.randomUUID() y usa un fallback si no está disponible.
 */
export function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback: simple random string
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}
