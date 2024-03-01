import Database from "better-sqlite3";

const db = new Database("db.db", {
  verbose: process.env.NODE_ENV !== "production" ? console.log : undefined
});

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username TEXT NOT NULL
)`);

db.exec(`
CREATE TABLE IF NOT EXISTS credentials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id VARCHAR(255) NOT NULL,
  credential_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  counter INTEGER NOT NULL,
  transports JSON,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
`);

export default db;
