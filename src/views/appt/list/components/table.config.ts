const tableConfig = {
    columns: [
      { type: 'checkbox', width: 40, fixed: 'left' },
      { field: 'appointmentCode', title: '预约编号', minWidth: 150, fixed: 'left' },
      { slot: 'col_checkMethod' },
      { slot: 'col_status' },
      { slot: 'col_chargeStatus' },
      { field: 'appointmentUserName', title: '送检人姓名', minWidth: 100 },
      { field: 'email', title: '邮箱', minWidth: 170 },
      { field: 'mobile', title: '手机号码', minWidth: 150 },
      { field: 'idCard', title: '身份证号', minWidth: 200 },
      { field: 'batchNumber', title: '报备批次', minWidth: 150 },
      { field: 'numberPlate', title: '车牌号码', minWidth: 150 },
      { field: 'originFrom', title: '产地', minWidth: 100 },
      { field: 'driverName', title: '司机姓名', minWidth: 100 },
      { field: 'driverCode', title: '司机号码', minWidth: 150 },
      { field: 'appointmentTime', title: '送检时间', minWidth: 170 },
      { field: 'sendTo', title: '发往地', minWidth: 100 },
      { field: 'checkPrice', title: '单价', minWidth: 100 },
      { field: 'checkAmount', title: '应收金额(元)', minWidth: 130 },
      { field: 'realAmount', title: '已收金额(元)', minWidth: 130 },
      { field: 'outstandingAmount', title: '未收金额（元）', minWidth: 130 },
      { slot: 'col_action' }
    ],
    // 普通送检表格
    goodsColumns1: [
      { field: 'sampleName', title: '货品名称', minWidth: 100, fixed: 'left' },
      { slot: 'col_basicItemName' },
      { slot: 'col_action' }
    ],
    // 海外送检表格
    goodsColumns2: [
      { field: 'sampleName', title: '货品名称', minWidth: 100, fixed: 'left' },
      { slot: 'col_basicItemName' },
      { slot: 'col_weight' },
      { slot: 'col_quantity' },
      { slot: 'col_action' }
    ]
  }
  
  export default tableConfig
  