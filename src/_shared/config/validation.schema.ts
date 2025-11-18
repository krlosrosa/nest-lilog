import { z } from 'zod';

export const validationSchema = z
  .object({
    KEYCLOAK_URL: z
      .string()
      .url({ message: 'KEYCLOAK_URL deve ser uma URL válida.' }),
    REALM_NAME: z.string().min(1, { message: 'REALM_NAME é obrigatório.' }),
    CLIENT_SECRET_KEYCLOAK: z
      .string()
      .min(1, { message: 'CLIENT_SECRET_KEYCLOAK é obrigatório.' }),
  })
  .passthrough(); // <-- Ponto importante!
