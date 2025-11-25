import {
  pgTable,
  index,
  foreignKey,
  serial,
  timestamp,
  text,
  uniqueIndex,
  integer,
  boolean,
  numeric,
  doublePrecision,
  varchar,
  jsonb,
  date,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const direcaoCorte = pgEnum('DirecaoCorte', [
  'OPERACIONAL',
  'ADMINISTRATIVO',
]);
export const empresa = pgEnum('Empresa', ['ITB', 'LDB', 'DPA']);
export const exibirClienteCabecalhoEnum = pgEnum('ExibirClienteCabecalhoEnum', [
  'PRIMEIRO',
  'TODOS',
  'NENHUM',
]);
export const motivoCorteMercadoria = pgEnum('MotivoCorteMercadoria', [
  'FALTA_MERCADORIA',
  'FALTA_ESPACO',
  'RECUSA_SEFAZ',
]);
export const role = pgEnum('Role', ['FUNCIONARIO', 'USER', 'ADMIN', 'MASTER']);
export const segmentoProduto = pgEnum('SegmentoProduto', ['SECO', 'REFR']);
export const statusDemanda = pgEnum('StatusDemanda', [
  'EM_PROGRESSO',
  'FINALIZADA',
  'PAUSA',
  'CANCELADA',
]);
export const statusDevolucao = pgEnum('StatusDevolucao', [
  'AGUARDANDO_LIBERACAO',
  'AGUARDANDO_CONFERENCIA',
  'EM_CONFERENCIA',
  'CONFERENCIA_FINALIZADA',
  'FINALIZADO',
  'CANCELADO',
]);
export const statusPalete = pgEnum('StatusPalete', [
  'NAO_INICIADO',
  'EM_PROGRESSO',
  'CONCLUIDO',
  'EM_PAUSA',
]);
export const statusTransporte = pgEnum('StatusTransporte', [
  'AGUARDANDO_SEPARACAO',
  'EM_SEPARACAO',
  'SEPARACAO_CONCLUIDA',
  'EM_CONFERENCIA',
  'CONFERENCIA_CONCLUIDA',
  'EM_CARREGAMENTO',
  'CARREGAMENTO_CONCLUIDO',
  'FATURADO',
  'LIBERADO_PORTARIA',
  'CANCELADO',
]);
export const tipoDevolucaoAnomalias = pgEnum('TipoDevolucaoAnomalias', [
  'AVARIA',
  'FALTA',
  'SOBRA',
]);
export const tipoDevolucaoItens = pgEnum('TipoDevolucaoItens', [
  'CONTABIL',
  'FISICO',
]);
export const tipoDevolucaoNotas = pgEnum('TipoDevolucaoNotas', [
  'DEVOLUCAO',
  'DEVOLUCAO_PARCIAL',
  'REENTREGA',
]);
export const tipoEvento = pgEnum('TipoEvento', [
  'CRIACAO_TRANSPORTE',
  'INICIO_SEPARACAO',
  'TERMINO_SEPARACAO',
  'INICIO_CONFERENCIA',
  'TERMINO_CONFERENCIA',
  'INICIO_CARREGAMENTO',
  'TERMINO_CARREGAMENTO',
  'CORTE_PRODUTO',
  'FATURADO',
  'LIBERADO_PORTARIA',
]);
export const tipoImpressao = pgEnum('TipoImpressao', ['TRANSPORTE', 'CLIENTE']);
export const tipoPeso = pgEnum('TipoPeso', ['PVAR', 'PPAR']);
export const tipoProcesso = pgEnum('TipoProcesso', [
  'SEPARACAO',
  'CARREGAMENTO',
  'CONFERENCIA',
]);
export const tipoQuebraPalete = pgEnum('TipoQuebraPalete', [
  'LINHAS',
  'PERCENTUAL',
]);
export const turno = pgEnum('Turno', [
  'MANHA',
  'TARDE',
  'NOITE',
  'INTERMEDIARIO',
  'ADMINISTRATIVO',
]);

export const demanda = pgTable(
  'Demanda',
  {
    id: serial().primaryKey().notNull(),
    processo: tipoProcesso().notNull(),
    inicio: timestamp({ precision: 3, mode: 'string' }).notNull(),
    fim: timestamp({ precision: 3, mode: 'string' }),
    status: statusDemanda().default('EM_PROGRESSO').notNull(),
    cadastradoPorId: text().notNull(),
    turno: turno().notNull(),
    funcionarioId: text().notNull(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    centerId: text().notNull(),
    obs: text(),
    dataExpedicao: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index('idx_demanda_center_id').using(
      'btree',
      table.centerId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_demanda_center_processo').using(
      'btree',
      table.centerId.asc().nullsLast().op('text_ops'),
      table.processo.asc().nullsLast().op('text_ops'),
    ),
    index('idx_demanda_criado_em').using(
      'btree',
      table.criadoEm.asc().nullsLast().op('timestamp_ops'),
    ),
    index('idx_demanda_funcionario_id').using(
      'btree',
      table.funcionarioId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_demanda_id').using(
      'btree',
      table.id.asc().nullsLast().op('int4_ops'),
    ),
    index('idx_demanda_processo').using(
      'btree',
      table.processo.asc().nullsLast().op('enum_ops'),
    ),
    index('idx_demanda_status').using(
      'btree',
      table.status.asc().nullsLast().op('enum_ops'),
    ),
    index('idx_demanda_turno').using(
      'btree',
      table.turno.asc().nullsLast().op('enum_ops'),
    ),
    foreignKey({
      columns: [table.cadastradoPorId],
      foreignColumns: [user.id],
      name: 'Demanda_cadastradoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'Demanda_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.funcionarioId],
      foreignColumns: [user.id],
      name: 'Demanda_funcionarioId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const configuracao = pgTable(
  'Configuracao',
  {
    id: serial().primaryKey().notNull(),
    chave: text().notNull(),
    valor: text().notNull(),
    descricao: text(),
    centerId: text(),
  },
  (table) => [
    uniqueIndex('Configuracao_chave_centerId_key').using(
      'btree',
      table.chave.asc().nullsLast().op('text_ops'),
      table.centerId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'Configuracao_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
  ],
);

export const corteMercadoria = pgTable(
  'CorteMercadoria',
  {
    id: serial().primaryKey().notNull(),
    produto: text().notNull(),
    lote: text().notNull(),
    unidades: integer().notNull(),
    motivo: motivoCorteMercadoria().notNull(),
    realizado: boolean().default(false).notNull(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
    criadoPorId: text().default('421931').notNull(),
    transporteId: text().notNull(),
    direcao: direcaoCorte(),
    caixas: integer().notNull(),
    centerId: text().notNull(),
    descricao: text(),
    realizadoPorId: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'CorteMercadoria_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.criadoPorId],
      foreignColumns: [user.id],
      name: 'CorteMercadoria_criadoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.realizadoPorId],
      foreignColumns: [user.id],
      name: 'CorteMercadoria_realizadoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    foreignKey({
      columns: [table.transporteId],
      foreignColumns: [transporte.numeroTransporte],
      name: 'CorteMercadoria_transporteId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const center = pgTable(
  'Center',
  {
    centerId: text().primaryKey().notNull(),
    description: text().notNull(),
    state: text().notNull(),
    cluster: text().notNull(),
  },
  (table) => [
    uniqueIndex('Center_centerId_key').using(
      'btree',
      table.centerId.asc().nullsLast().op('text_ops'),
    ),
  ],
);

export const dashboardProdutividadeCenter = pgTable(
  'DashboardProdutividadeCenter',
  {
    id: serial().primaryKey().notNull(),
    dataRegistro: timestamp({ precision: 3, mode: 'string' }).notNull(),
    centerId: text().notNull(),
    cluster: text().default('distribuicao').notNull(),
    empresa: text().default('LACTALIS').notNull(),
    totalCaixas: integer().notNull(),
    totalUnidades: integer().notNull(),
    totalPaletes: integer().notNull(),
    totalEnderecos: integer().notNull(),
    totalPausasQuantidade: integer().notNull(),
    totalPausasTempo: integer().notNull(),
    totalTempoTrabalhado: integer().notNull(),
    totalDemandas: integer().notNull(),
    processo: tipoProcesso().notNull(),
    turno: turno().notNull(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
  },
  (table) => [
    uniqueIndex(
      'DashboardProdutividadeCenter_centerId_processo_dataRegistro_key',
    ).using(
      'btree',
      table.centerId.asc().nullsLast().op('text_ops'),
      table.processo.asc().nullsLast().op('enum_ops'),
      table.dataRegistro.asc().nullsLast().op('timestamp_ops'),
      table.turno.asc().nullsLast().op('enum_ops'),
    ),
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'DashboardProdutividadeCenter_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const dashboardProdutividadeUser = pgTable(
  'DashboardProdutividadeUser',
  {
    id: serial().primaryKey().notNull(),
    dataRegistro: timestamp({ precision: 3, mode: 'string' }).notNull(),
    centerId: text().notNull(),
    funcionarioId: text().notNull(),
    totalCaixas: integer().notNull(),
    totalUnidades: integer().notNull(),
    totalPaletes: integer().notNull(),
    totalEnderecos: integer().notNull(),
    totalPausasQuantidade: integer().notNull(),
    totalPausasTempo: integer().notNull(),
    totalTempoTrabalhado: integer().notNull(),
    totalDemandas: integer().notNull(),
    processo: tipoProcesso().notNull(),
    turno: turno().notNull(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
  },
  (table) => [
    uniqueIndex(
      'DashboardProdutividadeUser_funcionarioId_centerId_processo__key',
    ).using(
      'btree',
      table.funcionarioId.asc().nullsLast().op('text_ops'),
      table.centerId.asc().nullsLast().op('enum_ops'),
      table.processo.asc().nullsLast().op('timestamp_ops'),
      table.dataRegistro.asc().nullsLast().op('timestamp_ops'),
      table.turno.asc().nullsLast().op('enum_ops'),
    ),
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'DashboardProdutividadeUser_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.funcionarioId],
      foreignColumns: [user.id],
      name: 'DashboardProdutividadeUser_funcionarioId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const devolucaImagens = pgTable(
  'DevolucaImagens',
  {
    id: serial().primaryKey().notNull(),
    demandaId: integer().notNull(),
    processo: text().notNull(),
    tag: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.demandaId],
      foreignColumns: [devolucaoDemanda.id],
      name: 'DevolucaImagens_demandaId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const configuracaoImpressaoMapa = pgTable(
  'ConfiguracaoImpressaoMapa',
  {
    id: text().primaryKey().notNull(),
    tipoImpressao: tipoImpressao().notNull(),
    quebraPalete: boolean().default(false).notNull(),
    tipoQuebra: tipoQuebraPalete(),
    valorQuebra: numeric({ precision: 65, scale: 30 }),
    separarPaleteFull: boolean().default(false).notNull(),
    separarUnidades: boolean().default(false).notNull(),
    exibirInfoCabecalho: exibirClienteCabecalhoEnum().default('NENHUM'),
    segregarFifo: text().array(),
    dataMaximaPercentual: integer().default(0).notNull(),
    createdAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
    centerId: text().notNull(),
    atribuidoPorId: text(),
    empresa: text().default('LDB').notNull(),
    tipoImpressaoConferencia: tipoImpressao().default('TRANSPORTE').notNull(),
    ordemConferencia: text().array().default(['RAY']),
    ordemFifo: text().array().default(['RAY']),
    ordemPaletes: text().array().default(['RAY']),
    ordemPicking: text().array().default(['RAY']),
    ordemUnidades: text().array().default(['RAY']),
  },
  (table) => [
    uniqueIndex('ConfiguracaoImpressaoMapa_centerId_empresa_key').using(
      'btree',
      table.centerId.asc().nullsLast().op('text_ops'),
      table.empresa.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.atribuidoPorId],
      foreignColumns: [user.id],
      name: 'ConfiguracaoImpressaoMapa_atribuidoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'ConfiguracaoImpressaoMapa_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const historicoImpressaoMapa = pgTable(
  'HistoricoImpressaoMapa',
  {
    id: serial().primaryKey().notNull(),
    impressoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    transporteId: text().notNull(),
    impressoPorId: text().notNull(),
    tipoImpressao: tipoProcesso().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.impressoPorId],
      foreignColumns: [user.id],
      name: 'HistoricoImpressaoMapa_impressoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.transporteId],
      foreignColumns: [transporte.numeroTransporte],
      name: 'HistoricoImpressaoMapa_transporteId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const palete = pgTable(
  'Palete',
  {
    id: text().primaryKey().notNull(),
    empresa: text().notNull(),
    quantidadeCaixas: integer().notNull(),
    quantidadeUnidades: integer().notNull(),
    quantidadePaletes: integer().notNull(),
    enderecoVisitado: integer().notNull(),
    segmento: text().notNull(),
    transporteId: text().notNull(),
    tipoProcesso: tipoProcesso().default('SEPARACAO').notNull(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
    demandaId: integer(),
    status: statusPalete().default('NAO_INICIADO').notNull(),
    validado: boolean().default(false).notNull(),
    criadoPorId: text().notNull(),
    fim: timestamp({ precision: 3, mode: 'string' }),
    inicio: timestamp({ precision: 3, mode: 'string' }),
    totalCaixas: integer().default(0).notNull(),
    pesoLiquido: doublePrecision().default(0).notNull(),
  },
  (table) => [
    index('idx_palete_demanda').using(
      'btree',
      table.demandaId.asc().nullsLast().op('int4_ops'),
    ),
    index('idx_palete_demanda_id').using(
      'btree',
      table.demandaId.asc().nullsLast().op('int4_ops'),
    ),
    index('idx_palete_empresa').using(
      'btree',
      table.empresa.asc().nullsLast().op('text_ops'),
    ),
    index('idx_palete_id').using(
      'btree',
      table.id.asc().nullsLast().op('text_ops'),
    ),
    index('idx_palete_segmento').using(
      'btree',
      table.segmento.asc().nullsLast().op('text_ops'),
    ),
    index('idx_palete_transporte').using(
      'btree',
      table.transporteId.asc().nullsLast().op('text_ops'),
    ),
    index('idx_palete_transporte_id').using(
      'btree',
      table.transporteId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.criadoPorId],
      foreignColumns: [user.id],
      name: 'Palete_criadoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.demandaId],
      foreignColumns: [demanda.id],
      name: 'Palete_demandaId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.transporteId],
      foreignColumns: [transporte.numeroTransporte],
      name: 'Palete_transporteId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const pausaGeral = pgTable(
  'PausaGeral',
  {
    id: serial().primaryKey().notNull(),
    inicio: timestamp({ precision: 3, mode: 'string' }).notNull(),
    fim: timestamp({ precision: 3, mode: 'string' }),
    motivo: text().notNull(),
    centerId: text().notNull(),
    processo: tipoProcesso().notNull(),
    turno: turno().notNull(),
    registradoPorId: text().notNull(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
    segmento: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'PausaGeral_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.registradoPorId],
      foreignColumns: [user.id],
      name: 'PausaGeral_registradoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const pausa = pgTable(
  'Pausa',
  {
    id: serial().primaryKey().notNull(),
    inicio: timestamp({ precision: 3, mode: 'string' }).notNull(),
    fim: timestamp({ precision: 3, mode: 'string' }),
    motivo: text().notNull(),
    descricao: text(),
    demandaId: integer().notNull(),
    registradoPorId: text().notNull(),
    pausaGeralId: integer(),
  },
  (table) => [
    index('idx_pausa_demanda_id').using(
      'btree',
      table.demandaId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.demandaId],
      foreignColumns: [demanda.id],
      name: 'Pausa_demandaId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.pausaGeralId],
      foreignColumns: [pausaGeral.id],
      name: 'Pausa_pausaGeralId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    foreignKey({
      columns: [table.registradoPorId],
      foreignColumns: [user.id],
      name: 'Pausa_registradoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const historicoStatusTransporte = pgTable(
  'HistoricoStatusTransporte',
  {
    id: serial().primaryKey().notNull(),
    alteradoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    tipoEvento: tipoEvento().notNull(),
    descricao: text().notNull(),
    transporteId: text().notNull(),
    alteradoPorId: text(),
    processo: tipoProcesso().default('SEPARACAO').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.alteradoPorId],
      foreignColumns: [user.id],
      name: 'HistoricoStatusTransporte_alteradoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    foreignKey({
      columns: [table.transporteId],
      foreignColumns: [transporte.numeroTransporte],
      name: 'HistoricoStatusTransporte_transporteId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const transporte = pgTable(
  'Transporte',
  {
    id: serial().primaryKey().notNull(),
    numeroTransporte: text().notNull(),
    status: statusTransporte().default('AGUARDANDO_SEPARACAO').notNull(),
    nomeRota: text().notNull(),
    nomeTransportadora: text().notNull(),
    placa: text().notNull(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
    cadastradoPorId: text().notNull(),
    dataExpedicao: timestamp({ precision: 6, mode: 'string' }).notNull(),
    centerId: text().notNull(),
    obs: text(),
    prioridade: integer().default(0).notNull(),
    carregamento: statusPalete().default('NAO_INICIADO').notNull(),
    conferencia: statusPalete().default('NAO_INICIADO').notNull(),
    separacao: statusPalete().default('NAO_INICIADO').notNull(),
    cargaParada: boolean().default(false),
  },
  (table) => [
    index('idx_transporte_data_expedicao').using(
      'btree',
      table.dataExpedicao.asc().nullsLast().op('timestamp_ops'),
    ),
    index('idx_transporte_numero_transporte').using(
      'btree',
      table.numeroTransporte.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.cadastradoPorId],
      foreignColumns: [user.id],
      name: 'Transporte_cadastradoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'Transporte_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const devolucaoAnomalias = pgTable(
  'devolucao_anomalias',
  {
    id: serial().primaryKey().notNull(),
    demandaId: integer().notNull(),
    tipo: tipoDevolucaoAnomalias().notNull(),
    tratado: boolean().default(false).notNull(),
    sku: text().notNull(),
    descricao: text().notNull(),
    lote: text().notNull(),
    quantidadeCaixas: integer().notNull(),
    quantidadeUnidades: integer().notNull(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.demandaId],
      foreignColumns: [devolucaoDemanda.id],
      name: 'devolucao_anomalias_demandaId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const prismaMigrations = pgTable('_prisma_migrations', {
  id: varchar({ length: 36 }).primaryKey().notNull(),
  checksum: varchar({ length: 64 }).notNull(),
  finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'string' }),
  migrationName: varchar('migration_name', { length: 255 }).notNull(),
  logs: text(),
  rolledBackAt: timestamp('rolled_back_at', {
    withTimezone: true,
    mode: 'string',
  }),
  startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer('applied_steps_count').default(0).notNull(),
});

export const devolucaoCheckList = pgTable(
  'devolucao_check_list',
  {
    id: serial().primaryKey().notNull(),
    temperaturaBau: doublePrecision().notNull(),
    temperaturaProduto: doublePrecision().notNull(),
    demandaId: integer().notNull(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
    anomalias: text().array(),
  },
  (table) => [
    uniqueIndex('devolucao_check_list_demandaId_key').using(
      'btree',
      table.demandaId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.demandaId],
      foreignColumns: [devolucaoDemanda.id],
      name: 'devolucao_check_list_demandaId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const devolucaoHistoricoStatus = pgTable(
  'devolucao_historico_status',
  {
    id: serial().primaryKey().notNull(),
    devolucaoDemandaId: integer().notNull(),
    status: statusDevolucao().notNull(),
    responsavelId: text(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.devolucaoDemandaId],
      foreignColumns: [devolucaoDemanda.id],
      name: 'devolucao_historico_status_devolucaoDemandaId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.responsavelId],
      foreignColumns: [user.id],
      name: 'devolucao_historico_status_responsavelId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
  ],
);

export const devolucaoItens = pgTable(
  'devolucao_itens',
  {
    id: serial().primaryKey().notNull(),
    sku: text().notNull(),
    descricao: text().notNull(),
    lote: text(),
    fabricacao: timestamp({ precision: 3, mode: 'string' }),
    sif: text(),
    quantidadeCaixas: integer(),
    quantidadeUnidades: integer(),
    tipo: tipoDevolucaoItens().notNull(),
    devolucaoNotasId: text(),
    demandaId: integer().notNull(),
    avariaCaixas: integer(),
    avariaUnidades: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.demandaId],
      foreignColumns: [devolucaoDemanda.id],
      name: 'devolucao_itens_demandaId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const devolucaoNotas = pgTable(
  'devolucao_notas',
  {
    id: serial().primaryKey().notNull(),
    empresa: empresa().notNull(),
    devolucaoDemandaId: integer().notNull(),
    notaFiscal: text().notNull(),
    motivoDevolucao: text().notNull(),
    descMotivoDevolucao: text(),
    nfParcial: text(),
    idViagemRavex: text(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
    tipo: tipoDevolucaoNotas().default('DEVOLUCAO').notNull(),
  },
  (table) => [
    uniqueIndex('devolucao_notas_empresa_notaFiscal_tipo_key').using(
      'btree',
      table.empresa.asc().nullsLast().op('enum_ops'),
      table.notaFiscal.asc().nullsLast().op('text_ops'),
      table.tipo.asc().nullsLast().op('enum_ops'),
    ),
    foreignKey({
      columns: [table.devolucaoDemandaId],
      foreignColumns: [devolucaoDemanda.id],
      name: 'devolucao_notas_devolucaoDemandaId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
);

export const user = pgTable(
  'User',
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    password: text(),
    centerId: text().notNull(),
    token: text(),
    turno: turno().default('NOITE').notNull(),
    resetSenha: boolean().default(true).notNull(),
    empresa: text().default('LDB').notNull(),
  },
  (table) => [
    index('idx_user_id').using(
      'btree',
      table.id.asc().nullsLast().op('text_ops'),
    ),
    index('idx_user_name_trgm').using(
      'gin',
      table.name.asc().nullsLast().op('gin_trgm_ops'),
    ),
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'User_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const devolucaoDemanda = pgTable(
  'devolucao_demanda',
  {
    id: serial().primaryKey().notNull(),
    placa: text().notNull(),
    motorista: text().notNull(),
    idTransportadora: text(),
    telefone: text(),
    cargaSegregada: boolean().default(false).notNull(),
    retornoPalete: boolean().default(false).notNull(),
    quantidadePaletes: integer().default(0),
    doca: text(),
    centerId: text().notNull(),
    adicionadoPorId: text().notNull(),
    conferenteId: text(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
    status: statusDevolucao().default('AGUARDANDO_LIBERACAO').notNull(),
    fechouComAnomalia: boolean(),
    liberadoParaConferenciaEm: timestamp({ precision: 3, mode: 'string' }),
    inicioConferenciaEm: timestamp({ precision: 3, mode: 'string' }),
    fimConferenciaEm: timestamp({ precision: 3, mode: 'string' }),
    finalizadoEm: timestamp({ precision: 3, mode: 'string' }),
    senha: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.adicionadoPorId],
      foreignColumns: [user.id],
      name: 'devolucao_demanda_adicionadoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'devolucao_demanda_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.conferenteId],
      foreignColumns: [user.id],
      name: 'devolucao_demanda_conferenteId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
  ],
);

export const imagem = pgTable('imagem', {
  id: text().primaryKey().notNull(),
  url: text().notNull(),
  tipo: text(),
  processoId: text('processo_id').notNull(),
  tipoProcesso: text().notNull(),
  createdAt: timestamp({ precision: 3, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
});

export const produto = pgTable('produto', {
  codEan: text(),
  codDum: text(),
  sku: text().primaryKey().notNull(),
  descricao: text().notNull(),
  shelf: integer().notNull(),
  tipoPeso: tipoPeso().notNull(),
  pesoLiquidoCaixa: numeric({ precision: 65, scale: 30 }).notNull(),
  pesoLiquidoUnidade: numeric({ precision: 65, scale: 30 }).notNull(),
  unPorCaixa: integer().notNull(),
  caixaPorPallet: integer().notNull(),
  createdAt: timestamp({ precision: 3, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
  segmento: segmentoProduto().notNull(),
  empresa: empresa().notNull(),
});

export const rulesEngines = pgTable(
  'rules_engines',
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    centerId: text().notNull(),
    enabled: boolean().default(true).notNull(),
    conditions: jsonb().notNull(),
    createdBy: text(),
    createdAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
    processo: text().notNull(),
    criadoPorId: text().notNull(),
  },
  (table) => [
    index('rules_engines_centerId_enabled_idx').using(
      'btree',
      table.centerId.asc().nullsLast().op('bool_ops'),
      table.enabled.asc().nullsLast().op('text_ops'),
    ),
    uniqueIndex('rules_engines_name_centerId_key').using(
      'btree',
      table.name.asc().nullsLast().op('text_ops'),
      table.centerId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'rules_engines_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.criadoPorId],
      foreignColumns: [user.id],
      name: 'rules_engines_criadoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const anomaliaProdutividade = pgTable(
  'AnomaliaProdutividade',
  {
    id: serial().primaryKey().notNull(),
    demandaId: integer().notNull(),
    centerId: text().notNull(),
    funcionarioId: text().notNull(),
    criadoPorId: text().notNull(),
    inicio: timestamp({ precision: 3, mode: 'string' }).notNull(),
    fim: timestamp({ precision: 3, mode: 'string' }),
    caixas: integer().notNull(),
    unidades: integer().notNull(),
    paletes: integer().notNull(),
    enderecosVisitado: integer().notNull(),
    produtividade: doublePrecision().notNull(),
    motivoAnomalia: text().notNull(),
    motivoAnomaliaDescricao: text(),
    paletesNaDemanda: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.criadoPorId],
      foreignColumns: [user.id],
      name: 'AnomaliaProdutividade_criadoPorId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.demandaId],
      foreignColumns: [demanda.id],
      name: 'AnomaliaProdutividade_demandaId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.funcionarioId],
      foreignColumns: [user.id],
      name: 'AnomaliaProdutividade_funcionarioId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const devolucaoTransportadoras = pgTable(
  'devolucao_transportadoras',
  {
    id: serial().primaryKey().notNull(),
    nome: text().notNull(),
    centerId: text().notNull(),
    criadoEm: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
  },
  (table) => [
    uniqueIndex('devolucao_transportadoras_nome_centerId_key').using(
      'btree',
      table.nome.asc().nullsLast().op('text_ops'),
      table.centerId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'devolucao_transportadoras_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
  ],
);

export const transporteCargaParada = pgTable(
  'TransporteCargaParada',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: 'transporte_carga_parada_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    motivo: text(),
    dataExpedicao: date(),
    transportId: text(),
    userId: text(),
    observacao: text('Observacao'),
  },
  (table) => [
    foreignKey({
      columns: [table.transportId],
      foreignColumns: [transporte.numeroTransporte],
      name: 'transporte_id',
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'user_id',
    }),
  ],
);

export const userCenter = pgTable(
  'UserCenter',
  {
    userId: text().notNull(),
    centerId: text().notNull(),
    assignedAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    processo: text().default('EXPEDICAO').notNull(),
    role: role().default('FUNCIONARIO').notNull(),
    roles: text().array(),
  },
  (table) => [
    foreignKey({
      columns: [table.centerId],
      foreignColumns: [center.centerId],
      name: 'UserCenter_centerId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'UserCenter_userId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    primaryKey({
      columns: [table.userId, table.centerId, table.processo],
      name: 'UserCenter_pkey',
    }),
  ],
);
