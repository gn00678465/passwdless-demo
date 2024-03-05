import { v4 as uuidv4 } from "uuid";
import sqlite from "../storage/sqlite3";

export interface UserInfo {
  id: string;
  username: string;
}

export const userService = {
  async getUserById(userId: string) {
    const fmt = sqlite.prepare<string[]>("SELECT * FROM users WHERE id = ?");
    return fmt.get(userId) as UserInfo | undefined | null;
  },

  async getUserByUsername(username: string) {
    const fmt = sqlite.prepare<string[]>("SELECT * FROM users WHERE username = ?");
    return fmt.get(username) as UserInfo | undefined | null;
  },

  async createUser(username: string) {
    const id = uuidv4();
    const stmt = sqlite.prepare<string[]>("INSERT INTO users (id, username) VALUES (?, ?)");
    stmt.run(id, username);
    return { id, username };
  }
};

export type UserService = typeof userService;
