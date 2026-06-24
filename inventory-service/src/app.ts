import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import inventoryRoutes from './routes/inventory.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/inventory', inventoryRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.use(errorHandler);

export default app;
