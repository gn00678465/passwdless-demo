# WebAuthn Demo
> WebAuthn 無密碼登入實做練習


### 流程
**註冊**
```mermaid
sequenceDiagram
    Title: Registration
    User ->> Browser: Click Regist
    Browser ->> Server: 註冊
    Server -->> Browser: 產生 PublicKeyCredential 相關參數
    Browser ->> User: 請使用生物辨識或 PIN
    User -->> Browser: User verified
    Browser ->> Browser: Create PublicCredential
    Browser ->> Server: This is PublicCredential
    Server ->> Server: Verlify PublicCredential
    Server -->> Browser: Device registered!
```

**登入**
```mermaid
sequenceDiagram
    Title: Authentication
    User ->> Browser: 輸入必要訊息(username) 
    Browser ->> Server: 登入
    Server -->> Browser: 產生 PublicKeyCredential 相關參數
    Browser ->> User: 請使用生物辨識或 PIN
    User -->> Browser: User verified
    Browser ->> Browser: get PublicCredential
    Browser ->> Server: This is signed data
    Server ->> Server: Verlify signed using public key
    Server -->> Browser: Welcome!
```

### Feature
- [ ] 將 WebAuthn 功能模組化
- [ ] 後端驗證功能研究並實作

### Usage

**Client**
```
pnpm install

pnpm dev
```

**Server**
```
pnpm install

pnpm dev
```

**Docker**
```
docker-compose up -d
```

**Docker(tls)**
1. 準備憑證(mkcert)
    - **serve-spa.localhost**
2. 將憑證放入根目錄 **.certs**
    - 名稱對應 **docker/dynamic_conf.yaml** 內的設定名稱
```
docker-compose -f docker-compose-tls.yml up -d
```