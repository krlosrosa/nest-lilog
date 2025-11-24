import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const TokenRavexDtoSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().nullable(),
});

export class TokenRavexDto extends createZodDto(TokenRavexDtoSchema) {}
