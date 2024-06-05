// A request with a JSON body
export interface JSONBodyRequest<T> extends Express.Request {
  body: T;
  params: any;
}

// A request with query parameters
export interface QueryRequest<Q> extends Express.Request {
  query: Q;
}

// A request with URL parameters
export interface ParamsRequest<P> extends Express.Request {
  params: P;
}
