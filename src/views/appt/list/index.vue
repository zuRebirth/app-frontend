<template>
    <div class="scheduleArrears">
        <el-card shadow="never">
            <el-form ref="queryFormRef" :inline="true" :model="queryForm" class="form">
                <el-form-item label="样品名称">
                    <el-input v-model="queryForm.sampleName" placeholder="支持模糊查询" />
                </el-form-item>

                <el-form-item label="样品状态">
                    <SelectEnumeration clearable v-model="queryForm.status" en="SAMPLE_TYPE" />
                </el-form-item>

                <el-form-item label="缴费状态">
                    <SelectEnumeration clearable v-model="queryForm.chargeStatus" en="PAY_TYPE" />
                </el-form-item>

                <el-form-item label="送检方式">
                    <SelectEnumeration clearable v-model="queryForm.checkMode" en="APPOINTMENT_TYPE" />
                </el-form-item>

                <el-form-item label="预约编号">
                    <el-input v-model="queryForm.appointmentCode" placeholder="支持模糊查询" />
                </el-form-item>

                <el-form-item label="预约时间">
                    <DatePicker :start-time="queryForm.appointmentTimeStart" :end-time="queryForm.appointmentTimeEnd"
                        @change="handleDateChange" />
                </el-form-item>

                <el-form-item label="批次号">
                    <el-input v-model="queryForm.batchNumber" placeholder="支持模糊查询" />
                </el-form-item>
                <el-form-item label="送检人">
                    <el-input v-model="queryForm.appointmentUserName" placeholder="支持模糊查询" />
                </el-form-item>

                <el-form-item label="手机号码">
                    <el-input v-model="queryForm.mobile" placeholder="支持模糊查询" />
                </el-form-item>

                <el-form-item label="车牌号码">
                    <el-input v-model="queryForm.numberPlate" placeholder="支持模糊查询" />
                </el-form-item>
                <el-form-item class="right">
                    <el-button type="primary" @click="handleQuery()">查询</el-button>
                    <el-button @click="resetQuery()">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card shadow="never">
            <template #header class="clearfix">
                <el-row align="middle">
                    <el-col :span="12">
                        <el-row justify="start">
                            <h3>预约送检列表</h3>
                        </el-row>
                    </el-col>
                    <el-col :span="11">
                        <el-row justify="end">
                            <el-button type="primary" @click="newDialog">新增
                            </el-button>
                            <el-button @click="batchDelete" type="danger">删除</el-button>
                            <!-- <el-button type="warning" @click="outExcel">导出</el-button> -->
                            <el-button type="success" @click="confirmAppointment">确认预约</el-button>
                        </el-row>
                    </el-col>
                    <el-col :span="1">
                        <vxe-toolbar ref="xToolbar1" custom></vxe-toolbar>
                    </el-col>
                </el-row>
            </template>

            <TablePanel :maxHeight="550" ref="table" :table-columns="tableColumns" :table-data="tableData"
                @selectionChange="selectionChange">
                <template #col_checkMethod>
                    <vxe-column title="送检方式" :min-width="100" fixed="left" field="checkMode">
                        <template #default="{ row }">
                            {{ row.checkMode === 0 ? '普通送检' : '过海送检' }}
                        </template>
                    </vxe-column>
                </template>
                <template #col_status>
                    <vxe-column title="样品状态" :min-width="100" field="status">
                        <template #default="{ row }">
                            <el-tag v-if="row.status === '待送检'" type="danger">
                                {{ row.status }}
                            </el-tag>
                            <el-tag v-else-if="row.status === '检测中'">
                                {{ row.status }}
                            </el-tag>
                            <el-tag v-else-if="row.status === '已检测'" type="warning">
                                {{ row.status }}
                            </el-tag>
                            <el-tag v-else-if="row.status === '已生成报告'" type="success">
                                {{ row.status }}
                            </el-tag>
                        </template>
                    </vxe-column>
                </template>
                <!-- <template #col_chargeStatus>
                    <vxe-column title="缴费状态" :min-width="100" field="chargeStatus">
                        <template #default="{ row }">
                            <el-tag v-if="row.chargeStatus === '未缴费'" type="danger">{{
                                    row.chargeStatus
                            }}</el-tag>
                            <el-tag v-else-if="row.chargeStatus === '部分缴费'">{{
                                    row.chargeStatus
                            }}</el-tag>
                            <el-tag v-else-if="row.chargeStatus === '已缴费'" type="success">{{ row.chargeStatus }}
                            </el-tag>
                        </template>
                    </vxe-column>
                </template> -->
                <template #col_action>
                    <vxe-column title="操作" :minWidth="280" fixed="right" field="action">
                        <template #default="{ row }">
                            <!-- <el-tooltip effect="dark" content="退款" placement="top">
                                <svg-icon class="icon" icon-class="iconmonstr-currency-4" @click="refundDialog(row)">
                                </svg-icon>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="收费" placement="top">
                                <svg-icon class="icon " icon-class="iconmonstr-currency-3"
                                    @click="collectionDialog(row)" :disabled="row.chargeStatus === '已缴费'"></svg-icon>
                            </el-tooltip> -->
                            <el-tooltip effect="dark" content="查看明细" placement="top">
                                <svg-icon class="icon" icon-class="view" @click="viewDialog(row)" />
                            </el-tooltip>
                            <el-tooltip effect="dark" content="编辑" placement="top">
                                <svg-icon class="icon" icon-class="edit" @click="editDialog(row)"
                                    :disabled="row.status !== '待送检'" />
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <svg-icon class="icon" icon-class="delete" @click="handleDel(row)"
                                    :disabled="row.status !== '待送检' || row.chargeStatus !== '未缴费'" />
                            </el-tooltip>
                            <el-tooltip effect="dark" content="确认预约" placement="top">
                                <svg-icon class="icon" icon-class="iconmonstr-check-mark-7" @click="confirm(row)"
                                    :disabled="row.status !== '待送检'" />
                            </el-tooltip>
                        </template>
                    </vxe-column>
                </template>
            </TablePanel>
            <!-- <el-card>
                <el-row>
                    <el-col :span="3" :offset="1"><span style="color: red">合计</span></el-col>
                    <el-col :span="10">
                        <el-row justify="space-around">
                            <el-col :span="8"><strong>应收金额：</strong><span style="color: red">¥{{
                                    checkAppointmentTotal.checkAmountSum
                            }}</span>
                            </el-col>
                            <el-col :span="8"><strong>已收金额：</strong><span style="color: red">¥{{
                                    checkAppointmentTotal.realAmountSum
                            }}</span>
                            </el-col>
                            <el-col :span="8"><strong>未收金额：</strong><span style="color: red">¥{{
                                    checkAppointmentTotal.outstandingAmountSum
                            }}</span>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-card> -->
            <el-row align="middle">
                <el-col :span="12">
                    <el-row justify="start">
                        <Pagination v-if="total > 0" :total="total" v-model:page="queryParams.current"
                            v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import DatePicker from '@/components/DatePicker/index.vue';
