import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

// Importe seu indicador customizado do Drizzle
import { DrizzleHealthIndicator } from './drizzle.health';
import { KeycloakHealthIndicator } from './keycloak.health';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private db: DrizzleHealthIndicator,
    private keycloak: KeycloakHealthIndicator,
  ) {}

  @Get()
  @ApiExcludeEndpoint()
  @HealthCheck()
  checkAll() {
    return this.health.check([
      () => this.db.isHealthy('database'),
      () => this.memory.checkHeap('memory_heap', 250 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
      () => this.http.pingCheck('external_ping', 'https://google.com'),
      () => this.keycloak.isHealthy('keycloak'),
    ]);
  }

  @Get('db')
  @ApiExcludeEndpoint()
  @HealthCheck()
  checkDb() {
    return this.health.check([() => this.db.isHealthy('database')]);
  }

  @Get('memory')
  @ApiExcludeEndpoint()
  @HealthCheck()
  checkMemory() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 250 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }

  @Get('disk')
  @ApiExcludeEndpoint()
  @HealthCheck()
  checkDisk() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }

  @Get('external')
  @ApiExcludeEndpoint()
  @HealthCheck()
  checkExternal() {
    return this.health.check([
      () => this.http.pingCheck('external_ping', 'https://google.com'),
    ]);
  }

  @Get('keycloak')
  @ApiExcludeEndpoint()
  @HealthCheck()
  checkKeycloak() {
    return this.health.check([() => this.keycloak.isHealthy('keycloak')]);
  }
}
