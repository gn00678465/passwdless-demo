import sqlite from "../storage/sqlite3";

export interface CredentialInfo {
  id: number;
  user_id: string;
  credential_id: string;
  public_key: string;
  counter: number;
  transports: string;
}

export const credentialService = {
  /**
   * 將 credential 資訊存進資料庫
   * @param userId 使用者 id
   * @param credentialId
   * @param publicKey
   * @param counter
   * @param transports
   */
  async saveNewCredential(
    userId: string,
    credentialId: string,
    publicKey: string,
    counter: number,
    transports: string
  ) {
    try {
      const stmt = sqlite.prepare<[string, string, string, number, string]>(`
        INSERT INTO credentials (
          user_id,
          credential_id,
          public_key,
          counter,
          transports
        ) VALUES (?, ?, ?, ?, ?)
    `);
      stmt.run(userId, credentialId, publicKey, counter, transports);
      return { credentialId, counter, transports };
    } catch (error) {
      console.error("Error saving new credential:", error);
      throw error;
    }
  },
  async getCredentialByCredentialId(credentialId: string) {
    try {
      const stmt = sqlite.prepare<[string]>(`
      SELECT credentials.*, users.username
      FROM credentials
      INNER JOIN users ON credentials.user_id = users.id
      WHERE credential_id = ?
      `);
      return stmt.get(credentialId) as CredentialInfo | undefined | null;
    } catch (error) {
      console.error("Error retrieving credential:", error);
      throw error;
    }
  },
  async getAllCredentialByCredentialId(credentialId: string) {
    try {
      const stmt = sqlite.prepare<[string]>(`
      SELECT credentials.*, users.username
      FROM credentials
      INNER JOIN users ON credentials.user_id = users.id
      WHERE credential_id = ?
      `);
      return (stmt.all(credentialId) || []) as CredentialInfo[];
    } catch (error) {
      console.error("Error retrieving credential:", error);
      throw error;
    }
  },
  async getCredentialByUserId(userId: string) {
    try {
      const stmt = sqlite.prepare<[string]>(`
      SELECT credentials.*, users.username
      FROM credentials
      INNER JOIN users ON credentials.user_id = users.id
      WHERE user_id = ?
      `);
      return stmt.get(userId) as CredentialInfo | undefined | null;
    } catch (error) {
      console.error("Error retrieving credential:", error);
      throw error;
    }
  },
  async getAllCredentialByUserId(userId: string) {
    try {
      const stmt = sqlite.prepare<[string]>(`
      SELECT credentials.*, users.username
      FROM credentials
      INNER JOIN users ON credentials.user_id = users.id
      WHERE user_id = ?
      `);
      return (stmt.all(userId) || []) as CredentialInfo[];
    } catch (error) {
      console.error("Error retrieving credential:", error);
      throw error;
    }
  },
  async updateCredentialCounterAndTime(credentialId: string, newCounter: number) {
    try {
      const stmt = sqlite.prepare<[number, string]>(
        "UPDATE credentials SET counter = ?, updated_at = CURRENT_TIMESTAMP WHERE credential_id = ?"
      );
      stmt.run(newCounter, credentialId);
    } catch (error) {
      console.error("Error updating credential counter:", error);
      throw error;
    }
  },
  /**
   * 移除特定的 credential
   * @param credentialId 要移除的 credential id
   * @returns {Promise<CredentialInfo[]>}
   */
  async deleteCredentialByCredentialId(
    credentialId: string,
    userId: string
  ): Promise<CredentialInfo[]> {
    try {
      const stmt = sqlite.prepare<[string]>(`
      DELETE FROM credentials WHERE credential_id = ?
      `);
      stmt.run(credentialId);
      return await this.getAllCredentialByUserId(userId);
    } catch (error) {
      console.error("Error delete credential:", error);
      throw error;
    }
  }
};

export type CredentialService = typeof credentialService;
