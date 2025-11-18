import { relations } from 'drizzle-orm/relations';
import {
  user,
  anomaliaProdutividade,
  configuracaoImpressaoMapa,
  center,
  corteMercadoria,
  transporte,
  palete,
  demanda,
  configuracao,
  historicoImpressaoMapa,
  pausa,
  pausaGeral,
  dashboardProdutividadeUser,
  dashboardProdutividadeCenter,
  devolucaoDemanda,
  devolucaoHistoricoStatus,
  devolucaoNotas,
  devolucaoItens,
  devolucaoAnomalias,
  devolucaoTransportadoras,
  devolucaoCheckList,
  devolucaImagens,
  historicoStatusTransporte,
  rulesEngines,
  userCenter,
} from './schema';

export const anomaliaProdutividadeRelations = relations(
  anomaliaProdutividade,
  ({ one }) => ({
    user_funcionarioId: one(user, {
      fields: [anomaliaProdutividade.funcionarioId],
      references: [user.id],
      relationName: 'anomaliaProdutividade_funcionarioId_user_id',
    }),
    user_criadoPorId: one(user, {
      fields: [anomaliaProdutividade.criadoPorId],
      references: [user.id],
      relationName: 'anomaliaProdutividade_criadoPorId_user_id',
    }),
  }),
);

export const userRelations = relations(user, ({ one, many }) => ({
  anomaliaProdutividades_funcionarioId: many(anomaliaProdutividade, {
    relationName: 'anomaliaProdutividade_funcionarioId_user_id',
  }),
  anomaliaProdutividades_criadoPorId: many(anomaliaProdutividade, {
    relationName: 'anomaliaProdutividade_criadoPorId_user_id',
  }),
  configuracaoImpressaoMapas: many(configuracaoImpressaoMapa),
  center: one(center, {
    fields: [user.centerId],
    references: [center.centerId],
  }),
  corteMercadorias_realizadoPorId: many(corteMercadoria, {
    relationName: 'corteMercadoria_realizadoPorId_user_id',
  }),
  corteMercadorias_criadoPorId: many(corteMercadoria, {
    relationName: 'corteMercadoria_criadoPorId_user_id',
  }),
  transportes: many(transporte),
  paletes: many(palete),
  demandas_cadastradoPorId: many(demanda, {
    relationName: 'demanda_cadastradoPorId_user_id',
  }),
  demandas_funcionarioId: many(demanda, {
    relationName: 'demanda_funcionarioId_user_id',
  }),
  historicoImpressaoMapas: many(historicoImpressaoMapa),
  pausas: many(pausa),
  dashboardProdutividadeUsers: many(dashboardProdutividadeUser),
  devolucaoDemandas_adicionadoPorId: many(devolucaoDemanda, {
    relationName: 'devolucaoDemanda_adicionadoPorId_user_id',
  }),
  devolucaoDemandas_conferenteId: many(devolucaoDemanda, {
    relationName: 'devolucaoDemanda_conferenteId_user_id',
  }),
  devolucaoHistoricoStatuses: many(devolucaoHistoricoStatus),
  historicoStatusTransportes: many(historicoStatusTransporte),
  pausaGerals: many(pausaGeral),
  rulesEngines: many(rulesEngines),
  userCenters: many(userCenter),
}));

export const configuracaoImpressaoMapaRelations = relations(
  configuracaoImpressaoMapa,
  ({ one }) => ({
    user: one(user, {
      fields: [configuracaoImpressaoMapa.atribuidoPorId],
      references: [user.id],
    }),
    center: one(center, {
      fields: [configuracaoImpressaoMapa.centerId],
      references: [center.centerId],
    }),
  }),
);

export const centerRelations = relations(center, ({ many }) => ({
  configuracaoImpressaoMapas: many(configuracaoImpressaoMapa),
  users: many(user),
  corteMercadorias: many(corteMercadoria),
  transportes: many(transporte),
  demandas: many(demanda),
  configuracaos: many(configuracao),
  dashboardProdutividadeUsers: many(dashboardProdutividadeUser),
  dashboardProdutividadeCenters: many(dashboardProdutividadeCenter),
  devolucaoDemandas: many(devolucaoDemanda),
  devolucaoTransportadoras: many(devolucaoTransportadoras),
  pausaGerals: many(pausaGeral),
  rulesEngines: many(rulesEngines),
  userCenters: many(userCenter),
}));

