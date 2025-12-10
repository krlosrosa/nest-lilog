import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccountId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    console.log({ request, accountId: request.accountId });
    return request.accountId; // 👈 pega o valor injetado no request (middleware/guard)
  },
);
