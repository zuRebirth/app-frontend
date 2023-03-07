import { PageQueryParam, PageResult } from './base';
/**
 * 检测项目设置查询
 */
export interface sampleListQueryParams extends PageQueryParam {
  batchNumber?: string,
  checkResult?: string,
  current?: number,
  numberPlate?: string,
  pageSize?: number,
  receiveBy?: string,
  receiveTimeEnd?: string,
  receiveTimeStart?: string,
  region?: string,
  requestNo?: string,
  sampleCode?: string,
  sampleName?: string,
  showScreen?: number,
  stall?: string,
  status?: number
}
/**
 * 检测项目列表项
 */
export interface sampleList {
  basicItemId: number,
  basicItemName: string,
  basicItemType: number,
  batchNumber: string,
  checkChannel: string,
  checkData: string,
  checkInhibitionRatio: number,
  checkResult: number,
  createTime: string,
  id: number,
  numberPlate: string,
  quantityIn: number,
  quantitySample: number,
  receiveBy: string,
  receiveTime: string,
  recheckChannel: string,
  recheckData: string,
  recheckInhibitionRatio: number,
  recheckResult: number,
  region: string,
  remarks: string,
  restockTime: string,
  sampleCode: string,
  sampleName: string,
  showScreen: boolean,
  stall: string,
  status: number,
  unit: string,
  valueStandard: string,
  valueStandardOp: string,
  wasteMethod: string,
  asteWeight: number
}


export interface addSampleQueryParams {
  basicItemId: number,
  basicItemName: string,
  basicItemType: number,
  batchNumber: string,
  batchNumberId: string,
  createBy: string,
  numberPlate: string,
  quantityIn: number,
  quantitySample: number,
  receiveBy: string,
  receiveTime: string,
  region: string,
  regionId: string,
  restockTime: string,
  sampleCode: string,
  sampleId: string,
  sampleName: string,
  stall: string,
  stallId: string,
  status: number,
  unit: string,
  updateBy: string,
  valueStandard: string,
  valueStandardOp: string
}

export interface updateSampleQueryParams {
  basicItemId: number,
  basicItemName: string,
  batchNumber: string,
  batchNumberId: string,
  checkBy: string,
  checkChannel: string,
  checkData: string,
  checkInhibitionRatio: number,
  checkTime: string,
  id: number,
  numberPlate: string,
  quantityIn: number,
  quantitySample: number,
  recheckBy: string,
  recheckChannel: string,
  recheckData: string,
  recheckInhibitionRatio: number,
  recheckTime: string,
  region: string,
  regionId: string,
  remarks: string,
  restockTime: string,
  sampleId: string,
  sampleName: string,
  stall: string,
  stallId: string,
  updateBy: string,
  updateTime: string,
  wasteMethod: string,
  wasteWeight: number
}

export interface reCheckSampleQueryParams {
  id: number,
  recheckBy: string,
  recheckChannel: string,
  recheckData: string,
  recheckInhibitionRatio: string,
  recheckTime: string,
  requestNo: string
}