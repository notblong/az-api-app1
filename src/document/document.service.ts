import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ServiceBus } from 'src/queue/service-bus';

@Injectable()
export class DocumentService {
  constructor(
    private readonly serviceBusClient: ServiceBus,
    private readonly httpService: HttpService) {}
  
  
  /**
   * REST API endpoint
   * @param params 
   */
  triggerHttpGenerateUserDocument(params: any): void {
    if (params.uuid == null) {
      throw new Error('uuid is required');
    }

    this.httpService.get(`${process.env.GENERATE_DOCUMENT_FUNCTION_URL}?uuid=${params.uuid}`).subscribe();
    console.log(`[SUCCESS] Call Azure function to generate successfully`);
  }


  /**
   * Message Queue
   * @param uuid: The uuid of the user suppose to generate the document.
   * @returns 
   */
  async sendMsg(uuid: string) {
    const msg = { body: { uuid } };
    const sender = this.serviceBusClient.documentSender;
    let batch = await sender.createMessageBatch();
    if (!batch.tryAddMessage(msg)) {
      console.log(`[FAIL] Could not send a batch of messages to the queue: ${process.env.SERVICE_BUS_QUEUE_NAME}`);
      return;
    }

    await sender.sendMessages(batch);
    console.log(`[SUCCESS] Sent a batch of messages to the queue: ${process.env.SERVICE_BUS_QUEUE_NAME}`);
  }
}
