import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fetch } from 'undici';

import { SendMessage } from './telegram.interfaces';

const TELEGRAM_BASE_URL = 'https://api.telegram.org';

@Injectable()
export class TelegramService {
  constructor(private readonly configService: ConfigService) {}

  private callTelegramMethod = async (
    token: string,
    method: string,
    payload: SendMessage,
  ) => {
    const res = await fetch(`${TELEGRAM_BASE_URL}/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return json;
  };

  private async sendMessage(token: string, payload: SendMessage) {
    return await this.callTelegramMethod(token, 'sendMessage', payload);
  }

  async sendSmsToTelegram(from: string, to: string, msg: string) {
    const { token, admin: chat_id } = this.configService.get('telegram');
    const payload = {
      chat_id,
      text: `š <b>SMS massage from GOIP</b>\n\nš¤ ${from}\n\nš„ ${to}\n\nš ${msg}`,
      parse_mode: 'HTML',
    };
    return await this.sendMessage(token, payload);
  }

  async sendStartCcallToTelegram(from: string, to: string) {
    const { token, admin: chat_id } = this.configService.get('telegram');
    const payload = {
      chat_id,
      text: `š <b>Calling a number on GOIP</b>\n\nš¤ ${from}\n\nš„ ${to}`,
      parse_mode: 'HTML',
    };
    return await this.sendMessage(token, payload);
  }
}
