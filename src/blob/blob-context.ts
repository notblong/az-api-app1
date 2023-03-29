import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlobContext {
  client: BlobServiceClient;

  constructor() {
    if (!this.client) {
      console.log('BlobContext Initialization');
      this.client = this.init();
    }
  }

  init() {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!AZURE_STORAGE_CONNECTION_STRING) {
      throw Error('Azure Storage Connection string not found');
    }

    // Create the BlobServiceClient object with connection string
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );

    return blobServiceClient;
  }

  connect(container: string): ContainerClient {
    if (!this.client) {
      throw new Error('Could not connect to container ' + container);
    }

    return this.client.getContainerClient(container); 
  }
}