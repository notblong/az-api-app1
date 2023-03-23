import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbContext } from './db/db-context';

describe('AppController', () => {
  let appController: AppController;
  process.env.COSMOS_DB_ENDPOINT = 'http://localhost:8080';
  process.env.COSMOS_DB_KEY = 'asdasd';
  process.env.COSMOS_DB_ID = 'asdasd';
  
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, DbContext],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
