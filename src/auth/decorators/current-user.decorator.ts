import { createParamDecorator, ExecutionContext } from '@nestjs/common';
<<<<<<< HEAD

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
=======
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: Record<string, unknown> }>();
    return request.user;
  },
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
);
