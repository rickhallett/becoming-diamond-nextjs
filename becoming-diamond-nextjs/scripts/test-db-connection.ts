import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(process.cwd(), '.env.local') });

async function testConnection() {
  console.log('Testing database connection...');
  console.log('URL:', process.env.TURSO_DATABASE_URL);
  console.log('Token length:', process.env.TURSO_AUTH_TOKEN?.length);

  try {
    const turso = createClient({
      url: process.env.TURSO_DATABASE_URL || '',
      authToken: process.env.TURSO_AUTH_TOKEN || '',
    });

    console.log('\nExecuting query...');
    const result = await turso.execute({
      sql: 'SELECT * FROM leads WHERE email = ?',
      args: ['test-playwright@example.com'],
    });

    console.log('\n✓ Query successful!');
    console.log('Rows found:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('Lead data:', result.rows[0]);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Connection failed!');
    console.error('Error:', error);
    process.exit(1);
  }
}

testConnection();
