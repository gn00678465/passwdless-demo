import app from "./app";
import * as http from "http";
import * as https from "https";
import fs from "node:fs";
import path from "node:path";

const options = {
  key: fs.readFileSync(path.resolve(process.cwd(), "../../certs/server.key")),
  cert: fs.readFileSync(path.resolve(process.cwd(), "../../certs/server.crt"))
};

process.on("uncaughtException", (error) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("Uncaughted Exception！");
  console.error(error);
  process.exit(1);
});

// 未捕捉到的 catch
process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的 rejection：", promise, "原因：", reason);
  // 記錄於 log 上
});

const hostname = "0.0.0.0";
const port = process.env.PORT || "3000";

const server = https.createServer(options, app);
server.listen(parseInt(port), hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
