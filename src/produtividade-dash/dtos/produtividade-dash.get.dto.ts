import { createSelectSchema } from 'drizzle-zod';
import { dashboardProdutividadeCenter } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getDashboardProdutividadeCenterSchema = createSelectSchema(
  dashboardProdutividadeCenter,
);

export type DashboardProdutividadeCenterGetData = z.infer<
  typeof getDashboardProdutividadeCenterSchema
>;