export const corteMercadoriaRelations = relations(
  corteMercadoria,
  ({ one }) => ({
    center: one(center, {
      fields: [corteMercadoria.centerId],
      references: [center.centerId],
    }),
    user_realizadoPorId: one(user, {
      fields: [corteMercadoria.realizadoPorId],
      references: [user.id],
      relationName: 'corteMercadoria_realizadoPorId_user_id',
    }),
    user_criadoPorId: one(user, {
      fields: [corteMercadoria.criadoPorId],
      references: [user.id],
      relationName: 'corteMercadoria_criadoPorId_user_id',
    }),
    transporte: one(transporte, {
      fields: [corteMercadoria.transporteId],
      references: [transporte.numeroTransporte],
    }),
  }),
);

export const transporteRelations = relations(transporte, ({ one, many }) => ({
  corteMercadorias: many(corteMercadoria),
  user: one(user, {
    fields: [transporte.cadastradoPorId],
    references: [user.id],
  }),
  center: one(center, {
    fields: [transporte.centerId],
    references: [center.centerId],
  }),
  paletes: many(palete),
  historicoImpressaoMapas: many(historicoImpressaoMapa),
  historicoStatusTransportes: many(historicoStatusTransporte),
}));

export const paleteRelations = relations(palete, ({ one }) => ({
  user: one(user, {
    fields: [palete.criadoPorId],
    references: [user.id],
  }),
  demanda: one(demanda, {
    fields: [palete.demandaId],
    references: [demanda.id],
  }),
  transporte: one(transporte, {
    fields: [palete.transporteId],
    references: [transporte.numeroTransporte],
  }),
}));

export const demandaRelations = relations(demanda, ({ one, many }) => ({
  paletes: many(palete),
  user_cadastradoPorId: one(user, {
    fields: [demanda.cadastradoPorId],
    references: [user.id],
    relationName: 'demanda_cadastradoPorId_user_id',
  }),
  center: one(center, {
    fields: [demanda.centerId],
    references: [center.centerId],
  }),
  user_funcionarioId: one(user, {
    fields: [demanda.funcionarioId],
    references: [user.id],
    relationName: 'demanda_funcionarioId_user_id',
  }),
  pausas: many(pausa),
}));

export const configuracaoRelations = relations(configuracao, ({ one }) => ({
  center: one(center, {
    fields: [configuracao.centerId],
    references: [center.centerId],
  }),
}));

export const historicoImpressaoMapaRelations = relations(
  historicoImpressaoMapa,
  ({ one }) => ({
    user: one(user, {
      fields: [historicoImpressaoMapa.impressoPorId],
      references: [user.id],
    }),
    transporte: one(transporte, {
      fields: [historicoImpressaoMapa.transporteId],
      references: [transporte.numeroTransporte],
    }),
  }),
);

export const pausaRelations = relations(pausa, ({ one }) => ({
  demanda: one(demanda, {
    fields: [pausa.demandaId],
    references: [demanda.id],
  }),
  pausaGeral: one(pausaGeral, {
    fields: [pausa.pausaGeralId],
    references: [pausaGeral.id],
  }),
  user: one(user, {
    fields: [pausa.registradoPorId],
    references: [user.id],
  }),
}));

export const pausaGeralRelations = relations(pausaGeral, ({ one, many }) => ({
  pausas: many(pausa),
  center: one(center, {
    fields: [pausaGeral.centerId],
    references: [center.centerId],
  }),
  user: one(user, {
    fields: [pausaGeral.registradoPorId],
    references: [user.id],
  }),
}));

export const dashboardProdutividadeUserRelations = relations(
  dashboardProdutividadeUser,
  ({ one }) => ({
    center: one(center, {
      fields: [dashboardProdutividadeUser.centerId],
      references: [center.centerId],
    }),
    user: one(user, {
      fields: [dashboardProdutividadeUser.funcionarioId],
      references: [user.id],
    }),
  }),
);

