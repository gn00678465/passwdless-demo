import { request } from './request';

export async function postAuthOptions(data: any) {
  return request.post('/api/v1/authentication/options', data);
}

export async function postAuthSignature(data: any) {
  return request.post('/api/v1/authentication/signature', data);
}
