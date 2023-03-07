import { PageQueryParam, PageResult } from './base';

export interface checkAppintmentList extends PageQueryParam {
    appointmentCode?: string,
    appointmentTimeEnd?: string,
    appointmentTimeStart?: string,
    appointmentUserName?: string,
    batchNumber?: string,
    chargeStatus?: string,
    checkMode?: string,
    createBy?: string,
    gid?: string,
    mobile?: string,
    numberPlate?: string,
    requestNo?: string,
    sampleName?: string,
    stallId?: string,
    status?: string
}

export interface checkAppintmentDetail extends PageQueryParam {
    id?: number,
    requestNo?: string
}

export interface checkAppintmentPayBack extends PageQueryParam {
    amount?: number,
    chargeChannel?: string,
    chargeWay?: string,
    checkAppointmentId?: number,
    createBy?: string,
    createTime?: string,
    payTime?: string,
    payType?: number
    remark?: string,
    requestNo?: string,
    updateBy?: string,
    updateTime?: string
}