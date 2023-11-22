import { request } from './request';

export async function fetchChallenge() {
  return request.get('/api/challenge');
}
