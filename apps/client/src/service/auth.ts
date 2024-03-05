import { AxiosResponse } from "axios";
import { request } from "./request";

import type { ServiceResponse } from "../typings";

export async function authLogout() {
  return request.post<string, AxiosResponse<ServiceResponse<undefined>>>("/api/v1/auth/logout");
}
