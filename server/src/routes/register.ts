import express, { Request, Response } from 'express';

const router = express.Router();

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
