import { request } from './request';

export async function postRegister(data: any) {
  return request.post('/api/register', data);
}
