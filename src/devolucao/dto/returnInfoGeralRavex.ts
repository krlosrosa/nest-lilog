import { createZodDto } from 'nestjs-zod';
import { TipoDevolucaoNotas } from 'src/_shared/enums/devolucao/devolucao.type';
import { z } from 'zod';

export const ReturnInfoGeralRavexSchema = z
  .object({
    idViagem: z.string(),
    placa: z.string().length(7, 'Placa deve ter 7 caracteres'),
    motorista: z.string(),
    transportadora: z.string(),
    notas: z.array(
      z.object({
        tipo: z.nativeEnum(TipoDevolucaoNotas),
        notaFiscal: z.string(),
        notaFiscalParcial: z.string().nullable().optional(),
        motivoDevolucao: z.string(),
        descMotivoDevolucao: z.string().nullable(),
        operador: z.string().nullable().optional(),
        empresa: z.string(),
        itens: z.array(
          z.object({
            sku: z.string(),
            descricao: z.string().regex(/^(?!produto não encontrado$).*$/, {
              message: 'Valor inválido',
            }),
            pesoLiquido: z.number(),
            quantidadeRavex: z.number(),
            quantidadeCaixas: z.number(),
            quantidadeUnidades: z.number(),
            fatorConversao: z.number(),
            unPorCaixa: z.number(),
            decimal: z.number(),
          }),
        ),
      }),
    ),
  })
  .refine(
    // 2. A função de validação agora recebe o objeto inteiro da nota ('data')
    (data) => {
      // 3. A lógica de validação:
      // Se o tipo NÃO FOR 'DEVOLUCAO_PARCIAL', a validação passa para este campo.
      if (
        data.notas.some(
          (nota) => nota.tipo !== TipoDevolucaoNotas.DEVOLUCAO_PARCIAL,
        )
      ) {
        return true;
      }
      return !!data.notas.some(
        (nota) =>
          nota.notaFiscalParcial && nota.notaFiscalParcial.trim() !== '',
      );
    },
    // 4. O objeto de configuração do erro:
    {
      // A mensagem a ser exibida se a validação falhar (retornar false)
      message: 'Nota Fiscal Parcial é obrigatória para devoluções parciais',
      path: ['notas', 'notaFiscalParcial'],
    },
  );

export class ReturnInfoGeralRavex extends createZodDto(
  ReturnInfoGeralRavexSchema,
) {}
