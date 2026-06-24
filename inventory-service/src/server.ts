import app from './app';
import { connectDB } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`Inventory Service running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  process.on('unhandledRejection', (err: Error) => {
    logger.error('Unhandled Rejection', err);
    server.close(() => process.exit(1));
  });
};

startServer();
