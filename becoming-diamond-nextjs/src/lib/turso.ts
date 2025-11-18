import { createClient } from '@libsql/client';

/**
 * Validates that required Turso credentials are present.
 * Implements fail-fast pattern to prevent silent misconfiguration.
 *
 * @throws {Error} If TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing
 */
function validateTursoCredentials(): { url: string; authToken: string } {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || url.trim() === '') {
    throw new Error(
      'TURSO_DATABASE_URL is not configured. Please set this environment variable. ' +
      'See README.md for setup instructions.'
    );
  }

  if (!authToken || authToken.trim() === '') {
    throw new Error(
      'TURSO_AUTH_TOKEN is not configured. Please set this environment variable. ' +
      'See README.md for setup instructions.'
    );
  }

  return { url, authToken };
}

// Validate credentials at module load time (fail-fast)
const credentials = validateTursoCredentials();

export const turso = createClient({
  url: credentials.url,
  authToken: credentials.authToken,
});
