import { registerAs } from '@nestjs/config';

export default registerAs('keycloak', () => ({
  url: process.env.KEYCLOAK_URL,
  realm: process.env.REALM_NAME,
  clientId: 'backend',
  clientSecret: process.env.CLIENT_SECRET_KEYCLOAK,
}));
