# WebAuthn Demo

> WebAuthn 無密碼登入實做練習

### 流程

**註冊**

```mermaid
sequenceDiagram
  Title: Registration
  autonumber
  Actor User
  participant User Agent
  participant Relying Party
  participant Authenticator
  User ->> User Agent: Click Regist
  User Agent ->> Relying Party: Get Challenge
  Relying Party -->> User Agent: Challenge
  Note over User Agent,Relying Party: 產生 PublicKeyCredential 相關參數
  User Agent->>Authenticator: Create new credentials
  Note over User Agent,Authenticator: navigator.credentials.create
  Authenticator ->> User: 請使用生物辨識或 PIN
  User -->> Authenticator: User verified
  Authenticator ->> User Agent: Create PublicCredential
  User Agent ->> +Relying Party: This is PublicCredential
  Relying Party ->> -Relying Party: Verlify PublicCredential
  Relying Party -->> User Agent: Device registered!
  User Agent -->> User: User registered
```

**登入**

```mermaid
sequenceDiagram
  Title: Authentication
  autonumber
  Actor User
  participant User Agent
  participant Relying Party
  participant Authenticator
  User ->> User Agent: Click Login
  Note over User,User Agent: 帶入必要訊息(username)
  User Agent ->> Relying Party: Get challenge
  Relying Party -->> User Agent: Challenge + private key ID
  Note over Relying Party,User Agent: 產生 PublicKeyCredential 相關參數
  User Agent->>Authenticator: Get credentials
  Note over User Agent,Authenticator: navigator.credentials.get
  Authenticator ->> User: 請使用生物辨識或 PIN
  User -->> Authenticator: User verified
  Authenticator ->> User Agent: Send signed challenge
  User Agent ->> +Relying Party: This is signed data
  Relying Party ->> -Relying Party: Verlify signed using public key
  Relying Party -->> User Agent: Welcome!
  User Agent ->> User: User logged in
```

**PassKeys**

```mermaid
sequenceDiagram
  Title: Passkeys Authentication
  autonumber
  Actor User
  participant User Agent
  participant Relying Party
  participant Authenticator
  User Agent ->> User Agent: isConsitionalMediationAvailable
  User Agent ->> Relying Party: Get challenge
  Relying Party -->> User Agent: Challenge + private key ID
  Note over Relying Party,User Agent: 產生 PublicKeyCredential 相關參數
  User Agent->>Authenticator: Get credentials
  Note over User Agent,Authenticator: navigator.credentials.get <br> PublicKeyCredentialOptions + mediation: conditional
  Authenticator ->> User: show autofill selection
  User -->> Authenticator: User verified
  Note over User, Authenticator: 使用 token & 生物辨識(e.g. Face ID, Touch ID, ...)
  Authenticator ->> User Agent: Send signed challenge
  User Agent ->> +Relying Party: This is signed data
  Relying Party ->> -Relying Party: Verlify signed using public key
  Relying Party -->> User Agent: Welcome!
  User Agent ->> User: User logged in
```

### Feature

- [x] 將 WebAuthn 功能模組化
- [x] 調整為 Monorepo 資料夾結構
- [x] 遷移資料庫 sqlite -> prisma + mongodb
- [x] Dockerlize
- [ ] 後端驗證功能研究並實作

### Development

**Client Env**

- VITE_API_HOST: API 的路徑

**Server Env**

- PORT: server port
- RP_ID: 必須符合當前部署的網域
- RP_NAME: 必須符合當前部署的網域
- SESSION_SECRET: for session use
- DATABASE_URL: db 的路徑
  - mongodb: **mongodb://USERNAME:PASSWORD@HOST:PORT/DATABASE**

```bash
pnpm install

pnpm prisma:generate

pnpm prisma:push

pnpm dev
```

### Docker

1. 準備憑證
   - **webauthn.localhost**
2. 將憑證放入根目錄 **.certs**
   - 名稱對應 **docker/dynamic_conf.yaml** 內的設定名稱

```
docker compose up -d
```
