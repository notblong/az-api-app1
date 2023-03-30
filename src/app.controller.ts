/* eslint-disable prefer-const */
import { Controller, Get, Header, Post, Res } from '@nestjs/common';
import { Body, Query } from '@nestjs/common/decorators';
import { v4 as uuidv4 } from 'uuid';
import { AppService } from './app.service';
import { BlobContext } from './blob/blob-context';
import { DbContext } from './db/db-context';
import { DocumentService } from './document/document.service';
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

  @Get('docs')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  async getDoc(
    @Res() res,
    @Query('uuid') uuid: string) {
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
      // call func to generate document
      // console.log(`not found ${uuid}, generating document by azure function...`);
      // this.documentService.triggerHttpGenerateUserDocument({ uuid: uuid });
      console.log(`not found ${uuid}, generating document by send msg...`);
      this.documentService.sendMsg(uuid);
      console.log('closing request... 0');
      return;
    }
  }
}
