import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
<<<<<<< HEAD
    return 'Merhaba Dünya!';
=======
    return 'Hello World!';
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
  }
}
