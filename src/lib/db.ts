import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let _sql: NeonQueryFunction<false, false> | null = null;

/**
 * Lazily initialised Neon SQL tagged-template function.
 * Connection is only established on the first actual query — NOT at import/build time.
 */
export function getSQL(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;

  const url = process.env.DATABASE_URL;
  if (!url || url.startsWith('your_')) {
    throw new Error(
      'DATABASE_URL is not configured. ' +
      'Create a free Neon project at https://neon.tech and add the connection string to .env.local'
    );
  }

  _sql = neon(url);
  return _sql;
}
