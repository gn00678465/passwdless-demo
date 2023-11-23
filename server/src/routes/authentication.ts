import express, { Request, Response } from 'express';
import db from '../db/index';

const router = express.Router();

router.post('/options', async (req: Request, res: Response) => {
  const { username, user_verification } = req.body;
  if (!username) {
    return res.status(403).json({
      status: 'Error',
      message: '請輸入使用者名稱'
    });
  }
  const stmt = db.prepare<string[]>(
    'SELECT credential_id FROM auth WHERE user_id = ?'
  );
  const credential_id = stmt.get(username);
  if (!credential_id) {
    return res.status(403).json({
      status: 'Error',
      message: '使用者名稱不存在'
    });
  }
  res.status(200).json({
    status: 'Success',
    data: credential_id
  });
});

export default router;
