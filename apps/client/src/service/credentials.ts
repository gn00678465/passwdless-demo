import type { AxiosResponse } from "axios";
import { request } from "./request";

import type { ServiceResponse } from "../typings";

export interface CredentialInfo {
  id: number;
  user_id: string;
  credential_id: string;
  counter: number;
  transports: string;
  created_at: string;
  updated_at: string;
  username: string;
}

export async function getCredentials() {
  return request.get<string, AxiosResponse<ServiceResponse<Array<CredentialInfo>>>>(
    "/api/v1/credentials"
  );
}

export async function deleteCredential(id: string) {
  return request.delete<string, AxiosResponse<ServiceResponse<Array<CredentialInfo>>>>(
    `/api/v1/credentials/${id}`
  );
}
