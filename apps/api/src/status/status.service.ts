import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sql from 'mssql';

@Injectable()
export class StatusService {
  constructor(private readonly config: ConfigService) {}

  async getStatus() {
    let database: 'connected' | 'disconnected' | 'not_configured' =
      'not_configured';

    let pool: sql.ConnectionPool | undefined;

    try {
      pool = await sql.connect({
        user: 'sa',
        password: 'Lafite_Secret1!',
        server: '127.0.0.1',
        port: 1433,
        database: 'lafite_tracker',
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
      });

      await pool.request().query('SELECT 1');

      database = 'connected';
    } catch (error) {
      console.error('SQL Server connection error:', error);

      database = 'disconnected';
    } finally {
      await pool?.close();
    }

    return {
      status: database === 'disconnected' ? 'degraded' : 'ok',
      service: 'lafite-api',
      timestamp: new Date().toISOString(),
      database,
    };
  }
}