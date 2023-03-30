import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlobContext } from './blob/blob-context';
import { DbContext } from './db/db-context';
import { DocumentService } from './document/document.service';
import { ServiceBus } from './queue/service-bus';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [AppService, DocumentService, DbContext, BlobContext, ServiceBus],
})
export class AppModule {}
