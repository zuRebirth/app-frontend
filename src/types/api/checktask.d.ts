import { PageQueryParam, PageResult } from './base';
/**
 * 检测项目设置查询
 */
export interface checkTaskQueryParams extends PageQueryParam {
  appointmentCode?: string,
  appointmentUsers?: string,
  beginAppointmentTimes?: string,
  beginCreateTime?: string,
  createBy?: string,
  endAppointmentTimes?: string,
  endCreateTime?: string,
  requestNo?: string,
  status?: string
}

export interface checkTaskDetailParams extends PageQueryParam {
  appointmentTime?: string,
  id?: number,
  requestNo?: string,
  status?: string,
  appointmentTimes?: string
}

export interface checkTaskDowloadParams extends PageQueryParam {
  appointmentTime?: any,
  appointmentUserName?: any,
  id?: any,
  mobile?: any,
  requestNo?: any
}


export interface checkResultQueryParams extends PageQueryParam {
  appointmentUser?: string,
  beginCheckTime?: string,
  checkResult?: string,
  endCheckTime?: string,
  mobile?: string,
  requestNo?: string,
  sampleName?: string
}

export interface checkRecheckQueryParams extends PageQueryParam {
  appointmentUserName?: string,
  beginCheckTime?: string,
  checkBy?: string,
  endCheckTime?: string,
  requestNo?: string,
  sampleName?: string
}

export interface checkAnalysisQueryParams extends PageQueryParam {
  createTime?: string,
  endTime?: string,
  requestNo?: string
}