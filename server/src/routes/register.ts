import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/challenge', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'Success',
    data: {
      challenge: uuidv4()
    }
  });
});

router.get('/options', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'Success',
    data: {
      options: {}
    }
  });
});

router.post('/verify_registration', (req: Request, res: Response) => {});

export default router;
