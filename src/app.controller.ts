import { Controller, Get } from '@nestjs/common';
import { Client, ClientKafka, Transport } from "@nestjs/microservices";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafka-producer',
        brokers: ['kafka-2.kafka.default.svc.cluster.local:9092'],
      },
      consumer: {
        groupId: 'nest-kafka-consumer'
      }
    }
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('Todos');
    await this.client.connect();
  }

  @Get()
  rootRoute() {
    return this.client.send('Todos', '{ "title": "kafka todo", "done": false }');
  }
}