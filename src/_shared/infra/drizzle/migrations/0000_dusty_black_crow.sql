-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."DirecaoCorte" AS ENUM('OPERACIONAL', 'ADMINISTRATIVO');--> statement-breakpoint
CREATE TYPE "public"."Empresa" AS ENUM('ITB', 'LDB', 'DPA');--> statement-breakpoint
CREATE TYPE "public"."ExibirClienteCabecalhoEnum" AS ENUM('PRIMEIRO', 'TODOS', 'NENHUM');--> statement-breakpoint
CREATE TYPE "public"."MotivoCorteMercadoria" AS ENUM('FALTA_MERCADORIA', 'FALTA_ESPACO', 'RECUSA_SEFAZ');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('FUNCIONARIO', 'USER', 'ADMIN', 'MASTER');--> statement-breakpoint
CREATE TYPE "public"."SegmentoProduto" AS ENUM('SECO', 'REFR');--> statement-breakpoint
CREATE TYPE "public"."StatusDemanda" AS ENUM('EM_PROGRESSO', 'FINALIZADA', 'PAUSA', 'CANCELADA');--> statement-breakpoint
CREATE TYPE "public"."StatusDevolucao" AS ENUM('AGUARDANDO_LIBERACAO', 'AGUARDANDO_CONFERENCIA', 'EM_CONFERENCIA', 'CONFERENCIA_FINALIZADA', 'FINALIZADO', 'CANCELADO');--> statement-breakpoint
CREATE TYPE "public"."StatusPalete" AS ENUM('NAO_INICIADO', 'EM_PROGRESSO', 'CONCLUIDO', 'EM_PAUSA');--> statement-breakpoint
CREATE TYPE "public"."StatusTransporte" AS ENUM('AGUARDANDO_SEPARACAO', 'EM_SEPARACAO', 'SEPARACAO_CONCLUIDA', 'EM_CONFERENCIA', 'CONFERENCIA_CONCLUIDA', 'EM_CARREGAMENTO', 'CARREGAMENTO_CONCLUIDO', 'FATURADO', 'LIBERADO_PORTARIA', 'CANCELADO');--> statement-breakpoint
CREATE TYPE "public"."TipoDevolucaoAnomalias" AS ENUM('AVARIA', 'FALTA', 'SOBRA');--> statement-breakpoint
CREATE TYPE "public"."TipoDevolucaoItens" AS ENUM('CONTABIL', 'FISICO');--> statement-breakpoint
CREATE TYPE "public"."TipoDevolucaoNotas" AS ENUM('DEVOLUCAO', 'DEVOLUCAO_PARCIAL', 'REENTREGA');--> statement-breakpoint
CREATE TYPE "public"."TipoEvento" AS ENUM('CRIACAO_TRANSPORTE', 'INICIO_SEPARACAO', 'TERMINO_SEPARACAO', 'INICIO_CONFERENCIA', 'TERMINO_CONFERENCIA', 'INICIO_CARREGAMENTO', 'TERMINO_CARREGAMENTO', 'CORTE_PRODUTO', 'FATURADO', 'LIBERADO_PORTARIA');--> statement-breakpoint
CREATE TYPE "public"."TipoImpressao" AS ENUM('TRANSPORTE', 'CLIENTE');--> statement-breakpoint
CREATE TYPE "public"."TipoPeso" AS ENUM('PVAR', 'PPAR');--> statement-breakpoint
CREATE TYPE "public"."TipoProcesso" AS ENUM('SEPARACAO', 'CARREGAMENTO', 'CONFERENCIA');--> statement-breakpoint
CREATE TYPE "public"."TipoQuebraPalete" AS ENUM('LINHAS', 'PERCENTUAL');--> statement-breakpoint
CREATE TYPE "public"."Turno" AS ENUM('MANHA', 'TARDE', 'NOITE', 'INTERMEDIARIO', 'ADMINISTRATIVO');--> statement-breakpoint
CREATE TABLE "Demanda" (
	"id" serial PRIMARY KEY NOT NULL,
	"processo" "TipoProcesso" NOT NULL,
	"inicio" timestamp(3) NOT NULL,
	"fim" timestamp(3),
	"status" "StatusDemanda" DEFAULT 'EM_PROGRESSO' NOT NULL,
	"cadastradoPorId" text NOT NULL,
	"turno" "Turno" NOT NULL,
	"funcionarioId" text NOT NULL,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"centerId" text NOT NULL,
	"obs" text,
	"dataExpedicao" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Configuracao" (
	"id" serial PRIMARY KEY NOT NULL,
	"chave" text NOT NULL,
	"valor" text NOT NULL,
	"descricao" text,
	"centerId" text
);
--> statement-breakpoint
CREATE TABLE "CorteMercadoria" (
	"id" serial PRIMARY KEY NOT NULL,
	"produto" text NOT NULL,
	"lote" text NOT NULL,
	"unidades" integer NOT NULL,
	"motivo" "MotivoCorteMercadoria" NOT NULL,
	"realizado" boolean DEFAULT false NOT NULL,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL,
	"criadoPorId" text DEFAULT '421931' NOT NULL,
	"transporteId" text NOT NULL,
	"direcao" "DirecaoCorte",
	"caixas" integer NOT NULL,
	"centerId" text NOT NULL,
	"descricao" text,
	"realizadoPorId" text
);
--> statement-breakpoint
CREATE TABLE "Center" (
	"centerId" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"state" text NOT NULL,
	"cluster" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DashboardProdutividadeCenter" (
	"id" serial PRIMARY KEY NOT NULL,
	"dataRegistro" timestamp(3) NOT NULL,
	"centerId" text NOT NULL,
	"cluster" text DEFAULT 'distribuicao' NOT NULL,
	"empresa" text DEFAULT 'LACTALIS' NOT NULL,
	"totalCaixas" integer NOT NULL,
	"totalUnidades" integer NOT NULL,
	"totalPaletes" integer NOT NULL,
	"totalEnderecos" integer NOT NULL,
	"totalPausasQuantidade" integer NOT NULL,
	"totalPausasTempo" integer NOT NULL,
	"totalTempoTrabalhado" integer NOT NULL,
	"totalDemandas" integer NOT NULL,
	"processo" "TipoProcesso" NOT NULL,
	"turno" "Turno" NOT NULL,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DashboardProdutividadeUser" (
	"id" serial PRIMARY KEY NOT NULL,
	"dataRegistro" timestamp(3) NOT NULL,
	"centerId" text NOT NULL,
	"funcionarioId" text NOT NULL,
	"totalCaixas" integer NOT NULL,
	"totalUnidades" integer NOT NULL,
	"totalPaletes" integer NOT NULL,
	"totalEnderecos" integer NOT NULL,
	"totalPausasQuantidade" integer NOT NULL,
	"totalPausasTempo" integer NOT NULL,
	"totalTempoTrabalhado" integer NOT NULL,
	"totalDemandas" integer NOT NULL,
	"processo" "TipoProcesso" NOT NULL,
	"turno" "Turno" NOT NULL,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DevolucaImagens" (
	"id" serial PRIMARY KEY NOT NULL,
	"demandaId" integer NOT NULL,
	"processo" text NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ConfiguracaoImpressaoMapa" (
	"id" text PRIMARY KEY NOT NULL,
	"tipoImpressao" "TipoImpressao" NOT NULL,
	"quebraPalete" boolean DEFAULT false NOT NULL,
	"tipoQuebra" "TipoQuebraPalete",
	"valorQuebra" numeric(65, 30),
	"separarPaleteFull" boolean DEFAULT false NOT NULL,
	"separarUnidades" boolean DEFAULT false NOT NULL,
	"exibirInfoCabecalho" "ExibirClienteCabecalhoEnum" DEFAULT 'NENHUM',
	"segregarFifo" text[],
	"dataMaximaPercentual" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"centerId" text NOT NULL,
	"atribuidoPorId" text,
	"empresa" text DEFAULT 'LDB' NOT NULL,
	"tipoImpressaoConferencia" "TipoImpressao" DEFAULT 'TRANSPORTE' NOT NULL,
	"ordemConferencia" text[] DEFAULT '{"RAY"}',
	"ordemFifo" text[] DEFAULT '{"RAY"}',
	"ordemPaletes" text[] DEFAULT '{"RAY"}',
	"ordemPicking" text[] DEFAULT '{"RAY"}',
	"ordemUnidades" text[] DEFAULT '{"RAY"}'
);
--> statement-breakpoint
CREATE TABLE "HistoricoImpressaoMapa" (
	"id" serial PRIMARY KEY NOT NULL,
	"impressoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"transporteId" text NOT NULL,
	"impressoPorId" text NOT NULL,
	"tipoImpressao" "TipoProcesso" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Palete" (
	"id" text PRIMARY KEY NOT NULL,
	"empresa" text NOT NULL,
	"quantidadeCaixas" integer NOT NULL,
	"quantidadeUnidades" integer NOT NULL,
	"quantidadePaletes" integer NOT NULL,
	"enderecoVisitado" integer NOT NULL,
	"segmento" text NOT NULL,
	"transporteId" text NOT NULL,
	"tipoProcesso" "TipoProcesso" DEFAULT 'SEPARACAO' NOT NULL,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL,
	"demandaId" integer,
	"status" "StatusPalete" DEFAULT 'NAO_INICIADO' NOT NULL,
	"validado" boolean DEFAULT false NOT NULL,
	"criadoPorId" text NOT NULL,
	"fim" timestamp(3),
	"inicio" timestamp(3),
	"totalCaixas" integer DEFAULT 0 NOT NULL,
	"pesoLiquido" double precision DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PausaGeral" (
	"id" serial PRIMARY KEY NOT NULL,
	"inicio" timestamp(3) NOT NULL,
	"fim" timestamp(3),
	"motivo" text NOT NULL,
	"centerId" text NOT NULL,
	"processo" "TipoProcesso" NOT NULL,
	"turno" "Turno" NOT NULL,
	"registradoPorId" text NOT NULL,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL,
	"segmento" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Pausa" (
	"id" serial PRIMARY KEY NOT NULL,
	"inicio" timestamp(3) NOT NULL,
	"fim" timestamp(3),
	"motivo" text NOT NULL,
	"descricao" text,
	"demandaId" integer NOT NULL,
	"registradoPorId" text NOT NULL,
	"pausaGeralId" integer
);
--> statement-breakpoint
CREATE TABLE "HistoricoStatusTransporte" (
	"id" serial PRIMARY KEY NOT NULL,
	"alteradoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tipoEvento" "TipoEvento" NOT NULL,
	"descricao" text NOT NULL,
	"transporteId" text NOT NULL,
	"alteradoPorId" text,
	"processo" "TipoProcesso" DEFAULT 'SEPARACAO' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Transporte" (
	"id" serial PRIMARY KEY NOT NULL,
	"numeroTransporte" text NOT NULL,
	"status" "StatusTransporte" DEFAULT 'AGUARDANDO_SEPARACAO' NOT NULL,
	"nomeRota" text NOT NULL,
	"nomeTransportadora" text NOT NULL,
	"placa" text NOT NULL,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL,
	"cadastradoPorId" text NOT NULL,
	"dataExpedicao" timestamp(6) NOT NULL,
	"centerId" text NOT NULL,
	"obs" text,
	"prioridade" integer DEFAULT 0 NOT NULL,
	"carregamento" "StatusPalete" DEFAULT 'NAO_INICIADO' NOT NULL,
	"conferencia" "StatusPalete" DEFAULT 'NAO_INICIADO' NOT NULL,
	"separacao" "StatusPalete" DEFAULT 'NAO_INICIADO' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devolucao_anomalias" (
	"id" serial PRIMARY KEY NOT NULL,
	"demandaId" integer NOT NULL,
	"tipo" "TipoDevolucaoAnomalias" NOT NULL,
	"tratado" boolean DEFAULT false NOT NULL,
	"sku" text NOT NULL,
	"descricao" text NOT NULL,
	"lote" text NOT NULL,
	"quantidadeCaixas" integer NOT NULL,
	"quantidadeUnidades" integer NOT NULL,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devolucao_check_list" (
	"id" serial PRIMARY KEY NOT NULL,
	"temperaturaBau" double precision NOT NULL,
	"temperaturaProduto" double precision NOT NULL,
	"demandaId" integer NOT NULL,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL,
	"anomalias" text[]
);
--> statement-breakpoint
CREATE TABLE "devolucao_historico_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"devolucaoDemandaId" integer NOT NULL,
	"status" "StatusDevolucao" NOT NULL,
	"responsavelId" text,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devolucao_itens" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"descricao" text NOT NULL,
	"lote" text,
	"fabricacao" timestamp(3),
	"sif" text,
	"quantidadeCaixas" integer,
	"quantidadeUnidades" integer,
	"tipo" "TipoDevolucaoItens" NOT NULL,
	"devolucaoNotasId" text,
	"demandaId" integer NOT NULL,
	"avariaCaixas" integer,
	"avariaUnidades" integer
);
--> statement-breakpoint
CREATE TABLE "devolucao_notas" (
	"id" serial PRIMARY KEY NOT NULL,
	"empresa" "Empresa" NOT NULL,
	"devolucaoDemandaId" integer NOT NULL,
	"notaFiscal" text NOT NULL,
	"motivoDevolucao" text NOT NULL,
	"descMotivoDevolucao" text,
	"nfParcial" text,
	"idViagemRavex" text,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL,
	"tipo" "TipoDevolucaoNotas" DEFAULT 'DEVOLUCAO' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" text,
	"centerId" text NOT NULL,
	"token" text,
	"turno" "Turno" DEFAULT 'NOITE' NOT NULL,
	"resetSenha" boolean DEFAULT true NOT NULL,
	"empresa" text DEFAULT 'LDB' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devolucao_demanda" (
	"id" serial PRIMARY KEY NOT NULL,
	"placa" text NOT NULL,
	"motorista" text NOT NULL,
	"idTransportadora" text,
	"telefone" text,
	"cargaSegregada" boolean DEFAULT false NOT NULL,
	"retornoPalete" boolean DEFAULT false NOT NULL,
	"quantidadePaletes" integer DEFAULT 0,
	"doca" text,
	"centerId" text NOT NULL,
	"adicionadoPorId" text NOT NULL,
	"conferenteId" text,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL,
	"status" "StatusDevolucao" DEFAULT 'AGUARDANDO_LIBERACAO' NOT NULL,
	"fechouComAnomalia" boolean,
	"liberadoParaConferenciaEm" timestamp(3),
	"inicioConferenciaEm" timestamp(3),
	"fimConferenciaEm" timestamp(3),
	"finalizadoEm" timestamp(3),
	"senha" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imagem" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"tipo" text,
	"processo_id" text NOT NULL,
	"tipoProcesso" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "produto" (
	"codEan" text,
	"codDum" text,
	"sku" text PRIMARY KEY NOT NULL,
	"descricao" text NOT NULL,
	"shelf" integer NOT NULL,
	"tipoPeso" "TipoPeso" NOT NULL,
	"pesoLiquidoCaixa" numeric(65, 30) NOT NULL,
	"pesoLiquidoUnidade" numeric(65, 30) NOT NULL,
	"unPorCaixa" integer NOT NULL,
	"caixaPorPallet" integer NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"segmento" "SegmentoProduto" NOT NULL,
	"empresa" "Empresa" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rules_engines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"centerId" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"conditions" jsonb NOT NULL,
	"createdBy" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"processo" text NOT NULL,
	"criadoPorId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "AnomaliaProdutividade" (
	"id" serial PRIMARY KEY NOT NULL,
	"demandaId" integer NOT NULL,
	"centerId" text NOT NULL,
	"funcionarioId" text NOT NULL,
	"criadoPorId" text NOT NULL,
	"inicio" timestamp(3) NOT NULL,
	"fim" timestamp(3),
	"caixas" integer NOT NULL,
	"unidades" integer NOT NULL,
	"paletes" integer NOT NULL,
	"enderecosVisitado" integer NOT NULL,
	"produtividade" double precision NOT NULL,
	"motivoAnomalia" text NOT NULL,
	"motivoAnomaliaDescricao" text,
	"paletesNaDemanda" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devolucao_transportadoras" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"centerId" text NOT NULL,
	"criadoEm" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"atualizadoEm" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserCenter" (
	"userId" text NOT NULL,
	"centerId" text NOT NULL,
	"assignedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"processo" text DEFAULT 'EXPEDICAO' NOT NULL,
	"role" "Role" DEFAULT 'FUNCIONARIO' NOT NULL,
	"roles" text[],
	CONSTRAINT "UserCenter_pkey" PRIMARY KEY("userId","centerId","processo")
);
--> statement-breakpoint
ALTER TABLE "Demanda" ADD CONSTRAINT "Demanda_cadastradoPorId_fkey" FOREIGN KEY ("cadastradoPorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Demanda" ADD CONSTRAINT "Demanda_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Demanda" ADD CONSTRAINT "Demanda_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Configuracao" ADD CONSTRAINT "Configuracao_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CorteMercadoria" ADD CONSTRAINT "CorteMercadoria_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CorteMercadoria" ADD CONSTRAINT "CorteMercadoria_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CorteMercadoria" ADD CONSTRAINT "CorteMercadoria_realizadoPorId_fkey" FOREIGN KEY ("realizadoPorId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CorteMercadoria" ADD CONSTRAINT "CorteMercadoria_transporteId_fkey" FOREIGN KEY ("transporteId") REFERENCES "public"."Transporte"("numeroTransporte") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DashboardProdutividadeCenter" ADD CONSTRAINT "DashboardProdutividadeCenter_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DashboardProdutividadeUser" ADD CONSTRAINT "DashboardProdutividadeUser_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DashboardProdutividadeUser" ADD CONSTRAINT "DashboardProdutividadeUser_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DevolucaImagens" ADD CONSTRAINT "DevolucaImagens_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "public"."devolucao_demanda"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ConfiguracaoImpressaoMapa" ADD CONSTRAINT "ConfiguracaoImpressaoMapa_atribuidoPorId_fkey" FOREIGN KEY ("atribuidoPorId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ConfiguracaoImpressaoMapa" ADD CONSTRAINT "ConfiguracaoImpressaoMapa_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "HistoricoImpressaoMapa" ADD CONSTRAINT "HistoricoImpressaoMapa_impressoPorId_fkey" FOREIGN KEY ("impressoPorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "HistoricoImpressaoMapa" ADD CONSTRAINT "HistoricoImpressaoMapa_transporteId_fkey" FOREIGN KEY ("transporteId") REFERENCES "public"."Transporte"("numeroTransporte") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Palete" ADD CONSTRAINT "Palete_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Palete" ADD CONSTRAINT "Palete_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "public"."Demanda"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Palete" ADD CONSTRAINT "Palete_transporteId_fkey" FOREIGN KEY ("transporteId") REFERENCES "public"."Transporte"("numeroTransporte") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PausaGeral" ADD CONSTRAINT "PausaGeral_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PausaGeral" ADD CONSTRAINT "PausaGeral_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Pausa" ADD CONSTRAINT "Pausa_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "public"."Demanda"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Pausa" ADD CONSTRAINT "Pausa_pausaGeralId_fkey" FOREIGN KEY ("pausaGeralId") REFERENCES "public"."PausaGeral"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Pausa" ADD CONSTRAINT "Pausa_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "HistoricoStatusTransporte" ADD CONSTRAINT "HistoricoStatusTransporte_alteradoPorId_fkey" FOREIGN KEY ("alteradoPorId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "HistoricoStatusTransporte" ADD CONSTRAINT "HistoricoStatusTransporte_transporteId_fkey" FOREIGN KEY ("transporteId") REFERENCES "public"."Transporte"("numeroTransporte") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Transporte" ADD CONSTRAINT "Transporte_cadastradoPorId_fkey" FOREIGN KEY ("cadastradoPorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Transporte" ADD CONSTRAINT "Transporte_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "devolucao_anomalias" ADD CONSTRAINT "devolucao_anomalias_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "public"."devolucao_demanda"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "devolucao_check_list" ADD CONSTRAINT "devolucao_check_list_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "public"."devolucao_demanda"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "devolucao_historico_status" ADD CONSTRAINT "devolucao_historico_status_devolucaoDemandaId_fkey" FOREIGN KEY ("devolucaoDemandaId") REFERENCES "public"."devolucao_demanda"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "devolucao_historico_status" ADD CONSTRAINT "devolucao_historico_status_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "devolucao_itens" ADD CONSTRAINT "devolucao_itens_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "public"."devolucao_demanda"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "devolucao_notas" ADD CONSTRAINT "devolucao_notas_devolucaoDemandaId_fkey" FOREIGN KEY ("devolucaoDemandaId") REFERENCES "public"."devolucao_demanda"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "devolucao_demanda" ADD CONSTRAINT "devolucao_demanda_adicionadoPorId_fkey" FOREIGN KEY ("adicionadoPorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "devolucao_demanda" ADD CONSTRAINT "devolucao_demanda_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "devolucao_demanda" ADD CONSTRAINT "devolucao_demanda_conferenteId_fkey" FOREIGN KEY ("conferenteId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rules_engines" ADD CONSTRAINT "rules_engines_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "rules_engines" ADD CONSTRAINT "rules_engines_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "AnomaliaProdutividade" ADD CONSTRAINT "AnomaliaProdutividade_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "AnomaliaProdutividade" ADD CONSTRAINT "AnomaliaProdutividade_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "public"."Demanda"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "AnomaliaProdutividade" ADD CONSTRAINT "AnomaliaProdutividade_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "devolucao_transportadoras" ADD CONSTRAINT "devolucao_transportadoras_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserCenter" ADD CONSTRAINT "UserCenter_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "public"."Center"("centerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserCenter" ADD CONSTRAINT "UserCenter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_demanda_center_id" ON "Demanda" USING btree ("centerId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_demanda_center_processo" ON "Demanda" USING btree ("centerId" text_ops,"processo" text_ops);--> statement-breakpoint
CREATE INDEX "idx_demanda_criado_em" ON "Demanda" USING btree ("criadoEm" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_demanda_funcionario_id" ON "Demanda" USING btree ("funcionarioId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_demanda_id" ON "Demanda" USING btree ("id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_demanda_processo" ON "Demanda" USING btree ("processo" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_demanda_status" ON "Demanda" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_demanda_turno" ON "Demanda" USING btree ("turno" enum_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Configuracao_chave_centerId_key" ON "Configuracao" USING btree ("chave" text_ops,"centerId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Center_centerId_key" ON "Center" USING btree ("centerId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DashboardProdutividadeCenter_centerId_processo_dataRegistro_key" ON "DashboardProdutividadeCenter" USING btree ("centerId" text_ops,"processo" enum_ops,"dataRegistro" timestamp_ops,"turno" enum_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DashboardProdutividadeUser_funcionarioId_centerId_processo__key" ON "DashboardProdutividadeUser" USING btree ("funcionarioId" text_ops,"centerId" enum_ops,"processo" timestamp_ops,"dataRegistro" timestamp_ops,"turno" enum_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ConfiguracaoImpressaoMapa_centerId_empresa_key" ON "ConfiguracaoImpressaoMapa" USING btree ("centerId" text_ops,"empresa" text_ops);--> statement-breakpoint
CREATE INDEX "idx_palete_demanda" ON "Palete" USING btree ("demandaId" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_palete_demanda_id" ON "Palete" USING btree ("demandaId" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_palete_empresa" ON "Palete" USING btree ("empresa" text_ops);--> statement-breakpoint
CREATE INDEX "idx_palete_id" ON "Palete" USING btree ("id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_palete_segmento" ON "Palete" USING btree ("segmento" text_ops);--> statement-breakpoint
CREATE INDEX "idx_palete_transporte" ON "Palete" USING btree ("transporteId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_palete_transporte_id" ON "Palete" USING btree ("transporteId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_pausa_demanda_id" ON "Pausa" USING btree ("demandaId" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_transporte_data_expedicao" ON "Transporte" USING btree ("dataExpedicao" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_transporte_numero_transporte" ON "Transporte" USING btree ("numeroTransporte" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "devolucao_check_list_demandaId_key" ON "devolucao_check_list" USING btree ("demandaId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "devolucao_notas_empresa_notaFiscal_tipo_key" ON "devolucao_notas" USING btree ("empresa" enum_ops,"notaFiscal" text_ops,"tipo" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "User" USING btree ("id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_name_trgm" ON "User" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "rules_engines_centerId_enabled_idx" ON "rules_engines" USING btree ("centerId" bool_ops,"enabled" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "rules_engines_name_centerId_key" ON "rules_engines" USING btree ("name" text_ops,"centerId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "devolucao_transportadoras_nome_centerId_key" ON "devolucao_transportadoras" USING btree ("nome" text_ops,"centerId" text_ops);
*/