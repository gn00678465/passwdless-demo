import express, { Request, Response } from 'express';
import registerRouter from './routes/register';

const app = express();

app.use('/register', registerRouter);

export default app;
