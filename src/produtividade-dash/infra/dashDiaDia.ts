import { and, asc, desc, eq, gte, isNotNull, lte } from 'drizzle-orm';
import {
  viewProdutivdadeProcesso,
  viewProdutividadeFuncionario,
  viewProdutividadePorDia,
} from 'src/_shared/infra/drizzle';
import { DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { ProdutividadeDiaDiaGetDataDto } from '../dtos/dash/produtividadeDiaDia';

export type DashDiaDiaParams = {
  dataInicio: string;
  dataFim: string;
  centerId: string;
};

export async function dashDiaDia(
  db: DrizzleClient,
  params: DashDiaDiaParams,
): Promise<ProdutividadeDiaDiaGetDataDto> {
  const { dataInicio, dataFim, centerId } = params;

  const produtividade = await db
    .select()
    .from(viewProdutividadePorDia)
    .where(
      and(
        eq(viewProdutividadePorDia.centerid, centerId),
        gte(viewProdutividadePorDia.data, dataInicio),
        lte(viewProdutividadePorDia.data, dataFim),
      ),
    );
  const top5Produtividade = await db
    .select()
    .from(viewProdutividadeFuncionario)
    .where(
      and(
        eq(viewProdutividadeFuncionario.centerid, centerId),
        gte(viewProdutividadeFuncionario.periodoInicio, dataInicio),
        lte(viewProdutividadeFuncionario.periodoFim, dataFim),
        isNotNull(viewProdutividadeFuncionario.produtividadeCaixaPorHora),
      ),
    )
    .orderBy(desc(viewProdutividadeFuncionario.produtividadeCaixaPorHora))
    .limit(5);
  const bottom5Produtividade = await db
    .select()
    .from(viewProdutividadeFuncionario)
    .where(
      and(
        eq(viewProdutividadeFuncionario.centerid, centerId),
        gte(viewProdutividadeFuncionario.periodoInicio, dataInicio),
        lte(viewProdutividadeFuncionario.periodoFim, dataFim),
        isNotNull(viewProdutividadeFuncionario.produtividadeCaixaPorHora),
      ),
    )
    .orderBy(asc(viewProdutividadeFuncionario.produtividadeCaixaPorHora))
    .limit(5);

  const produtividadeProcesso = await db
    .select()
    .from(viewProdutivdadeProcesso)
    .where(
      and(
        eq(viewProdutivdadeProcesso.centerid, centerId),
        gte(viewProdutivdadeProcesso.criadoem, dataInicio),
        lte(viewProdutivdadeProcesso.criadoem, dataFim),
      ),
    );
  return {
    produtividade: produtividade,
    top5Produtividade: top5Produtividade,
    bottom5Produtividade: bottom5Produtividade,
    produtividadeProcesso: produtividadeProcesso,
  };
}
