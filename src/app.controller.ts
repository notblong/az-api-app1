import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { mockUsers, User } from './user';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  getUser(): Array<User> {
    return mockUsers;
  }
}
