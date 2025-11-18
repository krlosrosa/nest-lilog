import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const produtosTransporteSchema = z.object({
  transporte: z.string(),
  remessa: z.string(),
  cliente: z.string(),
  sku: z.string(),
  descricao: z.string(),
  placa: z.string(),
  nomeCliente: z.string(),
  lote: z.string(),
  quantidade: z.number().optional().default(0),
  quantidadeCortada: z.number().optional().default(0),
  caixas: z.number().optional().default(0),
  caixasCortadas: z.number().optional().default(0),
  segmento: z.string(),
  tipo: z.string().optional().default('1'),
});

export type ProdutosTransporteData = z.infer<typeof produtosTransporteSchema>;

export const ProdutosTransporteDto = createZodDto(produtosTransporteSchema);
