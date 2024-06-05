import { PaginationRequest } from "./common.dto";

export type TagSearchRequets = PaginationRequest & {
  searchText?: string;
  page?: number;
  amount?: number;
};
