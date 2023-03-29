import { ServiceBusClient, ServiceBusSender } from '@azure/service-bus';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceBus {
  client: ServiceBusClient;
  documentSender: ServiceBusSender;

  constructor() {
    if (!this.client) {
      console.log('ServiceBus Initialization');
      this.client = this.init();
      this.documentSender = this.createDocumentSender(this.client);
    }
  }

  init() {
    const sbClient = new ServiceBusClient(process.env.SERVICE_BUS_URL);
    return sbClient;
  }

  createDocumentSender(client: ServiceBusClient) {
    const sender = client.createSender(process.env.SERVICE_BUS_QUEUE_NAME);
    return sender;
  }
}