export const dashboardProdutividadeCenterRelations = relations(
  dashboardProdutividadeCenter,
  ({ one }) => ({
    center: one(center, {
      fields: [dashboardProdutividadeCenter.centerId],
      references: [center.centerId],
    }),
  }),
);

export const devolucaoDemandaRelations = relations(
  devolucaoDemanda,
  ({ one, many }) => ({
    center: one(center, {
      fields: [devolucaoDemanda.centerId],
      references: [center.centerId],
    }),
    user_adicionadoPorId: one(user, {
      fields: [devolucaoDemanda.adicionadoPorId],
      references: [user.id],
      relationName: 'devolucaoDemanda_adicionadoPorId_user_id',
    }),
    user_conferenteId: one(user, {
      fields: [devolucaoDemanda.conferenteId],
      references: [user.id],
      relationName: 'devolucaoDemanda_conferenteId_user_id',
    }),
    devolucaoHistoricoStatuses: many(devolucaoHistoricoStatus),
    devolucaoNotas: many(devolucaoNotas),
    devolucaoItens: many(devolucaoItens),
    devolucaoAnomaliases: many(devolucaoAnomalias),
    devolucaoCheckLists: many(devolucaoCheckList),
    devolucaImagens: many(devolucaImagens),
  }),
);

export const devolucaoHistoricoStatusRelations = relations(
  devolucaoHistoricoStatus,
  ({ one }) => ({
    devolucaoDemanda: one(devolucaoDemanda, {
      fields: [devolucaoHistoricoStatus.devolucaoDemandaId],
      references: [devolucaoDemanda.id],
    }),
    user: one(user, {
      fields: [devolucaoHistoricoStatus.responsavelId],
      references: [user.id],
    }),
  }),
);

export const devolucaoNotasRelations = relations(devolucaoNotas, ({ one }) => ({
  devolucaoDemanda: one(devolucaoDemanda, {
    fields: [devolucaoNotas.devolucaoDemandaId],
    references: [devolucaoDemanda.id],
  }),
}));

export const devolucaoItensRelations = relations(devolucaoItens, ({ one }) => ({
  devolucaoDemanda: one(devolucaoDemanda, {
    fields: [devolucaoItens.demandaId],
    references: [devolucaoDemanda.id],
  }),
}));

export const devolucaoAnomaliasRelations = relations(
  devolucaoAnomalias,
  ({ one }) => ({
    devolucaoDemanda: one(devolucaoDemanda, {
      fields: [devolucaoAnomalias.demandaId],
      references: [devolucaoDemanda.id],
    }),
  }),
);

export const devolucaoTransportadorasRelations = relations(
  devolucaoTransportadoras,
  ({ one }) => ({
    center: one(center, {
      fields: [devolucaoTransportadoras.centerId],
      references: [center.centerId],
    }),
  }),
);

export const devolucaoCheckListRelations = relations(
  devolucaoCheckList,
  ({ one }) => ({
    devolucaoDemanda: one(devolucaoDemanda, {
      fields: [devolucaoCheckList.demandaId],
      references: [devolucaoDemanda.id],
    }),
  }),
);

export const devolucaImagensRelations = relations(
  devolucaImagens,
  ({ one }) => ({
    devolucaoDemanda: one(devolucaoDemanda, {
      fields: [devolucaImagens.demandaId],
      references: [devolucaoDemanda.id],
    }),
  }),
);

export const historicoStatusTransporteRelations = relations(
  historicoStatusTransporte,
  ({ one }) => ({
    user: one(user, {
      fields: [historicoStatusTransporte.alteradoPorId],
      references: [user.id],
    }),
    transporte: one(transporte, {
      fields: [historicoStatusTransporte.transporteId],
      references: [transporte.numeroTransporte],
    }),
  }),
);

export const rulesEnginesRelations = relations(rulesEngines, ({ one }) => ({
  user: one(user, {
    fields: [rulesEngines.criadoPorId],
    references: [user.id],
  }),
  center: one(center, {
    fields: [rulesEngines.centerId],
    references: [center.centerId],
  }),
}));

export const userCenterRelations = relations(userCenter, ({ one }) => ({
  center: one(center, {
    fields: [userCenter.centerId],
    references: [center.centerId],
  }),
  user: one(user, {
    fields: [userCenter.userId],
    references: [user.id],
  }),
}));
