import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class StatusService {
  constructor(private readonly config: ConfigService) {}

  async getStatus() {
    const databaseUrl = this.config.get<string>('DATABASE_URL');
    let database: 'connected' | 'disconnected' | 'not_configured' =
      'not_configured';

    if (databaseUrl) {
      const pool = new Pool({ connectionString: databaseUrl });
      try {
        await pool.query('SELECT 1');
        database = 'connected';
      } catch {
        database = 'disconnected';
      } finally {
        await pool.end();
      }
    }

    return {
      status: database === 'disconnected' ? 'degraded' : 'ok',
      service: 'lafite-api',
      timestamp: new Date().toISOString(),
      database,
    };
  }
}
