import { IncomingHttpHeaders } from "http";

interface CustomHeader {
  headers: IncomingHttpHeaders & { origin?: string };
}

export interface TypedRequestBody<T> extends Express.Request, CustomHeader {
  body: T;
}

export interface TypedRequestQuery<T> extends Express.Request, CustomHeader {
  query: T;
}

export interface TypedRequest<T, U> extends Express.Request, CustomHeader {
  body: U;
  query: T;
}
