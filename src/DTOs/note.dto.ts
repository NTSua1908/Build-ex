import { OrderType } from "../config/enum.config";
import { PaginationRequest } from "./common.dto";

export type CreateUpdateNote = {
  title: string;
  content: string;
  tags: string[];
};

export type NoteDetail = CreateUpdateNote & {
  id: string;
  createdDate: Date;
  updatedDate?: Date;
  isDeleted?: boolean;
  shareable: boolean;
};

export type NoteGetAllRequest = PaginationRequest & {
  title?: string;
  createdDateFrom?: Date;
  createdDateTo?: Date;
  content?: string;
  tags?: string[];
  orderType?: OrderType;
};

export type NoteList = {
  id: string;
  title: string;
  tags: string[];
  createdDate: Date;
  isDeleted?: boolean;
};
