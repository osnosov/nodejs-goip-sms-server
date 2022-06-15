import { Module } from '@nestjs/common';

import { UDPController } from './udp.controller';
import { TelegramService } from '../telegram/telegram.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UDPController],
  providers: [TelegramService],
})
export class UdpModule {}
