import { PageQueryParam, PageResult } from './base';
/**
 * 检测项目设置查询
 */
export interface basicItemQueryParams extends PageQueryParam {
  inputType?: string
  itemName?: string
  isEnabled?: number
}
/**
 * 检测项目列表项
 */
export interface basicItem {
  id: string;
  itemCode: string;
  itemName: string;
  inputType: number;

  valueStandardOp: any;
  valueStandard: any;
  unit: any;

  standard: any;
  isEnabled: boolean
}

export interface duplicate {
  itemName: string
}

export interface basicItemInsertQuery {
  createBy: string,
  enableBy: string,
  enableTime: string,
  inputType: number,
  isEnabled: true,
  itemCode: string,
  itemName: string,
  listTinyItems: [
    {
      isQualified: number,
      itemId: number,
      name: string,
      no: number
    }
  ],
  standard: string,
  unit: string,
  valueMax: number,
  valueMin: number,
  valueStandard: string,
  valueStandardOp: string
}

export interface basicItemEnabledQuery {
  id: number,
  isEnabled: number,
  updateBy?: string,
  updateTime?: string
}

export interface basicItemUpdateQuery {
  createBy?: string,
  createTime?: string,
  enabledBy?: string,
  enabledTime?: string,
  id?: number,
  inputType?: number,
  isEnabled?: true,
  itemCode?: string,
  itemName?: string,
  listTinyItems?: [
    {
      id?: number,
      isQualified?: number,
      name?: string,
      no?: number
    }
  ],
  standard?: string,
  unit?: string,
  updateBy?: string,
  updateTime?: string,
  valueMax?: number,
  valueMin?: number,
  valueStandard?: string,
  valueStandardOp?: string
}



/**
 * 检测项目分页项类型
 */
export type basicItemPageResult = PageResult<basicItem[]>;