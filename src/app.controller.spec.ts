import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

<<<<<<< HEAD
  describe('kök dizin (root)', () => {
    it('"Merhaba Dünya!" döndürmeli', () => {
      expect(appController.getHello()).toBe('Merhaba Dünya!');
=======
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
    });
  });
});
