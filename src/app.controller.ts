import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('ana-dizin')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Karşılama mesajı döner' })
  @ApiResponse({ status: 200, description: 'Başarılı yanıt' })
  getHello(): string {
    return this.appService.getHello();
  }
}
