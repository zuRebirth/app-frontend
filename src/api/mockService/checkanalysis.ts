import { AxiosPromise } from "axios";
import fetchApi from "@/api";
import {
    checkTaskQueryParams,
    analysisListPageResult,
    analysisRegionPageResult,
    analysisCurrentPageResult,
    analysisStallPageResult,
    analysisSamplePageResult
} from '@/types/api/checkanalysis';

// 检测分析查询
export function analysisList(
    queryParams?: checkTaskQueryParams
): AxiosPromise<analysisListPageResult> {
    return fetchApi({
        url: '/check-task-analysis/listFl',
        method: 'post',
        params: queryParams
    });
}

// 区域分析
export function analysisRegion(
    queryParams?: checkTaskQueryParams
): AxiosPromise<analysisRegionPageResult> {
    return fetchApi({
        url: '/check-task-analysis/getAnRegion',
        method: 'post',
        params: queryParams
    });
}


// 周边分析
export function analysisCurrent(
    queryParams?: checkTaskQueryParams
): AxiosPromise<analysisCurrentPageResult> {
    return fetchApi({
        url: '/check-task-analysis/getAnCurrent',
        method: 'post',
        params: queryParams
    });
}

// 档口分析
export function analysisStall(
    queryParams?: checkTaskQueryParams
): AxiosPromise<analysisStallPageResult> {
    return fetchApi({
        url: '/check-task-analysis/getAnStall',
        method: 'post',
        params: queryParams
    });
}

// 货品分析

export function analysisSample(
    queryParams?: checkTaskQueryParams
): AxiosPromise<analysisSamplePageResult> {
    return fetchApi({
        url: '/check-task-analysis/getAnSample',
        method: 'post',
        params: queryParams
    });
}