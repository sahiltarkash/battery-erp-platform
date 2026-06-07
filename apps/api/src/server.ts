import dotenv from 'dotenv';
import app from './app';
import { ensureDefaultRoles } from './services/role.service';

dotenv.config();

const port = process.env.PORT ?? '4000';

async function bootstrap() {
  await ensureDefaultRoles();
  app.listen(Number(port), () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start API server', error);
  process.exit(1);
});
