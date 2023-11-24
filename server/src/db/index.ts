import Database from 'better-sqlite3';

const db = new Database('db.db', { verbose: console.log });

db.exec(`
CREATE TABLE IF NOT EXISTS auth (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  credential_id TEXT NOT NULL,
  username TEXT NOT NULL,
  public_key TEXT NOT NULL,
  transports JSON
)
`);

db.exec(`
CREATE TABLE IF NOT EXISTS challenge(
  username TEXT NOT NULL UNIQUE,
  challenge TEXT NOT NULL
)
`);

export default db;
