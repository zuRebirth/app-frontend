<template>
    <div class="scheduleArrears">
        <el-card shadow="never">
            <el-form ref="queryFormRef" :inline="true" :model="queryForm" class="form">
                <el-form-item label="送检人" prop="appointmentUserName">
                    <el-input placeholder="支持模糊查询" v-model="queryForm.appointmentUserName"></el-input>
                </el-form-item>
                <el-form-item label="送检时间">
                    <DatePicker placeholder="选择日期" :start-time="queryForm.appointmentTimeStart"
                        :end-time="queryForm.appointmentTimeEnd" @change="handleAppointmentTime" />
                </el-form-item>
                <el-form-item label="缴费时间">
                    <DatePicker placeholder="选择日期" :start-time="queryForm.payTimeStart" :end-time="queryForm.payTimeEnd"
                        @change="handlePayTime" />
                </el-form-item>
                <el-form-item label="支付类型">
                    <SelectEnumeration v-model="queryForm.payType" en="PAY_TYPE1" :clearable="true" placeholder="请选择" />
                </el-form-item>
                <el-form-item label="缴费方式">
                    <SelectEnumeration v-model="queryForm.chargeWay" en="CHARGE_TYPE" :clearable="true"
                        placeholder="请选择" />
                </el-form-item>
                <el-form-item class="right">
                    <el-button type="primary" @click="handleQuery">查询
                    </el-button>
                    <el-button @click="resetQuery()">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card shadow="never">
            <template #header class="clearfix">
                <el-row align="middle">
                    <el-col :span="12">
                        <el-row justify="start">
                            <h3>预约送检支付明细列表</h3>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row justify="end">
                            <el-button type="warning" @click="outExcel">导出</el-button>
                            <el-button type="primary" @click="printEvent1">打印</el-button>
                        </el-row>
                    </el-col>
                </el-row>
            </template>

            <TablePanel :maxHeight="550" ref="xTable" :table-columns="tableColumns" :table-data="tableData"
                @selectionChange="selectionChange">
                <template #col_payType>
                    <vxe-column title="支付类型" :width="150" field="payType">
                        <template #default="{ row }">
                            <span v-if="row.payType === 0">缴费</span>
                            <span style="color: red" v-else>退款</span>
                        </template>
                    </vxe-column>
                </template>
                <template #col_payment>
                    <vxe-column title="缴费金额(元)" :width="150" field="amount">
                        <template #default="{ row }">
                            <span v-if="row.payType === 0">{{ row.amount }}</span>
                            <span style="color: red" v-else>{{ '-' + row.amount }}</span>
                        </template>
                    </vxe-column>
                </template>
                <template #col_action>
                    <vxe-column title="操作" :width="150" fixed="right">
                        <template #default="{ row }">
                            <el-tooltip effect="dark" content="打印" placement="top">
                                <vxe-button icon="vxe-icon--print" type="text" size="small"
                                    @click="printSelectEvent1(row)" />
                            </el-tooltip>
                        </template>
                    </vxe-column>
                </template>
            </TablePanel>
            <el-card>
                <el-row>
                    <div class="total">合计</div>
                    <div class="total1">
                        <strong>缴费金额：</strong><span style="color: red">{{ chargeTotal }}元</span>
                    </div>
                </el-row>
            </el-card>
            <el-row align="middle">
                <el-col :span="12">
                    <el-row justify="start">
                        <pagination v-if="total > 0" :total="total" v-model:page="queryParams.current"
                            v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import Pagination from '@/components/Pagination/index.vue';
import TablePanel from '@/components/TablePanel/index.vue';
import DatePicker from '@/components/DatePicker/index.vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue';
import VXETable from 'vxe-table';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { toRefs, reactive, onMounted, ref, toRef } from 'vue';
import { PageQueryParam } from '@/types/api/base';
import { apptDetailList } from '@/api/mockService/appt';

const queryFormRef = ref(ElForm);

const state = reactive({
    chargeTotal: '',
    // 分页
    queryParams: {
        current: 1,
        pageSize: 10
    } as PageQueryParam,
    total: 0,
    queryForm: {
        appointmentTimeEnd: '',
        appointmentTimeStart: '',
        payTimeStart: '',
        payTimeEnd: '',
        appointmentUserName: '',
        payType: '',
        chargeWay: ''
    },
    tableData: [] as any,
    tableColumns: [
        { type: 'checkbox', width: 40, fixed: 'left' },
        { field: 'appointmentCode', title: '预约编号', minWidth: 150, fixed: 'left' },
        { field: 'appointmentUserName', title: '送检人', minWidth: 150 },
        { field: 'appointmentTime', title: '送检时间', minWidth: 200 },
        { field: 'checkPriceDesc', title: '单价', minWidth: 100 },
        { slot: 'col_payType' },
        { field: 'chargeChannel', title: '支付通道', minWidth: 100 },
        { field: 'chargeWay', title: '缴费方式', minWidth: 100 },
        { slot: 'col_payment' },
        { field: 'payTime', title: '缴费时间', minWidth: 200 },
        { slot: 'col_action' }
    ],
    selectIds: [] as any
})

