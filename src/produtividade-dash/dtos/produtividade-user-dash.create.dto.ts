import { createInsertSchema } from 'drizzle-zod';
import { dashboardProdutividadeUser } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

export const createDashboardProdutividadeUserSchema = createInsertSchema(
  dashboardProdutividadeUser,
).omit({ id: true, criadoEm: true });

export type DashboardProdutividadeUserCreateData = z.infer<
  typeof createDashboardProdutividadeUserSchema
>;