import tableConfig from './components/table.config';
import TablePanel from '@/components/TablePanel/index.vue';
import Pagination from '@/components/Pagination/index.vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { getCurrentInstance, onMounted, reactive, toRefs, ref } from 'vue';
import { ElMessage, ElForm, ElMessageBox } from 'element-plus';
import { Dialog } from '@/components/dialogManager/dialogModel';
import useStore from '@/store';
import { PageQueryParam } from '@/types/api/base';
import {
    checkAppintmentList,
    checkAppintmentTotal,
    checkAppintmentDelete,
    PayBack,
    appintmentConfirm
} from '@/api/service/checkappointment';

const { dialogManager } = useStore();
const queryFormRef = ref(ElForm);
let dialog: any = ref();

const state = reactive({
    backData: [],
    queryParams: {
        current: 1,
        pageSize: 10
    } as PageQueryParam,
    total: 0,
    queryForm: {
        sampleName: '',
        appointmentUserName: '',
        appointmentCode: '',
        status: '',
        chargeStatus: '',
        checkMode: '',
        reservationNumber: '',
        mobile: '',
        numberPlate: '',
        batchNumber: '',
        appointmentTimeStart: '',
        appointmentTimeEnd: ''
    },
    tableData: [],
    tableColumns: tableConfig.columns,
    selectIds: [],
    checkAppointmentTotal: {
        checkAmountSum: 0,
        realAmountSum: 0,
        outstandingAmountSum: 0
    }
})

