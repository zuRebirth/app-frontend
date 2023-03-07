import { AxiosPromise } from 'axios';
import fetchApi from '@/api';
import {
  basicItemQueryParams,
  basicItemPageResult,
  duplicate,
  basicItemInsertQuery,
  basicItemEnabledQuery,
  basicItemUpdateQuery
} from '@/types/api/basicItem';
import {
  basicPriceQueryParams,
  basicPriceInsertQuery,
  basicPriceEditQuery,
  basicPriceHistoryQuery,
  basicPriceEnbledQuery
} from '@/types/api/basicprice';
/**
 * 获取角色分页数据
 *
 * @param queryParams
 */
export function basicItemList(queryParams: basicItemQueryParams) {
  return fetchApi({
    url: '/basic-item/list',
    method: 'post',
    data: queryParams
  });
}

export function basicPriceList(queryParams: basicPriceQueryParams){
  return fetchApi({
    url: '/basic-check-price/query',
    method: 'post',
    data: queryParams
  });
}

export function basicPriceInsert(queryParams: basicPriceInsertQuery) {
  return fetchApi({
    url: '/basic-check-price/insertOne',
    method: 'post',
    data: queryParams
  });
}

export function basicPriceDelete(queryParams: any) {
  return fetchApi({
    url: '/basic-check-price/deleteList',
    method: 'post',
    data: queryParams
  });
}

export function basicPriceEdit(queryParams: basicPriceEditQuery) {
  return fetchApi({
    url: '/basic-check-price/update',
    method: 'post',
    data: queryParams
  });
}

export function basicPriceHistory(queryParams: basicPriceHistoryQuery) {
  return fetchApi({
    url: '/basic-check-price-history/history',
    method: 'post',
    data: queryParams
  });
}

export function basicPriceEnbled(queryParams: basicPriceEnbledQuery) {
  return fetchApi({
    url: '/basic-check-price/enabled',
    method: 'post',
    data: queryParams
  });
}

export function getBasicItemInfo(queryParams: any) {
  return fetchApi({
    url: '/basic-item/edit/' + queryParams,
    method: 'post',
    // data: queryParams
  });
}

export function duplicateBasicItem(queryParams: duplicate) {
  return fetchApi({
    url: '/basic-item/duplicate',
    method: 'post',
    data: queryParams
  });
}

export function basicItemInsert(queryParams: basicItemInsertQuery) {
  return fetchApi({
    url: '/basic-item/insert',
    method: 'post',
    data: queryParams
  });
}

export function basicItemDelete(queryParams: any) {
  return fetchApi({
    url: '/basic-item/batchdelete',
    method: 'post',
    data: queryParams
  });
}

export function basicItemEnabled(queryParams: basicItemEnabledQuery) {
  return fetchApi({
    url: '/basic-item/enabled',
    method: 'post',
    data: queryParams
  });
}

export function basicItemUpdate(queryParams: basicItemUpdateQuery) {
  return fetchApi({
    url: '/basic-item/update',
    method: 'post',
    data: queryParams
  });
}