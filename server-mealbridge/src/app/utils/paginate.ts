import { Request } from "express";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (req: Request): PaginationParams => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getPaginationMeta = (params: {
  page: number;
  limit: number;
  total: number;
}) => ({
  page: params.page,
  limit: params.limit,
  total: params.total,
  totalPage: Math.ceil(params.total / params.limit),
});
