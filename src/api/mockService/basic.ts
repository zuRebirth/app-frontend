import { AxiosPromise } from "axios";
import fetchApi from "@/api";
import { basicItemQueryParams, basicItemPageResult } from '@/types/api/basicItem';
import { basicPriceQueryParams, basicPricePageResult } from '@/types/api/basicprice';

/**
 * 获取角色分页数据
 *
 * @param queryParams
 */
export function basicItemList(
  queryParams?: basicItemQueryParams
): AxiosPromise<basicItemPageResult> {
  return fetchApi({
    url: '/api/basic-item/list',
    method: 'post',
    params: queryParams
  });
}

export function basicPriceList(
  queryParams?: basicPriceQueryParams
): AxiosPromise<basicPricePageResult> {
  return fetchApi({
    url: '/api/basic-check-price/query',
    method: 'post',
    params: queryParams
  });
}