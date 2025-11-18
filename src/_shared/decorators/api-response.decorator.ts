// src/common/decorators/api-response.decorator.ts

import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

// Mapa de descrições padrão (o mesmo de antes)
const defaultErrorDescriptions: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]:
    'A requisição é inválida. Verifique os parâmetros enviados.',
  [HttpStatus.UNAUTHORIZED]:
    'A autenticação é necessária. Forneça um token válido.',
  [HttpStatus.FORBIDDEN]: 'Você não tem permissão para acessar este recurso.',
  [HttpStatus.NOT_FOUND]: 'O recurso solicitado não foi encontrado.',
  [HttpStatus.CONFLICT]: 'Já existe um recurso com estes identificadores.',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Ocorreu um erro inesperado no servidor.',
};

// --- NOSSOS NOVOS DECORADORES ---

/**
 * Adiciona respostas padrão da API para erros 400 (Bad Request) e 500 (Internal Server Error).
 * Não recebe parâmetros.
 */
export function ApiStandardResponses() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: defaultErrorDescriptions[HttpStatus.BAD_REQUEST],
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: defaultErrorDescriptions[HttpStatus.INTERNAL_SERVER_ERROR],
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: defaultErrorDescriptions[HttpStatus.UNAUTHORIZED],
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: defaultErrorDescriptions[HttpStatus.FORBIDDEN],
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: defaultErrorDescriptions[HttpStatus.NOT_FOUND],
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: defaultErrorDescriptions[HttpStatus.CONFLICT],
    }),
  );
}
