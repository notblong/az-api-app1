/* eslint-disable prefer-const */
import { CosmosClient } from '@azure/cosmos';
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { DbContext } from './db/db-context';
import { IUser } from './user';

@Controller()
export class AppController {
  constructor(
    private readonly dbContext: DbContext,
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
}
