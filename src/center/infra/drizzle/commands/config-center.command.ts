import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { configuracaoImpressaoMapa } from 'src/_shared/infra/drizzle/migrations/schema';
import { ConfiguracaoImpressaoMapaDto } from 'src/center/dto/center/configuracaoImpressaoMapa.dto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Esta função executa um upsert (insert ou update) na configuração de impressão de mapa.
 * Se já existir uma configuração para o centerId + empresa, atualiza.
 * Caso contrário, cria uma nova.
 */
export async function configCenterCommand(
  db: DrizzleClient,
  centerId: string,
  configMapaDto: ConfiguracaoImpressaoMapaDto,
): Promise<ConfiguracaoImpressaoMapaDto> {
  const empresa = configMapaDto.empresa || 'LDB';
  const now = new Date();

  // Prepara os dados para inserção/atualização
  const configData = {
    ...configMapaDto,
    id: uuidv4(),
    centerId,
    empresa,
    updatedAt: now.toISOString(),
    // createdAt não deve ser atualizado em caso de conflito
    createdAt: configMapaDto.createdAt || now.toISOString(),
  };

  // Campos que serão atualizados em caso de conflito (exclui id, createdAt, centerId, empresa)
  const updateFields = {
    tipoImpressao: configData.tipoImpressao,
    quebraPalete: configData.quebraPalete,
    tipoQuebra: configData.tipoQuebra,
    valorQuebra: configData.valorQuebra,
    separarPaleteFull: configData.separarPaleteFull,
    separarUnidades: configData.separarUnidades,
    exibirInfoCabecalho: configData.exibirInfoCabecalho,
    segregarFifo: configData.segregarFifo,
    dataMaximaPercentual: configData.dataMaximaPercentual,
    atribuidoPorId: configData.atribuidoPorId,
    tipoImpressaoConferencia: configData.tipoImpressaoConferencia,
    ordemConferencia: configData.ordemConferencia,
    ordemFifo: configData.ordemFifo,
    ordemPaletes: configData.ordemPaletes,
    ordemPicking: configData.ordemPicking,
    ordemUnidades: configData.ordemUnidades,
    updatedAt: now.toISOString(),
  };

  const result = await db
    .insert(configuracaoImpressaoMapa)
    .values(configData)
    .onConflictDoUpdate({
      target: [
        configuracaoImpressaoMapa.centerId,
        configuracaoImpressaoMapa.empresa,
      ],
      set: updateFields,
    })
    .returning();

  return result[0];
}
