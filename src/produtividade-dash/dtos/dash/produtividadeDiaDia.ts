import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import {
  viewProdutividadePorDia,
  viewProdutividadeFuncionario,
  viewProdutivdadeProcesso,
} from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

export const getProdutividadeDiaDiaSchema = createSelectSchema(
  viewProdutividadePorDia,
);

export const getProdutividadePorFuncionarioPorDiaSchema = createSelectSchema(
  viewProdutividadeFuncionario,
);

export const getProdutividadeProcessoSchema = createSelectSchema(
  viewProdutivdadeProcesso,
);

export const getProdutividadePorFuncionarioSchema = createSelectSchema(
  viewProdutividadeFuncionario,
);

export type ProdutividadeDiaDiaGetData = z.infer<
  typeof getProdutividadeDiaDiaSchema
>;

const ProdutividadeDiaDiaGetDataSchema = z.object({
  produtividade: z.array(getProdutividadeDiaDiaSchema),
  top5Produtividade: z.array(getProdutividadePorFuncionarioPorDiaSchema),
  bottom5Produtividade: z.array(getProdutividadePorFuncionarioPorDiaSchema),
  produtividadeProcesso: z.array(getProdutividadeProcessoSchema),
  listaProdutividadePorFuncionario: z.array(
    getProdutividadePorFuncionarioSchema,
  ),
});

export class ProdutividadeDiaDiaGetDataDto extends createZodDto(
  ProdutividadeDiaDiaGetDataSchema,
) {}