const {
    backData,
    queryParams,
    queryForm,
    tableData,
    tableColumns,
    selectIds,
    total,
    checkAppointmentTotal
} = toRefs(state);

onMounted(() => {
    resetQuery();
})

// 列表查询
function handleQuery() {
    checkAppintmentList({
        ...state.queryParams,
        ...state.queryForm
    })
        .then(({ data }) => {
            // console.log(data);
            state.tableData = data.data || [];
            state.queryParams.pageSize = data.pageSize;
            state.queryParams.current = data.current;
            state.total = data.total;
        })
    queryTotal()
}

// 查询金额统计数据
function queryTotal() {
    checkAppintmentTotal({
        ...state.queryParams,
        ...state.queryForm
    })
        .then(({ data }) => {
            //console.log(data);
            state.checkAppointmentTotal = data || [];
        })
}

function handleDateChange(val: any) {
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
}

// 重置查询表单
function resetQuery() {
    queryFormRef.value.resetFields();
    // console.log('queryForm.value', queryForm.value)
    handleQuery();
}

// 删除
async function handleDel(row: any) {
    try {
        await ElMessageBox.confirm('确定删除？')
        await checkAppintmentDelete([row.id])
            .then(() => {
                ElMessage.success('删除成功');
                handleQuery();
            })

    } catch (error) {
        console.log(error)
    }
}

// 批量删除
async function batchDelete() {
    if (state.selectIds.length === 0) {
        ElMessage.error('请勾选删除数据项');
        return;
    } else {
        try {
            await state.selectIds.forEach((item) => {
                state.tableData.forEach((ele: any) => {
                    console.log(ele.status);
                    if (ele.id === item && ele.status !== '待送检') {
                        throw ('无法删除已送检项');
                    }
                    if (ele.id === item && ele.chargeStatus !== '未缴费') {
                        throw ('无法删除已缴费项');
                    }
                })
            })
            await ElMessageBox.confirm('确定删除这' + state.selectIds.length + '条记录？');
            await checkAppintmentDelete(state.selectIds)
                .then(() => {
                    ElMessage.success('删除成功');
                    handleQuery();
                })
        } catch (error: any) {
            console.log(error)
            if (error === 'cancel') {
                return
            }
            ElMessage({
                message: error,
                type: 'error'
            })
        }
    }
}

async function outExcel() {
    //   if (this.selectIds.length === 0) {
    //     this.tableData.forEach((item) => {
    //       this.selectIds.push(item.id)
    //     })
    //     await this.$confirm(`是否确认导出当前查询结果所有数据?`, '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.$Api.excel.checkAppointmentExport(this.selectIds)
    //         .then(function (res) {
    //           excelDownload(res, '预约送检-导出数据.xlsx')
    //         })
    //     })
    //       .catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '已取消导出'
    //         })
    //       })
    //     this.selectIds = []
    //   } else {
    //     await this.$confirm(`是否确认导出所勾选${this.selectIds.length}条数据项?`, '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.$Api.excel.checkAppointmentExport(this.selectIds)
    //         .then(function (res) {
    //           excelDownload(res, '预约送检-导出数据.xlsx')
    //         })
    //     })
    //       .catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '已取消导出'
    //         })
    //       })
    //   }
}

