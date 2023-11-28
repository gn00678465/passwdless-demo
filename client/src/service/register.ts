import { AxiosResponse } from 'axios';

import { request } from './request';
import { PublicKeyCredentialAttestation } from '../webAuthnClient';

export async function fetchRegisterOptions(username: string) {
  return request.post<
    string,
    AxiosResponse<Service.SuccessfulResponse<Service.RegisterEntryOptions>>
  >('/api/v1/register/options', { username: username });
}

export async function postRegister(
  name: string,
  data: PublicKeyCredentialAttestation
) {
  return request.post('/api/v1/register', {
    username: name,
    data
  });
}
