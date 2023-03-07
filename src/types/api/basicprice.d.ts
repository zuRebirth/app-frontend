import { PageQueryParam, PageResult } from './base';
/**
 * 检测项目设置查询
 */
export interface basicPriceQueryParams extends PageQueryParam {
    isEnabled?: number
    enbledBy?: string,
    startTime?: string,
    endTime?: string
}

export interface basicPriceInsertQuery {
    batchNumber?: string,
    checkMethod?: string,
    createBy?: string,
    createTime?: string,
    enbledBy?: string,
    enbledTime?: string,
    isEnabled?: number,
    unitPrice?: string
}

export interface basicPriceEditQuery {
    batchNumber?: string,
    checkMethod?: string,
    enbledBy?: string,
    enbledTime?: string,
    id?: string,
    isEnabled?: number,
    requestNo?: string,
    unitPrice?: string,
    updateBy?: string,
    updateTime?: string
}

export interface basicPriceHistoryQuery {
    id?: string,
    requestNo?: string,
    current?: number;
    pageSize?: number;
}

export interface basicPriceEnbledQuery {
    id: string,
    isEnabled: number,
}