// 新增列表
function newDialog() {
    const props = {
        // model 弹窗状态 view：查看，edit：编辑，new：新增
        model: 'new'
    }
    // 定义回调事件
    const events = {
        confirm: (formData: any) => {
            console.log(formData)
            // formData.appointmentTime = dayjs().format('YYYY-MM-DD hh:mm:ss')
            if (formData.detailList.length === 0) {
                ElMessage.error('货品不能为空');
                return;
            }
            // this.$Api.checkAppointment.add(formData).then((res) => {
            //     if (res.code === '0000') {
            //         this.$message({
            //             message: '保存成功',
            //             type: 'success'
            //         })
            //         this.getList()
            //         this.$store.dispatch('dialogManager/closeDialog', this.dialog.key)
            //     }
            // })
        },
        cancel: () => {
            console.log('cancel回调函数')
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '新增',
        width: '60%',
        isShowFooter: false,
        customClass: 'month-report__dialog'
    }
    // 引入弹窗主体组件
    const component = require('./components/newDialog.vue').default
    if (dialog.length) {
        // 若弹窗存在
        // 设置需要改动的传值
        dialog.props = props;
        dialogManager.updateDialog(dialog);
    } else {
        // 新建并添加弹窗
        dialog = new Dialog(component, props, events, meta);
        dialogManager.addDialog(dialog);
    }
    dialogManager.openDialog(dialog.key);
}

// 查看列表
function viewDialog(row: any) {
    const props = {
        // 表单数据 id
        id: row.id,
        appointmentId: row.appointmentId,
        // model 弹窗状态 view: 查看历史, edit: 编辑 viewData: 查看当前数据
        model: 'view'
    }
    // 定义回调事件
    const events = {
        cancel: () => {
            console.log('cancel回调函数')
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '查看',
        width: '60%',
        isShowFooter: false,
        customClass: 'month-report__dialog'
    }
    // 引入弹窗主体组件
    let component
    if (row.checkMode === 0) {
        component = require('./components/viewDialog.vue').default
    } else {
        component = require('./components/statusDialog.vue').default
    }
    if (dialog.length) {
        // 若弹窗存在
        // 设置需要改动的传值
        dialog.props = props;
        dialogManager.updateDialog(dialog);
    } else {
        // 新建并添加弹窗
        dialog = new Dialog(component, props, events, meta);
        dialogManager.addDialog(dialog);
    }
    dialogManager.openDialog(dialog.key);
}

// 编辑列表
function editDialog(row: any) {
    const props = {
        // 表单数据 id
        id: row.id,
        appointmentId: row.appointmentId,
        // model 弹窗状态 view：查看，edit：编辑，new：新增
        model: 'edit'
    }
    // 定义回调事件
    const events = {
        confirm: (formData: any) => {
            console.log('=========================')
            console.log(formData)
            // this.$Api.checkAppointment.update(formData).then((res) => {
            //     if (res.code === '0000') {
            //         this.$message({
            //             message: '更新成功',
            //             type: 'success'
            //         })
            //         this.getList()
            //         this.$store.dispatch('dialogManager/closeDialog', this.dialog.key)
            //     }
            // })
        },
        cancel: () => {
            console.log('cancel回调函数')
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '编辑',
        width: '60%',
        isShowFooter: false,
        customClass: 'month-report__dialog'
    }
    // 引入弹窗主体组件
    const component = require('./components/statusDialog.vue').default
    if (dialog.length) {
        // 若弹窗存在
        // 设置需要改动的传值
        dialog.props = props;
        dialogManager.updateDialog(dialog);
    } else {
        // 新建并添加弹窗
        dialog = new Dialog(component, props, events, meta);
        dialogManager.addDialog(dialog);
    }
    dialogManager.openDialog(dialog.key);
}

// 打开退款对话框
function refundDialog(row: any) {
    if (row.realAmount === 0) {
        ElMessage.error('当前账户余额为0，无法退款');
        return
    }
    const props = {
        // 账户余额：已收金额
        realAmount: row.realAmount,
        stall: row.stall
    }
    // 定义回调事件
    const events = {
        confirm: (formData: any) => {
            console.log(formData)

            PayBack({
                ...formData,
                checkAppointmentId: row.id
            })
                .then(({ data }) => {
                    if (data.code === '0000') {
                        ElMessage({
                            message: '更新成功',
                            type: 'success'
                        })
                        handleQuery();
                        dialogManager.closeDialog(dialog.key);
                    }
                })

            //   this.$Api.checkAppointmentPayment.back({
            //     ...formData,
            //     checkAppointmentId: row.id
            //   }).then((res) => {
            //     if (res.code === '0000') {
            //       this.$message({
            //         message: '更新成功',
            //         type: 'success'
            //       })
            //       this.getList()
            //       this.$store.dispatch('dialogManager/closeDialog', this.dialog.key)
            //     }
            //   })
            //     .catch(() => { })
        },
        cancel: () => {
            console.log('cancel回调函数')
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '资金退款',
        width: '35%',
        isShowFooter: false,
        customClass: 'month-report__dialog'
    }
    // 引入弹窗主体组件
    const component = require('./components/refundDialog.vue').default
    if (dialog.length) {
        // 若弹窗存在
        // 设置需要改动的传值
        dialog.props = props;
        dialogManager.updateDialog(dialog);
    } else {
        // 新建并添加弹窗
        dialog = new Dialog(component, props, events, meta);
        dialogManager.addDialog(dialog);
    }
    dialogManager.openDialog(dialog.key);
}

function printSelectEvent1(row: any) {
    //       // 打印样式
    //       const printStyle = `
    //       *{
    //         margin: 0;
    //         padding: 0;
    //       }
    // .title{
    //     padding: 10px 15px;
    //     text-align: center;
    //     line-height: 30px;
    //     font-size: 14px;
    //   }
    //   .title1 {
    //     padding: 15px;
    //   }
    //   .ans {
    //     padding: 10px;
    //   }
    //   .title2 {
    //     padding: 10px;
    //   }
    //   .footer > span {
    //     padding: 20px;
    //   }
    //               `
    //       const printTmpl = `
    //       <div style="width: 100%; height: 347px; display: flex; justify-content: center; align-items:center;">
    // <table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
    //     <tr>
    //       <td colspan="7" class="title">
    //         <div>海口菜篮子江楠农业批发市场缴费数据</div>
    //         <div style="display: flex; justify-content: space-between;">
    //           <span>样品编号:${row.appointmentCode}</span>
    //           <span>送检人:${row.appointmentUserName}</span>
    //           <span>缴费时间:${row.payTime}</span>  
    //         </div>
    //       </td>
    //     </tr>
    //     <tr style="width: 80%;">
    //       <td class="title1">单价</td>
    //       <td class="title1">支付类型</td>
    //       <td class="title1">支付通道</td>
    //       <td class="title1">缴费方式</td>
    //       <td class="title1">缴费金额</td>
    //       <td class="title1">样品数</td>
    //       <td rowspan="4" style="width: 30px; font-size: 16px; margin: 6px;">①存根白②客户红③会计黄</td>
    //     </tr>
    //     <tr>
    //       <td class="ans">${row.checkPriceDesc}</td>
    //       <td class="ans">${row.payType === 0 ? '缴费' : '退款'}</td>
    //       <td class="ans">${row.chargeChannel}</td>
    //       <td class="ans">${row.chargeWay}</td>
    //       <td class="ans">${row.payType === 0 ? row.amount : -row.amount}</td>
    //       <td class="ans">${row.goodsNum}</td>
    //     </tr>
    //     <tr>
    //       <td class="title2">大写人名币（元）</td>
    //       <td colspan="5" >${row.payType === 0 ? this.smalltoBIG(row.amount) : this.smalltoBIG(-row.amount)}</td>
    //     </tr>
    //     <tr>
    //       <td colspan="6">
    //         <div class="footer" style="display: flex; justify-content: space-between;">
    //           <span>开票人:</span>
    //           <span>收款人:</span>
    //           <span>单位盖章:</span> 
    //           <span>客户签名:&emsp;&emsp;&emsp;&emsp;</span>
    //         </div>
    //       </td>
    //     </tr>
    //   </table>
    //   </div>
    // `
    //       VXETable.print({
    //         style: printStyle,
    //         content: printTmpl
    //       })
    //     },
    //     collectionSuccess(row) {
    //       console.log(row)
    //       const props = {
    //       }
    //       // 定义回调事件
    //       const events = {
    //         confirm: () => {
    //           console.log(row)
    //           this.printSelectEvent1(row)
    //         },
    //         cancel: () => {
    //           console.log('cancel回调函数')
    //           this.$store.dispatch('dialogManager/closeDialog', this.dialog.key)
    //         }
    //       }
    //       // 定义弹窗配置
    //       const meta = {
    //         title: '缴费提示',
    //         width: '30%',
    //         isShowFooter: false,
    //         customClass: 'month-report__dialog'
    //       }
    //       // 引入弹窗主体组件
    //       const component = require('./components/collectionSuccess.vue').default
    //       console.log(this.dialog)
    //       // 新建并添加弹窗
    //       this.dialog = new Dialog(component, props, events, meta)
    //       this.$store.dispatch('dialogManager/addDialog', this.dialog)
    //       this.$store.dispatch('dialogManager/openDialog', this.dialog.key)
}

function collectionSuccess(row: any) {
    console.log(row)
    const props = {
    }
    // 定义回调事件
    const events = {
        confirm: () => {
            console.log(row)
            printSelectEvent1(row);
        },
        cancel: () => {
            console.log('cancel回调函数')
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '缴费提示',
        width: '30%',
        isShowFooter: false,
        customClass: 'month-report__dialog'
    }
    // 引入弹窗主体组件
    const component = require('./components/collectionSuccess.vue').default
    //console.log(dialog)
    // 新建并添加弹窗
    if (dialog.length) {
        // 若弹窗存在
        // 设置需要改动的传值
        dialog.props = props;
        dialogManager.updateDialog(dialog);
    } else {
        // 新建并添加弹窗
        dialog = new Dialog(component, props, events, meta);
        dialogManager.addDialog(dialog);
    }
}

// 收费对话框
function collectionDialog(row: any) {
    const props = {
        // 表单数据
        checkAmount: row.checkAmount,
        realAmount: row.realAmount
    }
    // 定义回调事件
    const events = {
        confirm: (formData: any) => {
            console.log(formData)
            //   this.$Api.checkAppointmentPayment.charge({
            //     ...formData,
            //     checkAppointmentId: row.id
            //   }).then((res) => {
            //     if (res.code === '0000') {
            //       this.getList()
            //       this.$store.dispatch('dialogManager/closeDialog', this.dialog.key)
            //       this.collectionSuccess(res.data)
            //     }
            //   })
            //     .catch(() => { })
        },
        cancel: () => {
            console.log('cancel回调函数')
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '收费确定【' + row.region + row.stall + '】',
        width: '35%',
        isShowFooter: false,
        customClass: 'month-report__dialog'
    }
    // 引入弹窗主体组件
    const component = require('./components/collectionDialog.vue').default
    // 新建并添加弹窗
    if (dialog.length) {
        // 若弹窗存在
        // 设置需要改动的传值
        dialog.props = props;
        dialogManager.updateDialog(dialog);
    } else {
        // 新建并添加弹窗
        dialog = new Dialog(component, props, events, meta);
        dialogManager.addDialog(dialog);
    }
}
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

// 批量确认预约
async function confirmAppointment() {
    if (state.selectIds.length === 0) {
        ElMessage.error('请勾选确认预约数据项');
        return;
    }
    let isConfirm = true
    state.selectIds.forEach((item) => {
        console.log(item)
        state.tableData.forEach((ele: any) => {
            console.log(ele.status, ele.chargeStatus)
            if (ele.id === item && ele.status !== '待送检') {
                ElMessage.error('当前选中列表中有已送检项');
                isConfirm = false
                return
            }
        })
    })
    if (!isConfirm) {
        return
    }
    await ElMessageBox.confirm('是否将这' + state.selectIds.length + '条记录添加至检测任务？');
    await appintmentConfirm(state.selectIds).then(() => {
        ElMessage.success('确认成功');
        handleQuery();
    })
}

// 确认预约
async function confirm(row: any) {
      try {
        await appintmentConfirm([row.id]).then(() => {
          ElMessage.success('确认成功');
          handleQuery();
        })
      } catch (error) {
        console.log(error)
      }
}

// checkbox 选中事件 返回选中的id
function selectionChange(records: any) {
    state.selectIds = records.map((row: any) => row.id)
    console.log(state.selectIds)
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

.vxe-button {
    margin-left: 0;
}

.iconHover i {
    cursor: pointer;
}

.iconHover i:hover {
    color: #409eff;
}

.icon {
    cursor: pointer;
    margin: 0 7px;
    border: none;
    font-size: 25px;
}
</style>