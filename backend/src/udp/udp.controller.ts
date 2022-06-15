import { Controller } from '@nestjs/common';
import { Ctx, Payload } from '@nestjs/microservices';

import { UdpMassagePattern } from './udp.decorators';
import { UdpContext } from './udp.service';
import { TelegramService } from '../telegram/telegram.service';

@Controller()
export class UDPController {
  constructor(private readonly telegramService: TelegramService) {}

  // Keep Alive packets with gateway (line) information
  @UdpMassagePattern('req')
  public async req(@Payload() data, @Ctx() ctx: UdpContext) {
    // console.log('incoming req', JSON.stringify(ctx));
    // "info":{"address":"192.168.10.30","family":"IPv4","port":10991,"size":289}}
    // "info":{"address":"192.168.10.30","family":"IPv4","port":10992,"size":291}}
    // "info":{"address":"192.168.10.30","family":"IPv4","port":10993,"size":289}}
    // {"req":"502","id":"+380960000000","pass":"password","num":"","signal":"13","gsm_status":"login","voip_status":"login","voip_state":"idle","remain_time":"-1","imei":"862868041123452","imsi":"255030611235475","iccid":"8938003992745697720f","pro":"kyivstar","idle":"954","disable_status":"0","sms_login":"n","smb_login":"","cellinfo":"lac:1234,cell id:1234","cgatt":"y"}
    // {"req":"183","id":"+380500000000","pass":"password","num":"","signal":"","gsm_status":"logout","voip_status":"logout","voip_state":"idle","remain_time":"-1","imei":"862868041078137","imsi":"255016540763329","iccid":"","pro":"","idle":"16","disable_status":"0","sms_login":"y","smb_login":"","cellinfo":"","cgatt":"n"}
    // "gsm_status":"logout","voip_status":"logout","voip_state":"idle"
    // this.telegramService.sendSmsToTelegram('+380500000000', '+380990000000', 'test message!');
    return data;
  }

  // Change of gate (line) status
  // @UdpMassagePattern('state')
  // public async state(@Payload() data, @Ctx() ctx: UdpContext) {
  //   // {"state":"1655172059","id":"+380500000000","password":"password","gsm_remain_state":"incoming:+380990000000"}
  //   // {"state":"1655172057","id":"+380500000000","password":"password","gsm_remain_state":"connected:+380990000000"}
  //   // {"state":"1655172055","id":"+380500000000","password":"password","gsm_remain_state":"idle"}
  //   console.log('incoming state', JSON.stringify(data));
  //   return data;
  // }

  // Start a phone call
  @UdpMassagePattern('record')
  public async record(@Payload() data, @Ctx() ctx: UdpContext) {
    // {"record":"1655172058","id":"+380500000000","password":"password","dir":"1","num":"+380990000000"}
    // console.log('incoming record', JSON.stringify(data));
    this.telegramService.sendStartCcallToTelegram(data.num, data.id);
    return data;
  }

  // @UdpMassagePattern('expiry')
  // public async expiry(@Payload() data, @Ctx() ctx: UdpContext) {
  //   console.log('incoming expiry', JSON.stringify(data));
  //   return data;
  // }

  // End telephone call
  // @UdpMassagePattern('hangup')
  // public async hangup(@Payload() data, @Ctx() ctx: UdpContext) {
  //   // {"hangup":"1655172054","id":"+380500000000","password":"password","num":",cause:normal call clearing"}
  //   console.log('incoming hangup', JSON.stringify(data));
  //   return data;
  // }

  // Incoming SMS
  @UdpMassagePattern('receive')
  public async receive(@Payload() data, @Ctx() ctx: UdpContext) {
    // data = {"receive":"1655046449","id":"0500000000","password":"password","srcnum":"+380990000000","msg":"message"}
    this.telegramService.sendSmsToTelegram(data.srcnum, data.id, data.msg);
    return data;
  }

  // SMS delivery report
  // @UdpMassagePattern('deliver')
  // public async deliver(@Payload() data, @Ctx() ctx: UdpContext) {
  //   console.log('incoming deliver', JSON.stringify(data));
  //   return data;
  // }
}
