import { createInsertSchema } from 'drizzle-zod';
import { dashboardProdutividadeCenter } from 'src/_shared/infra/drizzle/migrations/schema';
import z from 'zod';

export const createDashboardProdutividadeCenterSchema = createInsertSchema(
  dashboardProdutividadeCenter,
).omit({ id: true });

export type DashboardProdutividadeCenterCreateData = z.infer<
  typeof createDashboardProdutividadeCenterSchema
>;
