import Database from 'better-sqlite3';

const db = new Database('db.db', { verbose: console.log });

db.exec(`
CREATE TABLE IF NOT EXISTS auth (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  credential_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  public_key NOT NULL
)
`);

export default db;
