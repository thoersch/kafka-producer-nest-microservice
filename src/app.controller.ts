import { Controller, Get, Logger } from '@nestjs/common';
import { Client, ClientKafka, Transport } from "@nestjs/microservices";
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  private readonly replyTimeout: number = 2000;

  constructor(private readonly appService: AppService) { }

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafka-producer',
        brokers: ['kafka-0.kafka.default.svc.cluster.local:9092','kafka-1.kafka.default.svc.cluster.local:9092', 'kafka-2.kafka.default.svc.cluster.local:9092']
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
    this.logger.log('Sending todo...');
    var promise =  this.client.send('Todos', '{ "title": "kafka todo", "done": false }').toPromise();
    return this.promiseWithTimeout(this.replyTimeout, promise, "kafka reply timed out, consumer running?");
  }

  promiseWithTimeout = (timeoutMs: number, promise: Promise<any>, failureMessage?: string) => { 
    let timeoutHandle: NodeJS.Timeout;
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(() => resolve(failureMessage), timeoutMs);
    });
  
    return Promise.race([ 
      promise, 
      timeoutPromise, 
    ]).then((result) => {
      clearTimeout(timeoutHandle);
      return result;
    }); 
  }
}