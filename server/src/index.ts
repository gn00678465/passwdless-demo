import app from './app';
import * as http from 'http';

process.on('uncaughtException', (error) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！');
  console.error(error);
  process.exit(1);
});

// 未捕捉到的 catch
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

const port = process.env.PORT || '3000';
const server = http.createServer(app);
server.listen(port);
