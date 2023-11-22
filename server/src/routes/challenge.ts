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

export default router;
