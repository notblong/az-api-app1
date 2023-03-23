/* eslint-disable prefer-const */
import { Controller, Get, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { v4 as uuidv4 } from 'uuid';
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

  @Post('users')
  async createUser(@Body() user: IUser): Promise<number> {
    try {
      const x = await this.dbContext
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
}
