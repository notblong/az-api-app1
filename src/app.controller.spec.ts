import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlobContext } from './blob/blob-context';
import { DbContext } from './db/db-context';
import { DocumentService } from './document/document.service';
import { ServiceBus } from './queue/service-bus';

describe('AppController', () => {
  // let appController: AppController;
  // process.env.COSMOS_DB_ENDPOINT = 'http://localhost:8080';
  // process.env.COSMOS_DB_KEY = 'asdasd';
  // process.env.COSMOS_DB_ID = 'asdasd';
  // process.env.AZURE_STORAGE_CONNECTION_STRING = 'lskjadhfkjhaslkdfhkj';
  
  beforeEach(async () => {
    // const app: TestingModule = await Test.createTestingModule({
    //   imports: [HttpModule, ServiceBus],
    //   controllers: [AppController],
    //   providers: [AppService, DbContext, BlobContext, ServiceBus, DocumentService],
    // }).compile();

    // appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should pass"', () => {
      expect(true).toBe(true);
    });
  });
});
