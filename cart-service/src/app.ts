import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cartRoutes from './routes/cart.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/cart', cartRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.use(errorHandler);

export default app;
