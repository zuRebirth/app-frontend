import { PageQueryParam, PageResult } from './base';

export interface failedListQueryParams extends PageQueryParam {
    batchNumber?: string,
    checkResult?: number,
    numberPlate?: string,
    receiveBy?: string,
    receiveTimeEnd?: string,
    receiveTimeStart?: string,
    region?: string,
    requestNo?: string,
    sampleCode?: string,
    sampleName?: string,
    showScreen?: number,
    stall?: string,
    totle?: number
}

export interface reCheckQueryParams extends PageQueryParam {
    appointmentUserName?: string,
    beginCheckTime?: string,
    checkBy?: string,
    endCheckTime?: string,
    requestNo?: string,
    sampleName?: string
}

export interface reCheckUpdateQueryParams {
    id?: string,
    recheckBy?: string,
    recheckChannel?: string,
    recheckData?: string,
    recheckInhibitionRatio?: string,
    recheckResult?: string,
    recheckTime?: string,
    requestNo?: string,
    updateBy?: string,
    updateTime?: string
}

export interface failSampleUpdateQueryParams {
    basicItemId?: string,
    basicItemName?: string,
    batchNumber?: string,
    batchNumberId?: string,
    checkBy?: string,
    checkChannel?: string,
    checkData?: string,
    checkInhibitionRatio?: string,
    checkTime?: string,
    id?: string,
    numberPlate?: string,
    quantityIn?: string,
    quantitySample?: string,
    recheckBy?: string,
    recheckChannel?: string,
    recheckData?: string,
    recheckInhibitionRatio?: string,
    recheckTime?: string,
    region?: string,
    regionId?: string
    remarks?: string,
    restockTime?: string,
    sampleId?: string,
    sampleName?: string,
    stall?: string,
    stallId?: string,
    updateBy?: string,
    updateTime?: string,
    wasteMethod?: string,
    wasteWeight?: string
}
