import { registerAs } from '@nestjs/config';

export default registerAs('telegram', () => {
  return {
    token: process.env.TELEGRAM_TOKEN,
    admin: process.env.TELEGRAM_ADMIN,
  };
});
