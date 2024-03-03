import db from "../storage";

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
      const stmt = db.prepare<[string, string, string, number, string]>(`
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
      const stmt = db.prepare<[string]>("SELECT * FROM credentials WHERE credential_id = ?");
      return stmt.get(credentialId) as CredentialInfo | undefined | null;
    } catch (error) {
      console.error("Error retrieving credential:", error);
      throw error;
    }
  },
  async getAllCredentialByCredentialId(credentialId: string) {
    try {
      const stmt = db.prepare<[string]>("SELECT * FROM credentials WHERE credential_id = ?");
      return (stmt.all(credentialId) || []) as CredentialInfo[];
    } catch (error) {
      console.error("Error retrieving credential:", error);
      throw error;
    }
  },
  async getCredentialByUserId(userId: string) {
    try {
      const stmt = db.prepare<[string]>("SELECT * FROM credentials WHERE user_id = ?");
      return stmt.get(userId) as CredentialInfo | undefined | null;
    } catch (error) {
      console.error("Error retrieving credential:", error);
      throw error;
    }
  },
  async getAllCredentialByUserId(userId: string) {
    try {
      const stmt = db.prepare<[string]>("SELECT * FROM credentials WHERE user_id = ?");
      return (stmt.all(userId) || []) as CredentialInfo[];
    } catch (error) {
      console.error("Error retrieving credential:", error);
      throw error;
    }
  },
  async updateCredentialCounter() {}
};

export type CredentialService = typeof credentialService;
