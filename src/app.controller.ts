/* eslint-disable prefer-const */
import { Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Body, Query } from '@nestjs/common/decorators';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppService } from './app.service';
import { BlobContext } from './blob/blob-context';
import { DbContext } from './db/db-context';
import { DocumentService } from './document/document.service';
import { INotification, NotificationStatus } from './notification';
import { IUser } from './user';

@Controller()
export class AppController {
  constructor(
    private readonly dbContext: DbContext,
    private readonly blobContext: BlobContext,
    private readonly documentService: DocumentService,
    private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getUser(): Promise<IUser[]> {
    const resp = await this.dbContext
      .database
      .container('User')
      .items.query('SELECT * FROM c')
      .fetchAll();

    const result = resp.resources.map<IUser>((val) => {
      return {
        id: val.id,
        name: val.name,
        username: val.username,
        email: val.email,
      };
    });

    return result;
  }

  @Post('users')
  async createUser(@Body() user: IUser): Promise<number> {
    try {
      await this.dbContext
        .database
        .container('User')
        .items.create({
          id: uuidv4(),
          name: user.name,
          username: user.username,
          email: user.email,
        });
      return 0;
    } catch (err) {
      console.error(err);
      return 1;
    }
  }

  @Get('docs/check')
  async checkDoc(@Query('uuid') uuid: string): Promise<INotification> {
    if (uuid == null || uuid === '') {
      return;
    }

    const documentContainer = this.blobContext.connect('document');
    try {
      const blobClient = documentContainer.getBlobClient(`${uuid}.docx`);
      // way of checking blob exist.
      // (c#) http://blog.smarx.com/posts/testing-existence-of-a-windows-azure-blob
      await blobClient.getProperties();
    } catch (e) {
      // not found
      return ({ status: NotificationStatus.notStart, type: 'document', uuid: uuid });
    }

    return ({ status: NotificationStatus.done, type: 'document', uuid: uuid });
  }

  @Get('docs')
  async getDoc(
    @Res() res: Response,
    @Query('uuid') uuid: string): Promise<any> {
    if (uuid == null || uuid === '') {
      return;
    }

    const documentContainer = this.blobContext.connect('document');
    try {
      const blobClient = documentContainer.getBlobClient(`${uuid}.docx`);
      const doc = await blobClient.download();
      console.log(`download of test document ${uuid} success`);
      return doc.readableStreamBody.pipe(res);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }
  }

  @Get('docs/generate')
  async generateDoc(@Query('uuid') uuid: string): Promise<INotification> {
    if (uuid == null || uuid === '') {
      return;
    }

    this.documentService.sendMsg(uuid);
    return ({ status: NotificationStatus.processing, type: 'document', uuid: uuid });
  }
}