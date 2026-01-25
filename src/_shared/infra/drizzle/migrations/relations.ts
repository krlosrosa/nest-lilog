import { relations } from 'drizzle-orm/relations';
import {
  user,
  demanda,
  center,
  configuracao,
  corteMercadoria,
  transporte,
  dashboardProdutividadeCenter,
  dashboardProdutividadeUser,
  devolucaoDemanda,
  devolucaImagens,
  configuracaoImpressaoMapa,
  historicoImpressaoMapa,
  palete,
  pausaGeral,
  pausa,
  historicoStatusTransporte,
  devolucaoCheckList,
  devolucaoHistoricoStatus,
  devolucaoNotas,
  devolucaoItens,
  devolucaoAnomalias,
  rulesEngines,
  devolucaoTransportadoras,
  transporteCargaParada,
  produtividadeAnomalia,
  movimentacao,
  transporteAnomalia,
  liteValidacao,
  liteAnomalia,
  userCenter,
} from './schema';

export const demandaRelations = relations(demanda, ({ one, many }) => ({
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
  paletes: many(palete),
  pausas: many(pausa),
  produtividadeAnomalias: many(produtividadeAnomalia),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  demandas_cadastradoPorId: many(demanda, {
    relationName: 'demanda_cadastradoPorId_user_id',
  }),
  demandas_funcionarioId: many(demanda, {
    relationName: 'demanda_funcionarioId_user_id',
  }),
  corteMercadorias_criadoPorId: many(corteMercadoria, {
    relationName: 'corteMercadoria_criadoPorId_user_id',
  }),
  corteMercadorias_realizadoPorId: many(corteMercadoria, {
    relationName: 'corteMercadoria_realizadoPorId_user_id',
  }),
  dashboardProdutividadeUsers: many(dashboardProdutividadeUser),
  configuracaoImpressaoMapas: many(configuracaoImpressaoMapa),
  historicoImpressaoMapas: many(historicoImpressaoMapa),
  paletes: many(palete),
  pausaGerals: many(pausaGeral),
  pausas: many(pausa),
  historicoStatusTransportes: many(historicoStatusTransporte),
  transportes: many(transporte),
  devolucaoHistoricoStatuses: many(devolucaoHistoricoStatus),
  center: one(center, {
    fields: [user.centerId],
    references: [center.centerId],
  }),
  devolucaoDemandas_adicionadoPorId: many(devolucaoDemanda, {
    relationName: 'devolucaoDemanda_adicionadoPorId_user_id',
  }),
  devolucaoDemandas_conferenteId: many(devolucaoDemanda, {
    relationName: 'devolucaoDemanda_conferenteId_user_id',
  }),
  rulesEngines: many(rulesEngines),
  transporteCargaParadas: many(transporteCargaParada),
  produtividadeAnomalias_criadoPorId: many(produtividadeAnomalia, {
    relationName: 'produtividadeAnomalia_criadoPorId_user_id',
  }),
  produtividadeAnomalias_funcionarioId: many(produtividadeAnomalia, {
    relationName: 'produtividadeAnomalia_funcionarioId_user_id',
  }),
  movimentacaos_idUsuario: many(movimentacao, {
    relationName: 'movimentacao_idUsuario_user_id',
  }),
  movimentacaos_executadoPor: many(movimentacao, {
    relationName: 'movimentacao_executadoPor_user_id',
  }),
  liteValidacaos_adicionarPor: many(liteValidacao, {
    relationName: 'liteValidacao_adicionarPor_user_id',
  }),
  liteValidacaos_contadoPor: many(liteValidacao, {
    relationName: 'liteValidacao_contadoPor_user_id',
  }),
  liteAnomalias: many(liteAnomalia),
  userCenters: many(userCenter),
}));

export const centerRelations = relations(center, ({ many }) => ({
  demandas: many(demanda),
  configuracaos: many(configuracao),
  corteMercadorias: many(corteMercadoria),
  dashboardProdutividadeCenters: many(dashboardProdutividadeCenter),
  dashboardProdutividadeUsers: many(dashboardProdutividadeUser),
  configuracaoImpressaoMapas: many(configuracaoImpressaoMapa),
  pausaGerals: many(pausaGeral),
  transportes: many(transporte),
  users: many(user),
  devolucaoDemandas: many(devolucaoDemanda),
  rulesEngines: many(rulesEngines),
  devolucaoTransportadoras: many(devolucaoTransportadoras),
  movimentacaos: many(movimentacao),
  liteValidacaos: many(liteValidacao),
  liteAnomalias: many(liteAnomalia),
  userCenters: many(userCenter),
}));

