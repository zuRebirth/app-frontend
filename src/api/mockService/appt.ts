import { AxiosPromise } from "axios";
import fetchApi from "@/api";
import { apptdetailQueryParams, apptdetailPageResult } from '@/types/api/apptdetail';

/**
 * 获取角色分页数据
 *
 * @param queryParams
 */
export function apptDetailList(
  queryParams?: apptdetailQueryParams
): AxiosPromise<apptdetailPageResult> {
  return fetchApi({
    url: '/check-appointment-payment/list',
    method: 'post',
    params: queryParams
  });
}
