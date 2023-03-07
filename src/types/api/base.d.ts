export interface PageQueryParam {
  current: number;
  pageSize: number;
}

export interface PageResult<T> extends PageQueryParam{
  [x: string]: number;
  total: number;
  data: T;
}
