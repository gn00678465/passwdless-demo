import express, { Request, Response } from 'express';
import challengeRouter from './routes/challenge';
import registerRouter from './routes/register';

const app = express();

app.use('/', challengeRouter);
app.use('/register', registerRouter);

export default app;
