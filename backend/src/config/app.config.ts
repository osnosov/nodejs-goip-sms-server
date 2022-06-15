import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    port: (process.env.PORT || 3000) as number,
    host: process.env.HOST || '0.0.0.0',
  };
});
