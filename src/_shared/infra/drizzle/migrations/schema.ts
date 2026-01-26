import { pgTable, index, foreignKey, serial, timestamp, text, uniqueIndex, integer, boolean, numeric, doublePrecision, date, varchar, jsonb, real, unique, primaryKey, pgView, interval, bigint, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const direcaoCorte = pgEnum("DirecaoCorte", ['OPERACIONAL', 'ADMINISTRATIVO'])
export const empresa = pgEnum("Empresa", ['ITB', 'LDB', 'DPA'])
export const exibirClienteCabecalhoEnum = pgEnum("ExibirClienteCabecalhoEnum", ['PRIMEIRO', 'TODOS', 'NENHUM'])
export const motivoCorteMercadoria = pgEnum("MotivoCorteMercadoria", ['FALTA_MERCADORIA', 'FALTA_ESPACO', 'RECUSA_SEFAZ'])
export const role = pgEnum("Role", ['FUNCIONARIO', 'USER', 'ADMIN', 'MASTER'])
export const segmentoProduto = pgEnum("SegmentoProduto", ['SECO', 'REFR'])
export const statusDemanda = pgEnum("StatusDemanda", ['EM_PROGRESSO', 'FINALIZADA', 'PAUSA', 'CANCELADA'])
export const statusDevolucao = pgEnum("StatusDevolucao", ['AGUARDANDO_LIBERACAO', 'AGUARDANDO_CONFERENCIA', 'EM_CONFERENCIA', 'CONFERENCIA_FINALIZADA', 'FINALIZADO', 'CANCELADO'])
export const statusPalete = pgEnum("StatusPalete", ['NAO_INICIADO', 'EM_PROGRESSO', 'CONCLUIDO', 'EM_PAUSA'])
export const statusTransporte = pgEnum("StatusTransporte", ['AGUARDANDO_SEPARACAO', 'EM_SEPARACAO', 'SEPARACAO_CONCLUIDA', 'EM_CONFERENCIA', 'CONFERENCIA_CONCLUIDA', 'EM_CARREGAMENTO', 'CARREGAMENTO_CONCLUIDO', 'FATURADO', 'LIBERADO_PORTARIA', 'CANCELADO'])
export const tipoDevolucaoAnomalias = pgEnum("TipoDevolucaoAnomalias", ['AVARIA', 'FALTA', 'SOBRA'])
export const tipoDevolucaoItens = pgEnum("TipoDevolucaoItens", ['CONTABIL', 'FISICO'])
export const tipoDevolucaoNotas = pgEnum("TipoDevolucaoNotas", ['DEVOLUCAO', 'DEVOLUCAO_PARCIAL', 'REENTREGA'])
export const tipoEvento = pgEnum("TipoEvento", ['CRIACAO_TRANSPORTE', 'INICIO_SEPARACAO', 'TERMINO_SEPARACAO', 'INICIO_CONFERENCIA', 'TERMINO_CONFERENCIA', 'INICIO_CARREGAMENTO', 'TERMINO_CARREGAMENTO', 'CORTE_PRODUTO', 'FATURADO', 'LIBERADO_PORTARIA'])
export const tipoImpressao = pgEnum("TipoImpressao", ['TRANSPORTE', 'CLIENTE'])
export const tipoPeso = pgEnum("TipoPeso", ['PVAR', 'PPAR'])
export const tipoProcesso = pgEnum("TipoProcesso", ['SEPARACAO', 'CARREGAMENTO', 'CONFERENCIA'])
export const tipoQuebraPalete = pgEnum("TipoQuebraPalete", ['LINHAS', 'PERCENTUAL'])
export const turno = pgEnum("Turno", ['MANHA', 'TARDE', 'NOITE', 'INTERMEDIARIO', 'ADMINISTRATIVO'])


export const demanda = pgTable("Demanda", {
	id: serial().primaryKey().notNull(),
	processo: tipoProcesso().notNull(),
	inicio: timestamp({ precision: 3, mode: 'string' }).notNull(),
	fim: timestamp({ precision: 3, mode: 'string' }),
	status: statusDemanda().default('EM_PROGRESSO').notNull(),
	cadastradoPorId: text().notNull(),
	turno: turno().notNull(),
	funcionarioId: text().notNull(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	centerId: text().notNull(),
	obs: text(),
	dataExpedicao: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_demanda_center_id").using("btree", table.centerId.asc().nullsLast().op("text_ops")),
	index("idx_demanda_center_processo").using("btree", table.centerId.asc().nullsLast().op("text_ops"), table.processo.asc().nullsLast().op("text_ops")),
	index("idx_demanda_criado_em").using("btree", table.criadoEm.asc().nullsLast().op("timestamp_ops")),
	index("idx_demanda_funcionario_id").using("btree", table.funcionarioId.asc().nullsLast().op("text_ops")),
	index("idx_demanda_id").using("btree", table.id.asc().nullsLast().op("int4_ops")),
	index("idx_demanda_processo").using("btree", table.processo.asc().nullsLast().op("enum_ops")),
	index("idx_demanda_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("idx_demanda_turno").using("btree", table.turno.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.cadastradoPorId],
			foreignColumns: [user.id],
			name: "Demanda_cadastradoPorId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "Demanda_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.funcionarioId],
			foreignColumns: [user.id],
			name: "Demanda_funcionarioId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const configuracao = pgTable("Configuracao", {
	id: serial().primaryKey().notNull(),
	chave: text().notNull(),
	valor: text().notNull(),
	descricao: text(),
	centerId: text(),
}, (table) => [
	uniqueIndex("Configuracao_chave_centerId_key").using("btree", table.chave.asc().nullsLast().op("text_ops"), table.centerId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "Configuracao_centerId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const corteMercadoria = pgTable("CorteMercadoria", {
	id: serial().primaryKey().notNull(),
	produto: text().notNull(),
	lote: text().notNull(),
	unidades: integer().notNull(),
	motivo: motivoCorteMercadoria().notNull(),
	realizado: boolean().default(false).notNull(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
	criadoPorId: text().default('421931').notNull(),
	transporteId: text().notNull(),
	direcao: direcaoCorte(),
	caixas: integer().notNull(),
	centerId: text().notNull(),
	descricao: text(),
	realizadoPorId: text(),
}, (table) => [
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "CorteMercadoria_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.criadoPorId],
			foreignColumns: [user.id],
			name: "CorteMercadoria_criadoPorId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.realizadoPorId],
			foreignColumns: [user.id],
			name: "CorteMercadoria_realizadoPorId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.transporteId],
			foreignColumns: [transporte.numeroTransporte],
			name: "CorteMercadoria_transporteId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const center = pgTable("Center", {
	centerId: text().primaryKey().notNull(),
	description: text().notNull(),
	state: text().notNull(),
	cluster: text().notNull(),
}, (table) => [
	uniqueIndex("Center_centerId_key").using("btree", table.centerId.asc().nullsLast().op("text_ops")),
]);

export const dashboardProdutividadeCenter = pgTable("DashboardProdutividadeCenter", {
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
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("DashboardProdutividadeCenter_centerId_processo_dataRegistro_key").using("btree", table.centerId.asc().nullsLast().op("text_ops"), table.processo.asc().nullsLast().op("enum_ops"), table.dataRegistro.asc().nullsLast().op("timestamp_ops"), table.turno.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "DashboardProdutividadeCenter_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const dashboardProdutividadeUser = pgTable("DashboardProdutividadeUser", {
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
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("DashboardProdutividadeUser_funcionarioId_centerId_processo__key").using("btree", table.funcionarioId.asc().nullsLast().op("text_ops"), table.centerId.asc().nullsLast().op("enum_ops"), table.processo.asc().nullsLast().op("timestamp_ops"), table.dataRegistro.asc().nullsLast().op("timestamp_ops"), table.turno.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "DashboardProdutividadeUser_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.funcionarioId],
			foreignColumns: [user.id],
			name: "DashboardProdutividadeUser_funcionarioId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const devolucaImagens = pgTable("DevolucaImagens", {
	id: serial().primaryKey().notNull(),
	demandaId: integer().notNull(),
	processo: text().notNull(),
	tag: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.demandaId],
			foreignColumns: [devolucaoDemanda.id],
			name: "DevolucaImagens_demandaId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const configuracaoImpressaoMapa = pgTable("ConfiguracaoImpressaoMapa", {
	id: text().primaryKey().notNull(),
	tipoImpressao: tipoImpressao().notNull(),
	quebraPalete: boolean().default(false).notNull(),
	tipoQuebra: tipoQuebraPalete(),
	valorQuebra: numeric({ precision: 65, scale:  30 }),
	separarPaleteFull: boolean().default(false).notNull(),
	separarUnidades: boolean().default(false).notNull(),
	exibirInfoCabecalho: exibirClienteCabecalhoEnum().default('NENHUM'),
	segregarFifo: text().array(),
	dataMaximaPercentual: integer().default(0).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	centerId: text().notNull(),
	atribuidoPorId: text(),
	empresa: text().default('LDB').notNull(),
	tipoImpressaoConferencia: tipoImpressao().default('TRANSPORTE').notNull(),
	ordemConferencia: text().array().default(["RAY"]),
	ordemFifo: text().array().default(["RAY"]),
	ordemPaletes: text().array().default(["RAY"]),
	ordemPicking: text().array().default(["RAY"]),
	ordemUnidades: text().array().default(["RAY"]),
}, (table) => [
	uniqueIndex("ConfiguracaoImpressaoMapa_centerId_empresa_key").using("btree", table.centerId.asc().nullsLast().op("text_ops"), table.empresa.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.atribuidoPorId],
			foreignColumns: [user.id],
			name: "ConfiguracaoImpressaoMapa_atribuidoPorId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "ConfiguracaoImpressaoMapa_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const historicoImpressaoMapa = pgTable("HistoricoImpressaoMapa", {
	id: serial().primaryKey().notNull(),
	impressoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	transporteId: text().notNull(),
	impressoPorId: text().notNull(),
	tipoImpressao: tipoProcesso().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.impressoPorId],
			foreignColumns: [user.id],
			name: "HistoricoImpressaoMapa_impressoPorId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.transporteId],
			foreignColumns: [transporte.numeroTransporte],
			name: "HistoricoImpressaoMapa_transporteId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const palete = pgTable("Palete", {
	id: text().primaryKey().notNull(),
	empresa: text().notNull(),
	quantidadeCaixas: integer().notNull(),
	quantidadeUnidades: integer().notNull(),
	quantidadePaletes: integer().notNull(),
	enderecoVisitado: integer().notNull(),
	segmento: text().notNull(),
	transporteId: text().notNull(),
	tipoProcesso: tipoProcesso().default('SEPARACAO').notNull(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
	demandaId: integer(),
	status: statusPalete().default('NAO_INICIADO').notNull(),
	validado: boolean().default(false).notNull(),
	criadoPorId: text().notNull(),
	fim: timestamp({ precision: 3, mode: 'string' }),
	inicio: timestamp({ precision: 3, mode: 'string' }),
	totalCaixas: integer().default(0).notNull(),
	pesoLiquido: doublePrecision().default(0).notNull(),
}, (table) => [
	index("idx_palete_demanda").using("btree", table.demandaId.asc().nullsLast().op("int4_ops")),
	index("idx_palete_demanda_id").using("btree", table.demandaId.asc().nullsLast().op("int4_ops")),
	index("idx_palete_empresa").using("btree", table.empresa.asc().nullsLast().op("text_ops")),
	index("idx_palete_id").using("btree", table.id.asc().nullsLast().op("text_ops")),
	index("idx_palete_segmento").using("btree", table.segmento.asc().nullsLast().op("text_ops")),
	index("idx_palete_transporte").using("btree", table.transporteId.asc().nullsLast().op("text_ops")),
	index("idx_palete_transporte_id").using("btree", table.transporteId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.criadoPorId],
			foreignColumns: [user.id],
			name: "Palete_criadoPorId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.demandaId],
			foreignColumns: [demanda.id],
			name: "Palete_demandaId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.transporteId],
			foreignColumns: [transporte.numeroTransporte],
			name: "Palete_transporteId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const pausaGeral = pgTable("PausaGeral", {
	id: serial().primaryKey().notNull(),
	inicio: timestamp({ precision: 3, mode: 'string' }).notNull(),
	fim: timestamp({ precision: 3, mode: 'string' }),
	motivo: text().notNull(),
	centerId: text().notNull(),
	processo: tipoProcesso().notNull(),
	turno: turno().notNull(),
	registradoPorId: text().notNull(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
	segmento: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "PausaGeral_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.registradoPorId],
			foreignColumns: [user.id],
			name: "PausaGeral_registradoPorId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const pausa = pgTable("Pausa", {
	id: serial().primaryKey().notNull(),
	inicio: timestamp({ precision: 3, mode: 'string' }).notNull(),
	fim: timestamp({ precision: 3, mode: 'string' }),
	motivo: text().notNull(),
	descricao: text(),
	demandaId: integer().notNull(),
	registradoPorId: text().notNull(),
	pausaGeralId: integer(),
}, (table) => [
	index("idx_pausa_demanda_id").using("btree", table.demandaId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.demandaId],
			foreignColumns: [demanda.id],
			name: "Pausa_demandaId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.pausaGeralId],
			foreignColumns: [pausaGeral.id],
			name: "Pausa_pausaGeralId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.registradoPorId],
			foreignColumns: [user.id],
			name: "Pausa_registradoPorId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const historicoStatusTransporte = pgTable("HistoricoStatusTransporte", {
	id: serial().primaryKey().notNull(),
	alteradoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	tipoEvento: tipoEvento().notNull(),
	descricao: text().notNull(),
	transporteId: text().notNull(),
	alteradoPorId: text(),
	processo: tipoProcesso().default('SEPARACAO').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.alteradoPorId],
			foreignColumns: [user.id],
			name: "HistoricoStatusTransporte_alteradoPorId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.transporteId],
			foreignColumns: [transporte.numeroTransporte],
			name: "HistoricoStatusTransporte_transporteId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const transporte = pgTable("Transporte", {
	id: serial().primaryKey().notNull(),
	numeroTransporte: text().notNull(),
	status: statusTransporte().default('AGUARDANDO_SEPARACAO').notNull(),
	nomeRota: text().notNull(),
	nomeTransportadora: text().notNull(),
	placa: text().notNull(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
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
}, (table) => [
	index("idx_transporte_data_expedicao").using("btree", table.dataExpedicao.asc().nullsLast().op("timestamp_ops")),
	index("idx_transporte_numero_transporte").using("btree", table.numeroTransporte.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.cadastradoPorId],
			foreignColumns: [user.id],
			name: "Transporte_cadastradoPorId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "Transporte_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const devolucaoCheckList = pgTable("devolucao_check_list", {
	id: serial().primaryKey().notNull(),
	temperaturaBau: doublePrecision().notNull(),
	temperaturaProduto: doublePrecision().notNull(),
	demandaId: integer().notNull(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
	anomalias: text().array(),
}, (table) => [
	uniqueIndex("devolucao_check_list_demandaId_key").using("btree", table.demandaId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.demandaId],
			foreignColumns: [devolucaoDemanda.id],
			name: "devolucao_check_list_demandaId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const devolucaoHistoricoStatus = pgTable("devolucao_historico_status", {
	id: serial().primaryKey().notNull(),
	devolucaoDemandaId: integer().notNull(),
	status: statusDevolucao().notNull(),
	responsavelId: text(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.devolucaoDemandaId],
			foreignColumns: [devolucaoDemanda.id],
			name: "devolucao_historico_status_devolucaoDemandaId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.responsavelId],
			foreignColumns: [user.id],
			name: "devolucao_historico_status_responsavelId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const devolucaoItens = pgTable("devolucao_itens", {
	id: serial().primaryKey().notNull(),
	sku: text().notNull(),
	descricao: text().notNull(),
	lote: text(),
	fabricacao: date(),
	sif: text(),
	quantidadeCaixas: integer(),
	quantidadeUnidades: integer(),
	tipo: tipoDevolucaoItens().notNull(),
	devolucaoNotasId: text(),
	demandaId: integer().notNull(),
	avariaCaixas: integer(),
	avariaUnidades: integer(),
	notaId: integer("nota_id"),
}, (table) => [
	foreignKey({
			columns: [table.notaId],
			foreignColumns: [devolucaoNotas.id],
			name: "id_nota"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.demandaId],
			foreignColumns: [devolucaoDemanda.id],
			name: "devolucao_itens_demandaId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const devolucaoNotas = pgTable("devolucao_notas", {
	id: serial().primaryKey().notNull(),
	empresa: empresa().notNull(),
	devolucaoDemandaId: integer().notNull(),
	notaFiscal: text().notNull(),
	motivoDevolucao: text().notNull(),
	descMotivoDevolucao: text(),
	nfParcial: text(),
	idViagemRavex: text(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
	tipo: tipoDevolucaoNotas().default('DEVOLUCAO').notNull(),
}, (table) => [
	index("devolucao_notas_idViagem_key").using("btree", table.notaFiscal.asc().nullsLast().op("text_ops"), table.idViagemRavex.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.devolucaoDemandaId],
			foreignColumns: [devolucaoDemanda.id],
			name: "devolucao_notas_devolucaoDemandaId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const user = pgTable("User", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	password: text(),
	centerId: text().notNull(),
	token: text(),
	turno: turno().default('NOITE').notNull(),
	resetSenha: boolean().default(true).notNull(),
	empresa: text().default('LDB').notNull(),
}, (table) => [
	index("idx_user_id").using("btree", table.id.asc().nullsLast().op("text_ops")),
	index("idx_user_name_trgm").using("gin", table.name.asc().nullsLast().op("gin_trgm_ops")),
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "User_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const devolucaoDemanda = pgTable("devolucao_demanda", {
	id: serial().primaryKey().notNull(),
	placa: text().notNull(),
	motorista: text().notNull(),
	idTransportadora: text(),
	telefone: text(),
	cargaSegregada: boolean().default(false).notNull(),
	quantidadePaletes: integer().default(0),
	doca: text(),
	centerId: text().notNull(),
	adicionadoPorId: text().notNull(),
	conferenteId: text(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
	status: statusDevolucao().default('AGUARDANDO_LIBERACAO').notNull(),
	fechouComAnomalia: boolean(),
	liberadoParaConferenciaEm: timestamp({ precision: 3, mode: 'string' }),
	inicioConferenciaEm: timestamp({ precision: 3, mode: 'string' }),
	fimConferenciaEm: timestamp({ precision: 3, mode: 'string' }),
	finalizadoEm: timestamp({ precision: 3, mode: 'string' }),
	senha: text().notNull(),
	viagemId: text(),
}, (table) => [
	foreignKey({
			columns: [table.adicionadoPorId],
			foreignColumns: [user.id],
			name: "devolucao_demanda_adicionadoPorId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "devolucao_demanda_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.conferenteId],
			foreignColumns: [user.id],
			name: "devolucao_demanda_conferenteId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const devolucaoAnomalias = pgTable("devolucao_anomalias", {
	id: serial().primaryKey().notNull(),
	demandaId: integer().notNull(),
	tipo: text().notNull(),
	tratado: boolean().default(false).notNull(),
	sku: text().notNull(),
	descricao: text().notNull(),
	lote: text().notNull(),
	quantidadeCaixas: integer().notNull(),
	quantidadeUnidades: integer().notNull(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
	natureza: text(),
	causa: text(),
}, (table) => [
	foreignKey({
			columns: [table.demandaId],
			foreignColumns: [devolucaoDemanda.id],
			name: "devolucao_anomalias_demandaId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const imagem = pgTable("imagem", {
	id: text().primaryKey().notNull(),
	url: text().notNull(),
	tipo: text(),
	processoId: text("processo_id").notNull(),
	tipoProcesso: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
});

export const produto = pgTable("produto", {
	codEan: text(),
	codDum: text(),
	sku: text().primaryKey().notNull(),
	descricao: text().notNull(),
	shelf: integer().notNull(),
	tipoPeso: tipoPeso().notNull(),
	pesoLiquidoCaixa: numeric({ precision: 65, scale:  30 }).notNull(),
	pesoLiquidoUnidade: numeric({ precision: 65, scale:  30 }).notNull(),
	unPorCaixa: integer().notNull(),
	caixaPorPallet: integer().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	segmento: segmentoProduto().notNull(),
	empresa: empresa().notNull(),
});

export const rulesEngines = pgTable("rules_engines", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	centerId: text().notNull(),
	enabled: boolean().default(true).notNull(),
	conditions: jsonb().notNull(),
	createdBy: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	processo: text().notNull(),
	criadoPorId: text().notNull(),
}, (table) => [
	index("rules_engines_centerId_enabled_idx").using("btree", table.centerId.asc().nullsLast().op("bool_ops"), table.enabled.asc().nullsLast().op("text_ops")),
	uniqueIndex("rules_engines_name_centerId_key").using("btree", table.name.asc().nullsLast().op("text_ops"), table.centerId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "rules_engines_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.criadoPorId],
			foreignColumns: [user.id],
			name: "rules_engines_criadoPorId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const devolucaoTransportadoras = pgTable("devolucao_transportadoras", {
	id: serial().primaryKey().notNull(),
	nome: text().notNull(),
	centerId: text().notNull(),
	criadoEm: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	atualizadoEm: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("devolucao_transportadoras_nome_centerId_key").using("btree", table.nome.asc().nullsLast().op("text_ops"), table.centerId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "devolucao_transportadoras_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const transporteCargaParada = pgTable("TransporteCargaParada", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "TransporteCargaParada_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	motivo: text(),
	dataExpedicao: date(),
	transportId: text(),
	userId: text(),
	observacao: text("Observacao"),
}, (table) => [
	foreignKey({
			columns: [table.transportId],
			foreignColumns: [transporte.numeroTransporte],
			name: "transporte_id"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_id"
		}),
]);

export const playingWithNeon = pgTable("playing_with_neon", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	value: real(),
});

export const produtividadeAnomalia = pgTable("produtividade_anomalia", {
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
}, (table) => [
	foreignKey({
			columns: [table.criadoPorId],
			foreignColumns: [user.id],
			name: "AnomaliaProdutividade_criadoPorId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.demandaId],
			foreignColumns: [demanda.id],
			name: "AnomaliaProdutividade_demandaId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.funcionarioId],
			foreignColumns: [user.id],
			name: "AnomaliaProdutividade_funcionarioId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const movimentacao = pgTable("movimentacao", {
	idMov: serial("id_mov").primaryKey().notNull(),
	idUsuario: text("id_usuario"),
	idCentro: text("id_centro").notNull(),
	palete: varchar({ length: 50 }).notNull(),
	origem: varchar({ length: 50 }),
	destino: varchar({ length: 50 }),
	prioridade: integer().notNull(),
	status: varchar({ length: 20 }).default('pendente'),
	dataCriacao: timestamp("data_criacao", { mode: 'string' }).defaultNow(),
	dataExecucao: timestamp("data_execucao", { mode: 'string' }),
	sku: text(),
	descricao: text(),
	lote: text(),
	executadoPor: text("executado_por"),
	iniciado: timestamp({ mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.idCentro],
			foreignColumns: [center.centerId],
			name: "id_centro"
		}),
	foreignKey({
			columns: [table.idUsuario],
			foreignColumns: [user.id],
			name: "id_usuario"
		}),
	foreignKey({
			columns: [table.executadoPor],
			foreignColumns: [user.id],
			name: "id_executado_por"
		}),
]);

export const transporteAnomalia = pgTable("transporte_anomalia", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "transporte_anomalia_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	transporteId: text(),
	anomalia: text(),
	anomaliaPersonalizada: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.transporteId],
			foreignColumns: [transporte.numeroTransporte],
			name: "transporteId"
		}),
	unique("uq_transporte_anomalia").on(table.transporteId, table.anomalia),
]);

export const liteValidacao = pgTable("lite_validacao", {
	id: serial().primaryKey().notNull(),
	dataRef: date("data_ref").notNull(),
	endereco: text().notNull(),
	sku: text(),
	descricao: text(),
	dataValidade: date("data_validade"),
	lote: text(),
	peso: numeric().default('0'),
	caixas: integer(),
	qtdPalete: integer("qtd_palete"),
	capacidadePalete: integer("capacidade_palete"),
	area: text(),
	centroId: text("centro_id").notNull(),
	codigoBloqueio: text("codigo_bloqueio"),
	validado: boolean().default(false),
	adicionarPor: text("adicionar_por"),
	contadoPor: text("contado_por"),
	horaRegistro: timestamp("hora_registro", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.adicionarPor],
			foreignColumns: [user.id],
			name: "adicionado_por"
		}),
	foreignKey({
			columns: [table.contadoPor],
			foreignColumns: [user.id],
			name: "contado_por"
		}),
	foreignKey({
			columns: [table.centroId],
			foreignColumns: [center.centerId],
			name: "center_id"
		}),
]);

export const liteAnomalia = pgTable("lite_anomalia", {
	id: serial().primaryKey().notNull(),
	endereco: text(),
	centroId: text("centro_id"),
	sku: text(),
	lote: text(),
	quantidade: integer(),
	peso: numeric(),
	dataReferencia: date("data_referencia"),
	addPor: text("add_por"),
}, (table) => [
	foreignKey({
			columns: [table.addPor],
			foreignColumns: [user.id],
			name: "add_por_id"
		}),
	foreignKey({
			columns: [table.centroId],
			foreignColumns: [center.centerId],
			name: "centro_id"
		}),
]);

export const userCenter = pgTable("UserCenter", {
	userId: text().notNull(),
	centerId: text().notNull(),
	assignedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	processo: text().default('EXPEDICAO').notNull(),
	role: role().default('FUNCIONARIO').notNull(),
	roles: text().array(),
}, (table) => [
	foreignKey({
			columns: [table.centerId],
			foreignColumns: [center.centerId],
			name: "UserCenter_centerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UserCenter_userId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	primaryKey({ columns: [table.userId, table.centerId, table.processo], name: "UserCenter_pkey"}),
]);
export const viewProdutividadePorFuncionarioPorDia = pgView("view_produtividade_por_funcionario_por_dia", {	centerid: text(),
	funcionarioid: text(),
	funcionarionome: text(),
	data: date(),
	totalTempoPausa: interval("total_tempo_pausa"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCaixas: bigint("total_caixas", { mode: "number" }),
	tempoTotal: interval("tempo_total"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalDemandas: bigint("total_demandas", { mode: "number" }),
	tempoTrabalhado: interval("tempo_trabalhado"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalEnderecosVisitados: bigint("total_enderecos_visitados", { mode: "number" }),
	produtividadeCaixaPorHora: numeric("produtividade_caixa_por_hora"),
	mediaEnderecosPorDemanda: numeric("media_enderecos_por_demanda"),
}).as(sql`SELECT centerid, funcionarioid, funcionarionome, data, total_tempo_pausa, total_caixas, tempo_total, total_demandas, tempo_trabalhado, total_enderecos_visitados, CASE WHEN EXTRACT(epoch FROM tempo_trabalhado) > 0::numeric THEN total_caixas::numeric / (EXTRACT(epoch FROM tempo_trabalhado) / 3600::numeric) ELSE NULL::numeric END AS produtividade_caixa_por_hora, CASE WHEN total_demandas > 0 THEN total_enderecos_visitados::numeric / total_demandas::numeric ELSE NULL::numeric END AS media_enderecos_por_demanda FROM ( SELECT d."centerId" AS centerid, d."funcionarioId" AS funcionarioid, u.name AS funcionarionome, d."criadoEm"::date AS data, count(d.id) AS total_demandas, sum(p.fim - p.inicio) AS total_tempo_pausa, sum(palete."quantidadeCaixas") AS total_caixas, sum(d.fim - d.inicio) AS tempo_total, sum(palete."enderecoVisitado") AS total_enderecos_visitados, sum(d.fim - d.inicio) - sum(p.fim - p.inicio) AS tempo_trabalhado FROM "Demanda" d LEFT JOIN "User" u ON u.id = d."funcionarioId" LEFT JOIN "Pausa" p ON p."demandaId" = d.id LEFT JOIN "Palete" palete ON palete."demandaId" = d.id GROUP BY d."centerId", d."funcionarioId", u.name, (d."criadoEm"::date)) t ORDER BY centerid, funcionarioid, data`);

export const viewProdutividadeEmpresa = pgView("view_produtividade_empresa", {	centerid: text(),
	empresa: text(),
	periodoInicio: date("periodo_inicio"),
	periodoFim: date("periodo_fim"),
	totalTempoPausa: interval("total_tempo_pausa"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCaixas: bigint("total_caixas", { mode: "number" }),
	tempoTotal: interval("tempo_total"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalDemandas: bigint("total_demandas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalEnderecosVisitados: bigint("total_enderecos_visitados", { mode: "number" }),
	tempoTrabalhado: interval("tempo_trabalhado"),
	produtividadeCaixaPorHora: numeric("produtividade_caixa_por_hora"),
	mediaEnderecosPorDemanda: numeric("media_enderecos_por_demanda"),
}).as(sql`SELECT d."centerId" AS centerid, palete.empresa, min(d."criadoEm"::date) AS periodo_inicio, max(d."criadoEm"::date) AS periodo_fim, sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END) AS total_tempo_pausa, sum( CASE WHEN palete.id IS NOT NULL THEN palete."quantidadeCaixas" ELSE NULL::integer END) AS total_caixas, sum(d.fim - d.inicio) AS tempo_total, count(d.id) AS total_demandas, sum( CASE WHEN palete.id IS NOT NULL THEN palete."enderecoVisitado" ELSE NULL::integer END) AS total_enderecos_visitados, sum(d.fim - d.inicio) - sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END) AS tempo_trabalhado, CASE WHEN EXTRACT(epoch FROM sum(d.fim - d.inicio) - sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END)) > 0::numeric THEN sum(palete."quantidadeCaixas")::numeric / (EXTRACT(epoch FROM sum(d.fim - d.inicio) - sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END)) / 3600::numeric) ELSE NULL::numeric END AS produtividade_caixa_por_hora, CASE WHEN count(d.id) > 0 THEN sum( CASE WHEN palete.id IS NOT NULL THEN palete."enderecoVisitado" ELSE NULL::integer END)::numeric / count(d.id)::numeric ELSE NULL::numeric END AS media_enderecos_por_demanda FROM "Demanda" d LEFT JOIN "Pausa" p ON p."demandaId" = d.id LEFT JOIN "Palete" palete ON palete."demandaId" = d.id GROUP BY d."centerId", palete.empresa`);

export const viewProdutivdadeProcesso = pgView("view_produtivdade_processo", {	centerid: text(),
	processo: tipoProcesso(),
	turno: turno(),
	criadoem: timestamp({ precision: 3, mode: 'string' }),
	periodoInicio: date("periodo_inicio"),
	periodoFim: date("periodo_fim"),
	totalTempoPausa: interval("total_tempo_pausa"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCaixas: bigint("total_caixas", { mode: "number" }),
	tempoTotal: interval("tempo_total"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalDemandas: bigint("total_demandas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalEnderecosVisitados: bigint("total_enderecos_visitados", { mode: "number" }),
	tempoTrabalhado: interval("tempo_trabalhado"),
	produtividadeCaixaPorHora: numeric("produtividade_caixa_por_hora"),
	mediaEnderecosPorDemanda: numeric("media_enderecos_por_demanda"),
}).as(sql`SELECT d."centerId" AS centerid, d.processo, d.turno, d."criadoEm" AS criadoem, min(d."criadoEm"::date) AS periodo_inicio, max(d."criadoEm"::date) AS periodo_fim, sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END) AS total_tempo_pausa, sum( CASE WHEN palete.id IS NOT NULL THEN palete."quantidadeCaixas" ELSE NULL::integer END) AS total_caixas, sum(d.fim - d.inicio) AS tempo_total, count(d.id) AS total_demandas, sum( CASE WHEN palete.id IS NOT NULL THEN palete."enderecoVisitado" ELSE NULL::integer END) AS total_enderecos_visitados, sum(d.fim - d.inicio) - sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END) AS tempo_trabalhado, CASE WHEN EXTRACT(epoch FROM sum(d.fim - d.inicio) - sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END)) > 0::numeric THEN sum(palete."quantidadeCaixas")::numeric / (EXTRACT(epoch FROM sum(d.fim - d.inicio) - sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END)) / 3600::numeric) ELSE NULL::numeric END AS produtividade_caixa_por_hora, CASE WHEN count(d.id) > 0 THEN sum( CASE WHEN palete.id IS NOT NULL THEN palete."enderecoVisitado" ELSE NULL::integer END)::numeric / count(d.id)::numeric ELSE NULL::numeric END AS media_enderecos_por_demanda FROM "Demanda" d LEFT JOIN "Pausa" p ON p."demandaId" = d.id LEFT JOIN "Palete" palete ON palete."demandaId" = d.id GROUP BY d.processo, d.turno, d."criadoEm", d."centerId"`);

export const viewProdutividadePorDia = pgView("view_produtividade_por_dia", {	centerid: text(),
	data: date(),
	totalTempoPausa: interval("total_tempo_pausa"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCaixas: bigint("total_caixas", { mode: "number" }),
	tempoTotal: interval("tempo_total"),
	tempoTrabalhado: interval("tempo_trabalhado"),
	processo: tipoProcesso(),
	produtividadeCaixaPorHora: numeric("produtividade_caixa_por_hora"),
}).as(sql`SELECT centerid, data, total_tempo_pausa, total_caixas, tempo_total, tempo_trabalhado, processo, CASE WHEN EXTRACT(epoch FROM tempo_trabalhado) > 0::numeric THEN total_caixas::numeric / (EXTRACT(epoch FROM tempo_trabalhado) / 3600::numeric) ELSE NULL::numeric END AS produtividade_caixa_por_hora FROM ( SELECT d."centerId" AS centerid, d."criadoEm"::date AS data, d.processo, sum(p.fim - p.inicio) AS total_tempo_pausa, sum(palete."quantidadeCaixas") AS total_caixas, sum(d.fim - d.inicio) AS tempo_total, sum(d.fim - d.inicio) - sum(p.fim - p.inicio) AS tempo_trabalhado FROM "Demanda" d LEFT JOIN "Pausa" p ON p."demandaId" = d.id LEFT JOIN "Palete" palete ON palete."demandaId" = d.id GROUP BY d."centerId", d.processo, (d."criadoEm"::date)) t ORDER BY centerid, data`);

export const viewDemandaProdutividade = pgView("view_demanda_produtividade", {	centerid: text(),
	demandaid: integer(),
	criadoporid: text(),
	funcionarioid: text(),
	nomefuncionario: text(),
	data: date(),
	turno: turno(),
	processo: tipoProcesso(),
	inicio: timestamp({ mode: 'string' }),
	fim: timestamp({ mode: 'string' }),
	status: statusDemanda(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalUnidades: bigint("total_unidades", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalPaletes: bigint("total_paletes", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalEnderecosVisitado: bigint("total_enderecos_visitado", { mode: "number" }),
	totalTempoPausa: interval("total_tempo_pausa"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCaixas: bigint("total_caixas", { mode: "number" }),
	tempoTotal: interval("tempo_total"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	qtdPaletes: bigint("qtd_paletes", { mode: "number" }),
	segmento: text(),
	empresa: text(),
	tempoTrabalhado: interval("tempo_trabalhado"),
	produtividadeCaixaPorHora: numeric("produtividade_caixa_por_hora"),
}).as(sql`SELECT centerid, demandaid, criadoporid, funcionarioid, nomefuncionario, data, turno, processo, inicio, fim, status, total_unidades, total_paletes, total_enderecos_visitado, total_tempo_pausa, total_caixas, tempo_total, qtd_paletes, segmento, empresa, tempo_trabalhado, CASE WHEN EXTRACT(epoch FROM tempo_trabalhado) > 0::numeric THEN total_caixas::numeric / (EXTRACT(epoch FROM tempo_trabalhado) / 3600::numeric) ELSE NULL::numeric END AS produtividade_caixa_por_hora FROM ( SELECT d."centerId" AS centerid, d."criadoEm"::date AS data, d.processo, d.status, d."cadastradoPorId" AS criadoporid, d."funcionarioId" AS funcionarioid, u.name AS nomefuncionario, min(palete.segmento) AS segmento, min(palete.empresa) AS empresa, d.turno, d.id AS demandaid, min(d.inicio) AS inicio, max(d.fim) AS fim, count(palete."demandaId") AS qtd_paletes, COALESCE(sum(p.fim - p.inicio), '00:00:00'::interval) AS total_tempo_pausa, sum(palete."quantidadeCaixas") AS total_caixas, sum(palete."quantidadeUnidades") AS total_unidades, sum(palete."enderecoVisitado") AS total_enderecos_visitado, sum(palete."quantidadePaletes") AS total_paletes, sum(d.fim - d.inicio) AS tempo_total, sum(d.fim - d.inicio) - COALESCE(sum(p.fim - p.inicio), '00:00:00'::interval) AS tempo_trabalhado FROM "Demanda" d LEFT JOIN "Pausa" p ON p."demandaId" = d.id LEFT JOIN "Palete" palete ON palete."demandaId" = d.id LEFT JOIN "User" u ON u.id = d."funcionarioId" GROUP BY d."cadastradoPorId", d."funcionarioId", d.id, u.name, d."centerId", (d."criadoEm"::date), d.processo, d.status, d.turno) t ORDER BY centerid, data`);

export const viewProdutividadeFuncionario = pgView("view_produtividade_funcionario", {	funcionarioid: text(),
	funcionarionome: text(),
	processo: tipoProcesso(),
	centerid: text(),
	dataregistro: date(),
	periodoInicio: date("periodo_inicio"),
	periodoFim: date("periodo_fim"),
	totalTempoPausa: interval("total_tempo_pausa"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalCaixas: bigint("total_caixas", { mode: "number" }),
	tempoTotal: interval("tempo_total"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalDemandas: bigint("total_demandas", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalEnderecosVisitados: bigint("total_enderecos_visitados", { mode: "number" }),
	tempoTrabalhado: interval("tempo_trabalhado"),
	produtividadeCaixaPorHora: numeric("produtividade_caixa_por_hora"),
	mediaEnderecosPorDemanda: numeric("media_enderecos_por_demanda"),
	segmento: text(),
}).as(sql`SELECT d."funcionarioId" AS funcionarioid, u.name AS funcionarionome, d.processo, d."centerId" AS centerid, d."criadoEm"::date AS dataregistro, min(d."criadoEm"::date) AS periodo_inicio, max(d."criadoEm"::date) AS periodo_fim, sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END) AS total_tempo_pausa, sum( CASE WHEN palete.id IS NOT NULL THEN palete."quantidadeCaixas" ELSE NULL::integer END) AS total_caixas, sum(d.fim - d.inicio) AS tempo_total, count(d.id) AS total_demandas, sum( CASE WHEN palete.id IS NOT NULL THEN palete."enderecoVisitado" ELSE NULL::integer END) AS total_enderecos_visitados, sum(d.fim - d.inicio) - sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END) AS tempo_trabalhado, CASE WHEN EXTRACT(epoch FROM sum(d.fim - d.inicio) - sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END)) > 0::numeric THEN sum(palete."quantidadeCaixas")::numeric / (EXTRACT(epoch FROM sum(d.fim - d.inicio) - sum( CASE WHEN p.id IS NOT NULL THEN p.fim - p.inicio ELSE NULL::interval END)) / 3600::numeric) ELSE NULL::numeric END AS produtividade_caixa_por_hora, CASE WHEN count(d.id) > 0 THEN sum( CASE WHEN palete.id IS NOT NULL THEN palete."enderecoVisitado" ELSE NULL::integer END)::numeric / count(d.id)::numeric ELSE NULL::numeric END AS media_enderecos_por_demanda, palete.segmento FROM "Demanda" d LEFT JOIN "User" u ON u.id = d."funcionarioId" LEFT JOIN "Pausa" p ON p."demandaId" = d.id LEFT JOIN "Palete" palete ON palete."demandaId" = d.id GROUP BY d."funcionarioId", u.name, d."centerId", d.processo, (d."criadoEm"::date), palete.segmento ORDER BY u.name`);

export const vwProdutividadeDash = pgView("vw_produtividade_dash", {	id: integer(),
	processo: tipoProcesso(),
	status: statusDemanda(),
	turno: turno(),
	cadastradoPorId: text(),
	funcionarioId: text(),
	centerId: text(),
	obs: text(),
	transporteId: text(),
	segmento: text(),
	empresa: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	quantidadeCaixas: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	quantidadeUnidades: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	quantidadePaletes: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	enderecoVisitado: bigint({ mode: "number" }),
	criadoEm: timestamp("criado_em", { mode: 'string' }),
	dataExpedicao: text("data_expedicao"),
	mes: text(),
	inicioTs: timestamp("inicio_ts", { mode: 'string' }),
	fimTs: timestamp("fim_ts", { mode: 'string' }),
	tempoBrutoInterval: interval("tempo_bruto_interval"),
	totalPausaInterval: interval("total_pausa_interval"),
	totalPausa: text("total_pausa"),
	tempoTrabalhado: text("tempo_trabalhado"),
	caixaLinha: integer("caixa_linha"),
	produtividade: integer(),
}).as(sql`WITH demanda_calculada AS ( SELECT d_1.id, d_1.processo, d_1.inicio, d_1.fim, d_1.status, d_1."cadastradoPorId", d_1.turno, d_1."funcionarioId", d_1."criadoEm", d_1."centerId", d_1.obs, d_1."dataExpedicao", ((d_1.inicio AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text) AS inicio_ajustado, ((COALESCE(d_1.fim, (now() AT TIME ZONE 'UTC'::text)) AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text) AS fim_ajustado, ((COALESCE(d_1.fim, (now() AT TIME ZONE 'UTC'::text)) AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text) - ((d_1.inicio AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text) AS tempo_bruto_interval FROM "Demanda" d_1 ), palete_aggregada AS ( SELECT "Palete"."demandaId", min("Palete"."transporteId") AS "transporteId", min("Palete".segmento) AS segmento, min("Palete".empresa) AS empresa, sum("Palete"."quantidadeCaixas") AS "quantidadeCaixas", sum("Palete"."quantidadeUnidades") AS "quantidadeUnidades", sum("Palete"."quantidadePaletes") AS "quantidadePaletes", sum("Palete"."enderecoVisitado") AS "enderecoVisitado" FROM "Palete" GROUP BY "Palete"."demandaId" ) SELECT d.id, d.processo, d.status, d.turno, d."cadastradoPorId", d."funcionarioId", d."centerId", d.obs, pal."transporteId", pal.segmento, pal.empresa, pal."quantidadeCaixas", pal."quantidadeUnidades", pal."quantidadePaletes", pal."enderecoVisitado", ((d."criadoEm" AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text) AS criado_em, to_char(((d."dataExpedicao" AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text), 'YYYY-MM-DD'::text) AS data_expedicao, to_char(((d."dataExpedicao" AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text), 'YYYY-MM'::text) AS mes, d.inicio_ajustado AS inicio_ts, d.fim_ajustado AS fim_ts, d.tempo_bruto_interval, CASE WHEN count(p.inicio) = 0 THEN NULL::interval ELSE sum(((COALESCE(p.fim, (now() AT TIME ZONE 'UTC'::text)) AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text) - ((p.inicio AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text)) END AS total_pausa_interval, to_char( CASE WHEN count(p.inicio) = 0 THEN NULL::interval ELSE sum(((COALESCE(p.fim, (now() AT TIME ZONE 'UTC'::text)) AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text) - ((p.inicio AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text)) END, 'HH24:MI'::text) AS total_pausa, to_char(d.tempo_bruto_interval - COALESCE(sum(((COALESCE(p.fim, (now() AT TIME ZONE 'UTC'::text)) AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text) - ((p.inicio AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text)), '00:00:00'::interval), 'HH24:MI'::text) AS tempo_trabalhado, ceil(pal."quantidadeCaixas"::numeric / NULLIF(pal."enderecoVisitado", 0)::numeric)::integer AS caixa_linha, ceil(pal."quantidadeCaixas"::numeric / NULLIF(EXTRACT(epoch FROM d.tempo_bruto_interval - COALESCE(sum(((COALESCE(p.fim, (now() AT TIME ZONE 'UTC'::text)) AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text) - ((p.inicio AT TIME ZONE 'UTC'::text) AT TIME ZONE 'America/Sao_Paulo'::text)), '00:00:00'::interval)) / 3600.0, 0::numeric))::integer AS produtividade FROM demanda_calculada d LEFT JOIN "Pausa" p ON p."demandaId" = d.id LEFT JOIN palete_aggregada pal ON pal."demandaId" = d.id GROUP BY d.id, d.processo, d.status, d.turno, d."cadastradoPorId", d."funcionarioId", d."centerId", d.obs, d."criadoEm", d."dataExpedicao", d.inicio_ajustado, d.fim_ajustado, d.tempo_bruto_interval, pal."transporteId", pal.segmento, pal.empresa, pal."quantidadeCaixas", pal."quantidadeUnidades", pal."quantidadePaletes", pal."enderecoVisitado"`);