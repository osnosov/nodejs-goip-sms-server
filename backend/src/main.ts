import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { UdpServer, UdpServerOption } from './udp/udp.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  const udpConfig = configService.get<UdpServerOption>('udp');

  app.connectMicroservice({
    strategy: new UdpServer(udpConfig),
  });

  await app.startAllMicroservices();

  const { port, host } = configService.get('app');

  await app.listen(port, host);
}
bootstrap();
