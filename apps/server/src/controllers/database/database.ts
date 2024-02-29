import db from "../../storage/index";

// register
export function getUserRegisteredAuthenticators<T>(username: string): T[] {
  const fmt = db.prepare<string[]>("SELECT * FROM auth WHERE username = ?");
  return fmt.all(username) as T[];
}

export function registerUserAuthenticator(
  username: string,
  credentialId: string,
  publicKey: string,
  counter: number,
  transports: string
) {
  const stmt = db.prepare<(string | number)[]>(
    "INSERT INTO auth (credential_id, username, public_key, counter, transports) VALUES (?, ?, ?, ?, ?)"
  );
  stmt.run(credentialId, username, publicKey, counter, transports);
}

// challenge
export function saveUserRegisterChallenge(username: string, challenge: string) {
  const stmt = db.prepare<string[]>(
    "INSERT OR REPLACE INTO challenge (username, challenge, type) VALUES (?, ?, ?)"
  );
  return stmt.run(username, challenge, "register");
}

export function getUserRegisterChallenge(username: string) {
  const fmt = db.prepare<string[]>(
    "SELECT challenge FROM challenge WHERE username = ? AND type = ?"
  );
  return fmt.get(username, "register") as { challenge: string };
}

export function clearUserRegisterChallenge(username: string) {
  const fmt = db.prepare<string[]>("DELETE FROM challenge WHERE username = ?  AND type = ?");
  return fmt.run(username, "register");
}

export function saveUserAuthenticationChallenge(username: string, challenge: string) {
  const stmt = db.prepare<string[]>(
    "INSERT OR REPLACE INTO challenge (username, challenge, type) VALUES (?, ?, ?)"
  );
  return stmt.run(username, challenge, "authentication");
}

export function getUserAuthenticationChallenge(username: string) {
  const fmt = db.prepare<string[]>("SELECT challenge FROM challenge WHERE username = ?");
  return fmt.get(username) as { challenge: string };
}

export function clearUserAuthenticationChallenge(username: string) {
  const fmt = db.prepare<string[]>("DELETE FROM challenge WHERE username = ?");
  return fmt.run(username);
}