const { chargeTotal, queryParams, total, queryForm, tableData, selectIds, tableColumns } = toRefs(state);

onMounted(() => {
    resetQuery();
});

// 重置查询表单
function resetQuery() {
    queryFormRef.value.resetFields();
    // console.log('queryForm.value', queryForm.value)
    handleQuery();
};

// 列表查询
function handleQuery() {
    apptDetailList({
        ...state.queryParams,
        ...state.queryForm
    }).then(({ data }) => {
        // console.log('basic');
        console.log(data);
        state.queryParams.current = data.page;
        state.queryParams.pageSize = data.limit;
        state.total = data.total;
        state.tableData = data.data || [];
    });
};

// 全部打印
function printEvent1() {
    const rowData: any[] = [];
    if (state.selectIds.length === 0) {
        state.tableData.forEach((item: any) => {
            rowData.push(item)
        })
    } else {
        state.selectIds.forEach((selectItem: any) => {
            state.tableData.forEach((item: any) => {
                if (selectItem === item.id) {
                    rowData.push(item)
                }
            })
        })
    }
    // 打印样式
    const printStyle = `
      *{
        margin: 0;
        padding: 0;
      }
.title{
    padding: 10px 15px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
  }
  .title1 {
    padding: 15px;
  }
  .ans {
    padding: 10px;
  }
  .title2 {
    padding: 10px;
  }
  .footer > span {
    padding: 20px;
  }
              `
    const printTmpl = `
      ${rowData.map((row, i) => {
        return `
    <div style="width: 100%; height: 347px; display: flex; justify-content: center; align-items:center;">
      <table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
      <tr>
        <td colspan="7" class="title">
          <div>海口菜篮子江楠农业批发市场缴费数据</div>
          <div style="display: flex; justify-content: space-between;">
            <span>样品编号:${row.appointmentCode}</span>
            <span>送检人:${row.appointmentUserName}</span>
            <span>缴费时间:${row.payTime}</span>  
          </div>
        </td>
      </tr>
      <tr style="width: 80%;">
        <td class="title1">单价</td>
        <td class="title1">支付类型</td>
        <td class="title1">支付通道</td>
        <td class="title1">缴费方式</td>
        <td class="title1">缴费金额</td>
        <td class="title1">样品数</td>
        <td rowspan="4" style="width: 30px; font-size: 16px; margin: 6px;">①存根白②客户红③会计黄</td>
      </tr>
      <tr>
        <td class="ans">${row.checkPriceDesc}</td>
        <td class="ans">${row.payType === 0 ? '缴费' : '退款'}</td>
        <td class="ans">${row.chargeChannel}</td>
        <td class="ans">${row.chargeWay}</td>
        <td class="ans">${row.payType === 0 ? row.amount : -row.amount}</td>
        <td class="ans">${row.goodsNum}</td>
      </tr>
      <tr>
        <td class="title2">大写人名币（元）</td>
        <td colspan="5" >${row.payType === 0 ? smalltoBIG(row.amount) : smalltoBIG(-row.amount)}</td>
      </tr>
      <tr>
        <td colspan="6">
          <div class="footer" style="display: flex; justify-content: space-between;">
            <span>开票人:操作人</span>
            <span>收款人:操作人</span>
            <span>单位盖章:</span> 
            <span>客户签名:&emsp;&emsp;&emsp;&emsp;</span>
          </div>
        </td>
      </tr>
    </table>
    </div>
`
    }).join('')} `
    VXETable.print({
        style: printStyle,
        content: printTmpl
    })
};
// 选择当前行
function printSelectEvent1(row: any) {
    // 打印样式
    const printStyle = `
      *{
        margin: 0;
        padding: 0;
      }
.title{
    padding: 10px 15px;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
  }
  .title1 {
    padding: 15px;
  }
  .ans {
    padding: 10px;
  }
  .title2 {
    padding: 10px;
  }
  .footer > span {
    padding: 20px;
  }
              `
    const printTmpl = `
      <div style="width: 100%; height: 347px; display: flex; justify-content: center; align-items:center;">
<table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
    <tr>
      <td colspan="7" class="title">
        <div>海口菜篮子江楠农业批发市场缴费数据</div>
        <div style="display: flex; justify-content: space-between;">
          <span>样品编号:${row.appointmentCode}</span>
          <span>送检人:${row.appointmentUserName}</span>
          <span>缴费时间:${row.payTime}</span>  
        </div>
      </td>
    </tr>
    <tr style="width: 80%;">
      <td class="title1">单价</td>
      <td class="title1">支付类型</td>
      <td class="title1">支付通道</td>
      <td class="title1">缴费方式</td>
      <td class="title1">缴费金额</td>
      <td class="title1">样品数</td>
      <td rowspan="4" style="width: 30px; font-size: 16px; margin: 6px;">①存根白②客户红③会计黄</td>
    </tr>
    <tr>
      <td class="ans">${row.checkPriceDesc}</td>
      <td class="ans">${row.payType === 0 ? '缴费' : '退款'}</td>
      <td class="ans">${row.chargeChannel}</td>
      <td class="ans">${row.chargeWay}</td>
      <td class="ans">${row.payType === 0 ? row.amount : -row.amount}</td>
      <td class="ans">${row.goodsNum}</td>
    </tr>
    <tr>
      <td class="title2">大写人名币（元）</td>
      <td colspan="5" >${row.payType === 0 ? smalltoBIG(row.amount) : smalltoBIG(-row.amount)}</td>
    </tr>
    <tr>
      <td colspan="6">
        <div class="footer" style="display: flex; justify-content: space-between;">
          <span>开票人:</span>
          <span>收款人:</span>
          <span>单位盖章:</span> 
          <span>客户签名:&emsp;&emsp;&emsp;&emsp;</span>
        </div>
      </td>
    </tr>
  </table>
  </div>
`
    VXETable.print({
        style: printStyle,
        content: printTmpl
    })
};


