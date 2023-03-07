import fetchApi from '@/api';
import {
    checkAppintmentList,
    checkAppintmentDetail,
    checkAppintmentPayBack
} from '@/types/api/checkappointment';

export function checkAppintmentList(queryParams: checkAppintmentList) {
    return fetchApi({
        url: '/check-appointment/list',
        method: 'post',
        data: queryParams
    });
}

export function checkAppintmentTotal(queryParams: checkAppintmentList) {
    return fetchApi({
        url: '/check-appointment/queryTotal',
        method: 'post',
        data: queryParams
    });
}

export function checkAppintmentDelete(queryParams: any) {
    return fetchApi({
        url: '/check-appointment/removeList',
        method: 'post',
        data: queryParams
    });
}

export function checkAppintmentDetailList(queryParams: checkAppintmentDetail) {
    return fetchApi({
        url: '/check-appointment-detail/query',
        method: 'post',
        data: queryParams
    });
}

export function checkAppintmentDetail(queryParams: any) {
    return fetchApi({
        url: '/check-appointment/getById/'+ queryParams,
        method: 'get',
        // data: queryParams
    });
}

export function checkAppintmentDetailDelete(queryParams: checkAppintmentDetail) {
    return fetchApi({
        url: '/check-appointment-detail/remove',
        method: 'post',
        data: queryParams
    });
}

export function PayBack(queryParams: checkAppintmentPayBack) {
    return fetchApi({
        url: '/check-appointment-payment/back',
        method: 'post',
        data: queryParams
    });
}

export function appintmentConfirm(queryParams: any) {
    return fetchApi({
        url: '/check-appointment/confirm',
        method: 'post',
        data: queryParams
    });
}