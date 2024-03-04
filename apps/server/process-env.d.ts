declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      SESSION_SECRET: string;
      PORT: string;
      RP_ID: string;
      RP_NAME: string;
      DATABASE: "sqlite3" | "mongodb";
      DATABASE_URL?: string;
    }
  }
}
export {};
