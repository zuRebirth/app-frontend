import { PageQueryParam, PageResult } from './base';

export interface checkTaskQueryParams extends PageQueryParam {
    inputType?: string
    itemName?: string
    isEnabled?: number
}

export interface analysisList {
    basicItemName: string,
    checkCount: number,
    checkFailCount: number,
    checkPassCount: number,
    current: number,
    pageSize: number,
    region: string,
    requestNo: string,
    sampleName: string,
    stall: string
}

export interface analysisRegion {
    checkCount: string,
    checkFailCount: string,
    checkPassCount: string,
    region: string,
}

export interface analysisCurrent {
    checkCount: string,
    checkFailCount: string,
    checkPassCount: string,
    time: string
}

export interface analysisStall {
    checkCount: string,
    checkFailCount: string,
    checkPassCount: string,
    stall: string
}

export interface analysisSample {
    checkCount: string,
    checkFailCount: string,
    checkPassCount: string,
    sampleName: string
}



export type analysisListPageResult = PageResult<analysisList[]>;
export type analysisRegionPageResult = PageResult<analysisRegion[]>;
export type analysisCurrentPageResult = PageResult<analysisCurrent[]>;
export type analysisStallPageResult = PageResult<analysisStall[]>;
export type analysisSamplePageResult = PageResult<analysisSample[]>;