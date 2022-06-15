import { registerAs } from '@nestjs/config';

import { UdpServerOption } from '../udp/udp.service';

export default registerAs('udp', (): UdpServerOption => {
  return {
    bindOptions: {
      address: process.env.UDP_HOST || '0.0.0.0',
      port: (process.env.UDP_PORT || 44444) as number,
    },
    socketOptions: {
      type: 'udp4',
    },
  };
});
