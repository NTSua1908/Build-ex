export type PaginationRequest = {
  page?: number;
  amount?: number;
};

export type PaginationResponse<T> = {
  page: number;
  totalCount: number;
  data: T[];
};
