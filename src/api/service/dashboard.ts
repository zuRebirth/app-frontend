import fetchApi from '@/api';
import {
    failedListQueryParams,
    reCheckQueryParams,
    reCheckUpdateQueryParams,
    failSampleUpdateQueryParams
} from '@/types/api/dashboard';

export function getSample() {
    return fetchApi({
        url: '/work-bench/sample',
        method: 'post'
    })
}

export function getTask() {
    return fetchApi({
        url: '/work-bench/task',
        method: 'post'
    })
}

export function getFailedList(queryParams: failedListQueryParams) {
    return fetchApi({
        url: '/check-sample/failed-list',
        method: 'post',
        data: queryParams
    })
}

export function getreCheckList(queryParams: reCheckQueryParams) {
    return fetchApi({
        url: '/recheck-task-list/query',
        method: 'post',
        data: queryParams
    })
}

export function reCheckUpdate(queryParams: reCheckUpdateQueryParams) {
    return fetchApi({
        url: '/recheck-task-list/update',
        method: 'post',
        data: queryParams
    })
}

export function getItemValues(queryParams: any) {
    return fetchApi({
        url: '/basic-item/getValueList',
        method: 'post',
        data: queryParams
    })
}

export function failSampleUpdate(queryParams: failSampleUpdateQueryParams) {
    return fetchApi({
        url: '/check-sample/update',
        method: 'post',
        data: queryParams
    })
}
