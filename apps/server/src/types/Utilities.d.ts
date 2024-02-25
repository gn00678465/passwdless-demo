declare namespace Utilities {
  interface TypedRequest<T extends Query, U> extends Express.Request {
    body: U;
    query: T;
  }
}
