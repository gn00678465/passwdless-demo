import { v4 as uuidv4 } from "uuid";
import sqlite from "../storage/sqlite3";
import prisma from "../storage";

export interface UserInfo {
  id: string;
  username: string;
}

export const userService = {
  async getUserById(userId: string) {
    // const fmt = sqlite.prepare<string[]>("SELECT * FROM users WHERE id = ?");
    // return fmt.get(userId) as UserInfo | undefined | null;
    try {
      const result = await prisma.user.findUnique({ where: { id: userId } });
      await prisma.$disconnect();
      return result;
    } catch (error) {
      console.error("Error retrieving user:", error);
      await prisma.$disconnect();
      throw error;
    }
  },

  async getUserByUsername(username: string) {
    // const fmt = sqlite.prepare<string[]>("SELECT * FROM users WHERE username = ?");
    // return fmt.get(username) as UserInfo | undefined | null;
    try {
      const result = await prisma.user.findUnique({ where: { username: username } });
      await prisma.$disconnect();
      return result;
    } catch (error) {
      console.error("Error retrieving user:", error);
      await prisma.$disconnect();
      throw error;
    }
  },

  async createUser(username: string) {
    const id = uuidv4();
    // const stmt = sqlite.prepare<string[]>("INSERT INTO users (id, username) VALUES (?, ?)");
    // stmt.run(id, username);
    try {
      const result = await prisma.user.create({
        data: {
          id: id,
          username: username
        }
      });
      await prisma.$disconnect();
      return result;
    } catch (error) {
      console.error("Error saving new user:", error);
      await prisma.$disconnect();
      throw error;
    }
  }
};

export type UserService = typeof userService;
