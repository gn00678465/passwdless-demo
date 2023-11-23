import db from '../db/index';

// register
export function getUserRegisteredAuthenticators<T>(username: string): T[] {
  const fmt = db.prepare<string[]>('SELECT * FROM auth WHERE username = ?');
  return fmt.all(username) as T[];
}

export function registerUserAuthenticator(
  username: string,
  credentialId: string,
  publicKey: string,
  transports: string,
  algorithm: string
) {
  const stmt = db.prepare<string[]>(
    'INSERT INTO auth (credential_id, username, public_key, algorithm, transports) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(credentialId, username, publicKey, algorithm, transports);
}

// challenge
export function saveUserRegisterChallenge(username: string, challenge: string) {
  const stmt = db.prepare<string[]>(
    'INSERT OR REPLACE INTO challenge (username, challenge) VALUES (?, ?)'
  );
  return stmt.run(username, challenge);
}

export function getUserRegisterChallenge(username: string) {
  const fmt = db.prepare<string[]>(
    'SELECT challenge FROM challenge WHERE username = ?'
  );
  return fmt.get(username);
}

export function clearUserRegisterChallenge(username: string) {
  const fmt = db.prepare<string[]>('DELETE FROM challenge WHERE username = ?');
  return fmt.run(username);
}