export const configuracaoRelations = relations(configuracao, ({ one }) => ({
  center: one(center, {
    fields: [configuracao.centerId],
    references: [center.centerId],
  }),
}));

export const corteMercadoriaRelations = relations(
  corteMercadoria,
  ({ one }) => ({
    center: one(center, {
      fields: [corteMercadoria.centerId],
      references: [center.centerId],
    }),
    user_criadoPorId: one(user, {
      fields: [corteMercadoria.criadoPorId],
      references: [user.id],
      relationName: 'corteMercadoria_criadoPorId_user_id',
    }),
    user_realizadoPorId: one(user, {
      fields: [corteMercadoria.realizadoPorId],
      references: [user.id],
      relationName: 'corteMercadoria_realizadoPorId_user_id',
    }),
    transporte: one(transporte, {
      fields: [corteMercadoria.transporteId],
      references: [transporte.numeroTransporte],
    }),
  }),
);

export const transporteRelations = relations(transporte, ({ one, many }) => ({
  corteMercadorias: many(corteMercadoria),
  historicoImpressaoMapas: many(historicoImpressaoMapa),
  paletes: many(palete),
  historicoStatusTransportes: many(historicoStatusTransporte),
  user: one(user, {
    fields: [transporte.cadastradoPorId],
    references: [user.id],
  }),
  center: one(center, {
    fields: [transporte.centerId],
    references: [center.centerId],
  }),
  transporteCargaParadas: many(transporteCargaParada),
  transporteAnomalias: many(transporteAnomalia),
}));

export const dashboardProdutividadeCenterRelations = relations(
  dashboardProdutividadeCenter,
  ({ one }) => ({
    center: one(center, {
      fields: [dashboardProdutividadeCenter.centerId],
      references: [center.centerId],
    }),
  }),
);

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

export const devolucaImagensRelations = relations(
  devolucaImagens,
  ({ one }) => ({
    devolucaoDemanda: one(devolucaoDemanda, {
      fields: [devolucaImagens.demandaId],
      references: [devolucaoDemanda.id],
    }),
  }),
);

export const devolucaoDemandaRelations = relations(
  devolucaoDemanda,
  ({ one, many }) => ({
    devolucaImagens: many(devolucaImagens),
    devolucaoCheckLists: many(devolucaoCheckList),
    devolucaoHistoricoStatuses: many(devolucaoHistoricoStatus),
    devolucaoItens: many(devolucaoItens),
    devolucaoNotas: many(devolucaoNotas),
    user_adicionadoPorId: one(user, {
      fields: [devolucaoDemanda.adicionadoPorId],
      references: [user.id],
      relationName: 'devolucaoDemanda_adicionadoPorId_user_id',
    }),
    center: one(center, {
      fields: [devolucaoDemanda.centerId],
      references: [center.centerId],
    }),
    user_conferenteId: one(user, {
      fields: [devolucaoDemanda.conferenteId],
      references: [user.id],
      relationName: 'devolucaoDemanda_conferenteId_user_id',
    }),
    devolucaoAnomaliases: many(devolucaoAnomalias),
  }),
);

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

export const pausaGeralRelations = relations(pausaGeral, ({ one, many }) => ({
  center: one(center, {
    fields: [pausaGeral.centerId],
    references: [center.centerId],
  }),
  user: one(user, {
    fields: [pausaGeral.registradoPorId],
    references: [user.id],
  }),
  pausas: many(pausa),
}));

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

