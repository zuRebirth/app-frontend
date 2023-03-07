import fetchApi from '@/api';
import {
    checkTaskQueryParams,
    checkTaskDetailParams,
    checkTaskDowloadParams,
    checkResultQueryParams,
    checkRecheckQueryParams,
    checkAnalysisQueryParams
} from '@/types/api/checktask';

export function checkTaskList(queryParams: checkTaskQueryParams) {
    return fetchApi({
        url: '/check-task/query',
        method: 'post',
        data: queryParams
    });
}

export function checkTaskDetail(queryParams: checkTaskDetailParams) {
    return fetchApi({
        url: '/check-task-detail/get',
        method: 'post',
        data: queryParams
    })
}

export function checkTaskDownloadReport(queryParams: checkTaskDetailParams) {
    return fetchApi({
        url: '/check-task/download-report/query',
        method: 'post',
        data: queryParams
    })
}

export function checkTaskDowloadReport(queryParams: checkTaskDowloadParams) {
    return fetchApi({
        url: '/check-task-word-view/CheckTaskWord',
        method: 'post',
        data: queryParams
    })
}

export function checkResultList(queryParams: checkResultQueryParams) {
    return fetchApi({
        url: '/check-task-result/query',
        method: 'post',
        data: queryParams
    })
}

export function checkRecheckList(queryParams: checkRecheckQueryParams) {
    return fetchApi({
        url: '/recheck-task-list/query',
        method: 'post',
        data: queryParams
    })
}

export function checkAnalysisList(queryParams: checkAnalysisQueryParams) {
    return fetchApi({
        url: '/check-task-analysis/listFl',
        method: 'post',
        data: queryParams
    })
}

export function checkAnalysisRegion(queryParams: checkAnalysisQueryParams) {
    return fetchApi({
        url: '/check-task-analysis/getAnRegion',
        method: 'post',
        data: queryParams
    })
}

export function checkAnalysisCurrent(queryParams: checkAnalysisQueryParams) {
    return fetchApi({
        url: '/check-task-analysis/getAnCurrent',
        method: 'post',
        data: queryParams
    })
}

export function checkAnalysisAnStall(queryParams: checkAnalysisQueryParams) {
    return fetchApi({
        url: '/check-task-analysis/getAnStall',
        method: 'post',
        data: queryParams
    })
}

export function checkAnalysisAnSample(queryParams: checkAnalysisQueryParams) {
    return fetchApi({
        url: '/check-task-analysis/getAnSample',
        method: 'post',
        data: queryParams
    })
}