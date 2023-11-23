import express, { Request, Response } from 'express';
import cors from 'cors';
import createHttpError from 'http-errors';
import cookieParser from 'cookie-parser';

import db from './db/index';
import challengeRouter from './routes/challenge';
import registerRouter from './routes/register';
import authenticationRouter from './routes/authentication';

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  })
);
// router
app.use('/api', challengeRouter);
app.use('/api/register', registerRouter);
app.use('/api/authentication', authenticationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404, 'Page not found!'));
});

process.on('exit', () => db.close());

export default app;
