import { EventPattern } from '@nestjs/microservices';

import { MessagePatternType } from './udp.service';

export const UdpMassagePattern = (topic: MessagePatternType) => {
  return EventPattern(topic);
};
