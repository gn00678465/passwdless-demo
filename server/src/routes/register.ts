import express, { Request, Response } from 'express';
import db from '../db/index';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { credential_id, public_key, username } = req.body;
  if (!credential_id || !public_key || !username) {
    return res.status(403).json({
      status: 'Error',
      message: '缺少必要資訊'
    });
  }
  const stmt = db.prepare<string[]>(
    'INSERT INTO auth (credential_id, user_id, public_key) VALUES (?, ?, ?)'
  );
  stmt.run(credential_id, username, public_key);
  res.status(200).json({
    status: 'Success'
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

export default router;
