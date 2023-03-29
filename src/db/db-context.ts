import { CosmosClient, Database } from '@azure/cosmos';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbContext {
  database: Database;

  constructor() {
    if (!this.database) {
      console.log('DbContext Initialization');
      this.database = this.connect();
    }
  }

  connect() {
    const endpoint = process.env.COSMOS_DB_ENDPOINT;
    const key = process.env.COSMOS_DB_KEY;
    const dbId = process.env.COSMOS_DB_ID;
    const client = new CosmosClient({
      endpoint: endpoint,
      key: key,
    });

    return client.database(dbId);
  }
}