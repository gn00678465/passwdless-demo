export interface ClientDataJSON {
  challenge: string;
  origin: string;
  type: "webauthn.create" | "webauthn.get";
}
