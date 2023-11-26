import { AxiosResponse } from 'axios';
import { request } from './request';

import { PublicKeyCredentialAssert } from '../webAuthnClient';

export async function fetchAuthenticationOptions(username: string) {
  return request.post<
    string,
    AxiosResponse<Service.SuccessfulResponse<Service.AuthenticateEntryOptions>>
  >('/api/v1/authentication/options', { username });
}

export async function postAuthSignature(
  name: string,
  data: PublicKeyCredentialAssert
) {
  return request.post('/api/v1/authentication', { username: name, data });
}
