import { createSelectSchema } from 'drizzle-zod';
import { dashboardProdutividadeUser } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

// --- 1. Para LER do banco (EXISTENTE) ---
export const getDashboardProdutividadeUserSchema = createSelectSchema(
  dashboardProdutividadeUser,
);

export type DashboardProdutividadeUserGetData = z.infer<
  typeof getDashboardProdutividadeUserSchema
>;
