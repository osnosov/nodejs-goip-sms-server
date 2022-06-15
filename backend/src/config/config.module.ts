import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import appConfig from './app.config';
import udpConfig from './udp.config';
import telegramConfig from './telegram.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig, udpConfig, telegramConfig],
    }),
  ],
  exports: [],
})
export class ConfigModule {}