export const devolucaoCheckListRelations = relations(
  devolucaoCheckList,
  ({ one }) => ({
    devolucaoDemanda: one(devolucaoDemanda, {
      fields: [devolucaoCheckList.demandaId],
      references: [devolucaoDemanda.id],
    }),
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

export const devolucaoItensRelations = relations(devolucaoItens, ({ one }) => ({
  devolucaoNota: one(devolucaoNotas, {
    fields: [devolucaoItens.notaId],
    references: [devolucaoNotas.id],
  }),
  devolucaoDemanda: one(devolucaoDemanda, {
    fields: [devolucaoItens.demandaId],
    references: [devolucaoDemanda.id],
  }),
}));

export const devolucaoNotasRelations = relations(
  devolucaoNotas,
  ({ one, many }) => ({
    devolucaoItens: many(devolucaoItens),
    devolucaoDemanda: one(devolucaoDemanda, {
      fields: [devolucaoNotas.devolucaoDemandaId],
      references: [devolucaoDemanda.id],
    }),
  }),
);

export const devolucaoAnomaliasRelations = relations(
  devolucaoAnomalias,
  ({ one }) => ({
    devolucaoDemanda: one(devolucaoDemanda, {
      fields: [devolucaoAnomalias.demandaId],
      references: [devolucaoDemanda.id],
    }),
  }),
);

export const rulesEnginesRelations = relations(rulesEngines, ({ one }) => ({
  center: one(center, {
    fields: [rulesEngines.centerId],
    references: [center.centerId],
  }),
  user: one(user, {
    fields: [rulesEngines.criadoPorId],
    references: [user.id],
  }),
}));

export const devolucaoTransportadorasRelations = relations(
  devolucaoTransportadoras,
  ({ one }) => ({
    center: one(center, {
      fields: [devolucaoTransportadoras.centerId],
      references: [center.centerId],
    }),
  }),
);

export const transporteCargaParadaRelations = relations(
  transporteCargaParada,
  ({ one }) => ({
    transporte: one(transporte, {
      fields: [transporteCargaParada.transportId],
      references: [transporte.numeroTransporte],
    }),
    user: one(user, {
      fields: [transporteCargaParada.userId],
      references: [user.id],
    }),
  }),
);

export const produtividadeAnomaliaRelations = relations(
  produtividadeAnomalia,
  ({ one }) => ({
    user_criadoPorId: one(user, {
      fields: [produtividadeAnomalia.criadoPorId],
      references: [user.id],
      relationName: 'produtividadeAnomalia_criadoPorId_user_id',
    }),
    demanda: one(demanda, {
      fields: [produtividadeAnomalia.demandaId],
      references: [demanda.id],
    }),
    user_funcionarioId: one(user, {
      fields: [produtividadeAnomalia.funcionarioId],
      references: [user.id],
      relationName: 'produtividadeAnomalia_funcionarioId_user_id',
    }),
  }),
);

export const movimentacaoRelations = relations(movimentacao, ({ one }) => ({
  center: one(center, {
    fields: [movimentacao.idCentro],
    references: [center.centerId],
  }),
  user_idUsuario: one(user, {
    fields: [movimentacao.idUsuario],
    references: [user.id],
    relationName: 'movimentacao_idUsuario_user_id',
  }),
  user_executadoPor: one(user, {
    fields: [movimentacao.executadoPor],
    references: [user.id],
    relationName: 'movimentacao_executadoPor_user_id',
  }),
}));

export const transporteAnomaliaRelations = relations(
  transporteAnomalia,
  ({ one }) => ({
    transporte: one(transporte, {
      fields: [transporteAnomalia.transporteId],
      references: [transporte.numeroTransporte],
    }),
  }),
);

export const liteValidacaoRelations = relations(liteValidacao, ({ one }) => ({
  user_adicionarPor: one(user, {
    fields: [liteValidacao.adicionarPor],
    references: [user.id],
    relationName: 'liteValidacao_adicionarPor_user_id',
  }),
  user_contadoPor: one(user, {
    fields: [liteValidacao.contadoPor],
    references: [user.id],
    relationName: 'liteValidacao_contadoPor_user_id',
  }),
  center: one(center, {
    fields: [liteValidacao.centroId],
    references: [center.centerId],
  }),
}));

export const liteAnomaliaRelations = relations(liteAnomalia, ({ one }) => ({
  user: one(user, {
    fields: [liteAnomalia.addPor],
    references: [user.id],
  }),
  center: one(center, {
    fields: [liteAnomalia.centroId],
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
