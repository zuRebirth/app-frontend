import { PageQueryParam, PageResult } from './base';
/**
 * 检测项目设置查询
 */
export interface apptdetailQueryParams extends PageQueryParam {
    inputType?: string
    itemName?: string
    isEnabled?: number
}
/**
 * 检测项目列表项
 */
export interface apptdetail {
    amount: number,
    appointmentCode: string,
    appointmentTime: string,
    appointmentUserName: string,
    chargeChannel: string,
    chargeWay: string,
    checkAppointmentId: number,
    checkPrice: string,
    checkPriceDesc: string,
    goodsNum: number,
    id: string,
    payTime: string,
    payType: number
}
/**
 * 检测项目分页项类型
 */
export type apptdetailPageResult = PageResult<apptdetail[]>;