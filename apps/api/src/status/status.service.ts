import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sql from 'mssql';

@Injectable()
export class StatusService {
  constructor(private readonly config: ConfigService) {}

  async getStatus() {
    const databaseUrl = this.config.get<string>('DATABASE_URL');
    let database: 'connected' | 'disconnected' | 'not_configured' =
      'not_configured';

    if (databaseUrl) {
      let pool: sql.ConnectionPool | undefined;
      try {
        pool = await sql.connect(databaseUrl);
        await pool.request().query('SELECT 1');
        database = 'connected';
      } catch {
        database = 'disconnected';
      } finally {
        await pool?.close();
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
