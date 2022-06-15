import { Logger } from '@nestjs/common';
import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import {
  createSocket,
  BindOptions,
  SocketOptions,
  Socket,
  RemoteInfo,
} from 'dgram';

export class UdpContext {
  constructor(private msg: Buffer, private info: RemoteInfo) {}
}

export interface UdpServerOption {
  bindOptions: BindOptions;
  socketOptions: SocketOptions;
}

export type MessagePatternType =
  | 'req'
  | 'receive'
  | 'deliver'
  | 'hangup'
  | 'record'
  | 'state'
  | 'expiry';

export const messagePatterns: string[] = [
  'req',
  'receive',
  'deliver',
  'hangup',
  'record',
  'state',
  'expiry',
];

export class UdpServer extends Server implements CustomTransportStrategy {
  protected logger = new Logger('UdpServer');
  public server: Socket;

  constructor(private readonly options: UdpServerOption) {
    super();
  }

  public async listen(callback: () => void) {
    this.server = createSocket(this.options.socketOptions);

    this.server.bind(this.options.bindOptions);

    this.server.on('listening', () => {
      const { address, port } = this.server.address();
      this.logger.log(`UDP Server listening on http://${address}:${port}`);
    });

    this.server.on('message', async (msg: Buffer, info: RemoteInfo) => {
      const message = msg.toString('utf8');
      const msgJson = this.transformBufferToJson(message);
      const pattern = Object.keys(msgJson)[0];
      const handler = this.getHandlerByPattern(pattern);

      const success =
        pattern === 'req'
          ? `reg:${msgJson[pattern]};status:200;`
          : `${pattern.toUpperCase()} ${msgJson[pattern]} OK`;

      if (!handler && !messagePatterns.includes(pattern)) {
        this.logger.warn(`No pattern event : ${JSON.stringify(pattern)}.`);
      }

      if (handler && messagePatterns.includes(pattern)) {
        this.server.send(success, info.port, info.address, (err) => {
          if (err) this.logger.error(`Error send message: ${err}`);
        });

        const context = new UdpContext(
          JSON.parse(JSON.stringify(message)),
          info,
        );

        handler(msgJson, context);
      }
    });

    this.server.on('error', (err) => {
      this.logger.error(`Server error:\n${err.stack}`);
      // this.close();
    });

    callback();
  }

  public transformBufferToJson(data: string) {
    const dataJson = {};
    const arr = data.toLowerCase().split(';');
    for (let i = 0; i < arr.length; i++) {
      const [key, ...val] = arr[i].split(':');
      if (!key.length) {
        continue;
      }
      dataJson[key] = val.join(':');
    }
    return dataJson;
  }

  public async close() {
    this.server.close();
    this.logger.error(`UDP Server close !`);
  }
}
