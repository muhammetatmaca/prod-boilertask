import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('ana-dizin')
@Controller()
export class AppController {
<<<<<<< HEAD
  constructor(private readonly appService: AppService) { }
=======
  constructor(private readonly appService: AppService) {}
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616

  @Get()
  @ApiOperation({ summary: 'Karşılama mesajı döner' })
  @ApiResponse({ status: 200, description: 'Başarılı yanıt' })
  getHello(): string {
    return this.appService.getHello();
  }
}
