// src/health/drizzle.health.ts
// (Coloque-o na pasta 'health' ou 'drizzle')

import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';

@Injectable()
export class DrizzleHealthIndicator extends HealthIndicator {
  // Injete seu serviço Drizzle
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Tente executar uma query simples
      await this.db.execute('SELECT 1'); // Para PostgreSQL/MySQL
      // Se usa SQLite, pode ser: await this.drizzleService.db.run(sql`SELECT 1`);

      return this.getStatus(key, true);
    } catch (e) {
      // Se falhar, retorna o status como 'down'
      return this.getStatus(key, false, { message: e.message });
    }
  }
}
