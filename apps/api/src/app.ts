import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import { authRouter } from './routes/auth.routes';
import { userRouter } from './routes/user.routes';
import { errorHandler } from './middleware/error.middleware';
import { swaggerRouter } from './swagger';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/docs', swaggerRouter);

app.get('/api', (_req, res) =>
  res.json({ status: 'ok', message: 'Battery ERP API is running', docs: '/api/docs', health: '/api/health' }),
);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

export default app;
