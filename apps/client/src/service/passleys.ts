import { AxiosResponse } from "axios";

import { request } from "./request";

import { PublicKeyCredentialAssert } from "../webAuthnClient";

export async function fetchPasskeysOptions() {
  return request.post<
    unknown,
    AxiosResponse<Service.SuccessfulResponse<Service.AuthenticateEntryOptions>>
  >("/api/v1/passkeys/login");
}

export async function postPasskeysSignature(data: PublicKeyCredentialAssert) {
  return request.put("/api/v1/passkeys/login", { data });
}
