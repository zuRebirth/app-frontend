import { AxiosPromise } from "axios";
import fetchApi from "@/api";
import {
  checkTaskQueryParams,
  checkTaskPageResult,
  checkRecheckPageResult,
  checkResultPageResult
} from '@/types/api/checktask';


/**
 * 获取角色分页数据
 *
 * @param queryParams
 */
export function checkTaskList(
  queryParams?: checkTaskQueryParams
): AxiosPromise<checkTaskPageResult> {
  return fetchApi({
    url: '/check-task/query',
    method: 'post',
    params: queryParams
  });
}

export function checkRecheckList(
  queryParams?: checkTaskQueryParams
): AxiosPromise<checkRecheckPageResult> {
  return fetchApi({
    url: '/recheck-task-list/query',
    method: 'post',
    params: queryParams
  });
}

export function checkResultList(
  queryParams?: checkTaskQueryParams
): AxiosPromise<checkResultPageResult> {
  return fetchApi({
    url: '/check-task-result/query',
    method: 'post',
    params: queryParams
  });
}