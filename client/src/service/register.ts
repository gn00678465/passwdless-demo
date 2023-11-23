import { request } from './request';

export async function fetchRegisterOptions(username: string) {
  return request.post('/api/v1/register/options', { username: username });
}

export async function postRegister(data: any) {
  return request.post('/api/v1/register', data);
}
