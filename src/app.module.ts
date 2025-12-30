import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CenterModule } from './center/center.module';
import { ConfigModule } from '@nestjs/config';
import keycloakConfig from './_shared/config/keycloak.config';
import { UserModule } from './user/user.module';
import { TransporteModule } from './transporte/transporte.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MyCustomController } from './metrics/my-custom-controller';
import { JwtModule } from '@nestjs/jwt';
import { DrizzleModule } from './_shared/infra/drizzle/drizzle.module';
import { RedisModule } from './_shared/infra/redis/redis.module';
import { GestaoProdutividadeModule } from './gestao-produtividade/gestao-produtividade.module';
import { ProdutividadeDashModule } from './produtividade-dash/produtividade-dash.module';
import { AnomaliasProdutividadeModule } from './anomalias-produtividade/anomalias-produtividade.module';
import { CorteProdutoModule } from './corte-produto/corte-produto.module';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { DevolucaoModule } from './devolucao/devolucao.module';
import { ElasticsearchnpmModule } from './run/elasticsearchnpm/elasticsearchnpm.module';
import { MovimentacaoModule } from './movimentacao/movimentacao.module';
import { ProdutoModule } from './produto/produto.module';
import { AxiosModule } from './_shared/infra/axios/axios.module';
import { MinioModule } from './_shared/infra/minio/minio.module';

@Module({
  imports: [
    PrometheusModule.register({
      controller: MyCustomController,
    }), // adiciona endpoint /metrics
    EventEmitterModule.forRoot(),
    SentryModule.forRoot(),
    JwtModule.register({
      global: true,
      publicKey: `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`, //join(process.cwd(), 'src/auth/keys/public.pem'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [keycloakConfig], // Carrega nossa configuração
    }),
    CenterModule,
    UserModule,
    TransporteModule,
    DrizzleModule,
    RedisModule,
    GestaoProdutividadeModule,
    ProdutividadeDashModule,
    AnomaliasProdutividadeModule,
    CorteProdutoModule,
    HealthModule,
    DevolucaoModule,
    ElasticsearchnpmModule,
    MovimentacaoModule,
    ProdutoModule,
    AxiosModule,
    MinioModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
