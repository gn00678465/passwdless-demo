/** express request type utility */
export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface TypedRequestQuery<T> extends Express.Request {
  query: T;
}

export interface TypedRequest<T, U> extends Express.Request {
  body: U;
  query: T;
}
