import { AxiosPromise } from "axios";
import fetchApi from "@/api";
import { sampleListQueryParams, sampleListPageResult } from '@/types/api/sampleList';

/**
 * 获取角色分页数据
 *
 * @param queryParams
 */
export function getSampleList(
  queryParams?: sampleListQueryParams
): AxiosPromise<sampleListPageResult> {
  return fetchApi({
    url: '/check-sample/list',
    method: 'post',
    params: queryParams
  });
}