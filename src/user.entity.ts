import { CosmosPartitionKey } from '@nestjs/azure-database';

export class User {
  id: string;
  name: string;
  username: string;
  email: string;
}