// 查询缴费金额
function queryTotal() {
    // this.$Api.checkAppointmentPayment
    //     .queryAmountTotal({
    //         current: this.listQuery.page,
    //         pageSize: this.listQuery.limit,
    //         ...this.queryForm
    //     })
    //     .then((res) => {
    //         this.chargeTotal = res.data || []
    //     })
    //     .catch(() => { })
};

function handleAppointmentTime(val: any) {
    if (val !== null) {
        if (val[0]) {
            state.queryForm.appointmentTimeStart = val[0];
        }
        if (val[1]) {
            state.queryForm.appointmentTimeEnd = val[1];
        }
    } else {
        state.queryForm.appointmentTimeStart = '';
        state.queryForm.appointmentTimeEnd = '';
    }
};

function handlePayTime(val: any) {
    if (val !== null) {
        if (val[0]) {
            state.queryForm.payTimeStart = val[0];
        }
        if (val[1]) {
            state.queryForm.payTimeEnd = val[1];
        }
    } else {
        state.queryForm.payTimeStart = '';
        state.queryForm.payTimeEnd = '';
    }
};

async function outExcel() {
    if (state.selectIds.length === 0) {
        state.tableData.forEach((item: any) => {
            state.selectIds.push(item.id);
        })
        await ElMessageBox.confirm(`是否确认导出当前查询结果所有数据?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // this.$Api.excel.checkAppointmentPaymentExport(this.selectIds)
            //     .then(function (res) {
            //         excelDownload(res, '预约送检支付明细数据.xlsx')
            //     })
        })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '已取消导出'
                })
            })
        state.selectIds = [];
    } else {
        await ElMessageBox.confirm(`是否确认导出所勾选${state.selectIds.length}条数据项?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // this.$Api.excel.checkAppointmentPaymentExport(this.selectIds)
            //     .then(function (res) {
            //         excelDownload(res, '预约送检支付明细数据.xlsx')
            //     })
        })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '已取消导出'
                })
            })
    }
};

// checkbox 选中事件 返回选中的id
function selectionChange(records: any) {
    state.selectIds = records.map((row: any) => row.id);
    console.log(state.selectIds);
};

// 数字金额大写转换(可以处理整数,小数,负数)
function smalltoBIG(n: any) {
    var fraction = ['角', '分']
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
    var head = n < 0 ? '欠' : ''
    n = Math.abs(n)

    var s = ''

    for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)

    for (let i = 0; i < unit[0].length && n > 0; i++) {
        var p = ''
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p
            n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
}


</script>

<style scoped>
.el-card {
    margin-bottom: 20px;
}

.el-form {
    margin-top: 20px;
}

.right {
    float: right;
    right: 0;
}

.total {
    margin-left: 5%;
    color: red;
}

.total1 {
    margin-left: 32%;
}
</style>