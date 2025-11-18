// my-custom-controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { type Response } from 'express';

@Controller('metrics')
export class MyCustomController extends PrometheusController {
  @ApiExcludeEndpoint()
  @Get('me')
  async index(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }
}
