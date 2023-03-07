// // '费用类型
export const FREE_TYPE = [
  { 
    value: 1, 
    label: '物业费' 
  },
  { value: 2, label: '押金' },
  { value: 3, label: '租金' },
  { value: 4, label: '卫生费' },
  { value: 5, label: '管理费' },
  { value: 6, label: '水费' },
  { value: 7, label: '电费' },
  { value: 8, label: '加建设施费' },
  { value: 9, label: '其他' }
]
// 数据类型
export const DATA_TYPE = [
  { value: '', label: '全部' },
  { value: 0, label: '数值型' },
  { value: 1, label: '选项型' }
]
export const OP_TYPE = [
  { value: 'lt', label: '<' },
  { value: 'le', label: '<=' },
  { value: 'eq', label: '=' },
  { value: 'gt', label: '>' },
  { value: 'ge', label: '>=' }
]
// 检测类型
export const CHECK_TYPE = [
  { value: 1, label: '抽检' },
  { value: 2, label: '送检' }
]

// 检测类型
export const APPOINTMENT_TYPE = [
  { value: '', label: '全部' },
  { value: 0, label: '普通送检' },
  { value: 1, label: '过海送检' }
]

// 是否启用
export const OPEN_TYPE = [
  { value: '', label: '全部' },
  { value: 1, label: '启用' },
  { value: 0, label: '禁用' }
]

// 样品状态 检测任务返回3为已完成，这里显示为已检测
export const SAMPLE_TYPE = [
  { value: '', label: '全部' },
  { value: 0, label: '待送检' },
  { value: 1, label: '检测中' },
  { value: 2, label: '已检测' },
  { value: 3, label: '已生成报告' }
]

// 缴费状态
export const PAY_TYPE = [
  { value: '', label: '全部' },
  { value: 1, label: '已缴费' },
  { value: 0, label: '未缴费' },
  { value: 2, label: '部分缴费' }
]

// 检测状态2
export const CHECK2_TYPE = [
  { value: 1, label: '全部' },
  { value: 2, label: '待检测' },
  { value: 3, label: '已检测' },
  { value: 4, label: '检测中' },
  { value: 5, label: '追加检测' },
  { value: 6, label: '已完成' }
]

// 检测状态3
export const CHECK3_TYPE = [
  { value: '', label: '全部' },
  { value: 0, label: '待检测' },
  { value: 2, label: '检测中' },
  { value: 1, label: '已检测' },
  { value: 3, label: '已完成' }
]

// 检测结果
export const CHECK_END = [
  { value: '', label: '全部' },
  { value: 1, label: '合格' },
  { value: 0, label: '不合格' }
]

// 初检复检数据
export const CHECK_DATA = [
  { value: '阴性', label: '阴性' },
  { value: '阳性', label: '阳性' }
]
export const CHARGE_TYPE = [
  { value: '现金', label: '现金' },
  { value: '银行卡', label: '银行卡' },
  { value: '积分', label: '积分' },
  { value: '微信', label: '微信' },
  { value: '支付宝', label: '支付宝' },
  { value: '抵扣', label: '抵扣' },
  { value: '对公转账', label: '对公转账' }
]

export const SHOW_SCREEN = [
  { value: '', label: '全部' },
  { value: 1, label: '是' },
  { value: 0, label: '否' }
]

export const PAY_TYPE1 = [
  { value: 0, label: '缴费' },
  { value: 1, label: '退款' }
]

export default {
  FREE_TYPE,
  DATA_TYPE,
  CHECK_TYPE,
  CHECK2_TYPE,
  CHECK3_TYPE,
  OPEN_TYPE,
  SAMPLE_TYPE,
  PAY_TYPE,
  PAY_TYPE1,
  CHECK_END,
  OP_TYPE,
  APPOINTMENT_TYPE,
  CHECK_DATA,
  CHARGE_TYPE,
  SHOW_SCREEN
}
