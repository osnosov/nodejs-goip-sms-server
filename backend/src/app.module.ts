import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { UdpModule } from './udp/udp.module';

@Module({
  imports: [ConfigModule, UdpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
