import express, { Request, Response } from 'express';
import cors from 'cors';

import challengeRouter from './routes/challenge';
import registerRouter from './routes/register';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  })
);

app.use('/api', challengeRouter);
app.use('/api/register', registerRouter);

export default app;
