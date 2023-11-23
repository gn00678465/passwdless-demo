import { request } from './request';

export async function postAuthOptions(data: any) {
  return request.post('/api/authentication/options', data);
}
