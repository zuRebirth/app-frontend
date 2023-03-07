import fetchApi from '@/api';

import {
    sampleListQueryParams,
    addSampleQueryParams,
    updateSampleQueryParams,
    reCheckSampleQueryParams
} from '@/types/api/sampleList';

export function sampleListQuery(queryParams: sampleListQueryParams) {
    return fetchApi({
        url: '/check-sample/list',
        method: 'post',
        data: queryParams
    });
}

export function sampleTotalQuery(queryParams: sampleListQueryParams) {
    return fetchApi({
        url: '/check-sample/queryTotal',
        method: 'post',
        data: queryParams
    });
}


export function addSample(queryParams: any) {
    return fetchApi({
        url: '/check-sample/add',
        method: 'post',
        data: queryParams
    })
}

export function batchDeleteSample(queryParams: any) {
    return fetchApi({
        url: '/check-sample/removeList',
        method: 'post',
        data: queryParams
    })
}

export function updateSample(queryParams: updateSampleQueryParams) {
    return fetchApi({
        url: '/check-sample/update',
        method: 'post',
        data: queryParams
    })
}

export function reCheckSample(queryParams: reCheckSampleQueryParams) {
    return fetchApi({
        url: '/check-sample/recheck',
        method: 'post',
        data: queryParams
    })
}