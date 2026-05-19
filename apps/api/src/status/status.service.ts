import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus() {
    let database: 'connected' | 'disconnected' = 'disconnected';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = 'connected';
    } catch (error) {
      console.error('SQL Server connection error:', error);
    }

    return {
      status: database === 'disconnected' ? 'degraded' : 'ok',
      service: 'lafite-api',
      timestamp: new Date().toISOString(),
      database,
    };
  }
}
