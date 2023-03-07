<template>
    <div class="scheduleArrears">
        <el-card shadow="never">
            <el-form ref="queryFormRef" :inline="true" :model="queryForm" class="form">
                <el-form-item label="状态">
                    <SelectEnumeration v-model="queryForm.status" en="CHECK_TYPE" />
                </el-form-item>
                <el-form-item label="送检人">
                    <el-input placeholder="支持模糊查询" v-model="queryForm.appointmentUsers"></el-input>
                </el-form-item>
                <el-form-item label="送检时间">
                    <DatePicker placeholder="选择日期" :start-time="queryForm.beginAppointmentTimes"
                        :end-time="queryForm.endAppointmentTimes" @change="handleDateChange" />
                </el-form-item>
                <el-form-item label="创建人">
                    <el-input placeholder="支持模糊查询" v-model="queryForm.createBy"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <DatePicker placeholder="选择日期" :start-time="queryForm.beginCreateTime"
                        :end-time="queryForm.endCreateTime" @change="handleCreateDateChange" />
                </el-form-item>
                <el-form-item label="预约编号">
                    <el-input placeholder="支持模糊查询" v-model="queryForm.appointmentCode">
                    </el-input>
                </el-form-item>
                <el-form-item class="right">
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="resetQuery()">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card shadow="never">
            <template #header class="clearfix">
                <el-row align="middle">
                    <el-col :span="12">
                        <el-row justify="start">
                            <h3>检测任务列表</h3>
                        </el-row>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-row justify="end">
                            <el-button type="primary" @click="outExcel">生成检验报告
                            </el-button>
                        </el-row>
                    </el-col> -->
                </el-row>
            </template>

            <TablePanel :maxHeight="550" :table-columns="tableColumns" :table-data="tableData"
                @selectionChange="selectionChange" :checkboxConfig="{
                    checkMethod: ({ row }) => {
                        return row.status === 1
                    },
                }">
                <template #col_reportStatus>
                    <vxe-column title="报告状态" :width="150">
                        <template #default="{ row }">
                            <el-tag v-if="row.status === 3" type="success">已生成</el-tag>
                            <el-tag v-else type="danger">未生成</el-tag>
                        </template>
                    </vxe-column>
                </template>
                <template #col_status>
                    <vxe-column title="状态" :width="150" fixed="right">
                        <template #default="{ row }">
                            <el-tag v-if="row.status === 0" type="danger">待检测</el-tag>
                            <el-tag v-else-if="row.status === 1" type="warning">已检测</el-tag>
                            <el-tag v-else-if="row.status === 2">检测中</el-tag>
                            <el-tag v-else-if="row.status === 3" type="success">已完成</el-tag>
                        </template>
                    </vxe-column>
                </template>
                <!-- <template #col_action>
                    <vxe-column title="操作" :width="180" fixed="right">
                        <template #default="{ row }">
                            <div v-if="row.status === 3">
                                <vxe-button size="mini" status="primary" type="text" content="下载报告"
                                    @click="downloadDialog(row)">
                                </vxe-button>
                                <vxe-button size="mini" status="primary" type="text" content="预览报告"
                                    @click="viewDialog(row)">
                                </vxe-button>
                            </div>
                            <vxe-button size="mini" status="primary" v-else type="text" content="查看明细"
                                @click="checkDetailDialog(row)"></vxe-button>
                        </template>
                    </vxe-column>
                </template> -->
            </TablePanel>
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
import Pagination from '@/components/Pagination/index.vue';
import TablePanel from '@/components/TablePanel/index.vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue';
import DatePicker from '@/components/DatePicker/index.vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { toRefs, reactive, onMounted, ref, toRef } from 'vue';
import { Dialog } from '@/components/dialogManager/dialogModel';
import _ from 'lodash';
import useStore from '@/store';
import { checkTaskList } from '@/api/service/check';
import { PageQueryParam } from '@/types/api/base';

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const { dialogManager } = useStore();

let dialog: any = ref();

const state = reactive({
    // 分页
    queryParams: {
        current: 1,
        pageSize: 10
    } as PageQueryParam,
    queryForm: {
        status: '',
        appointmentUsers: '',
        beginAppointmentTimes: '',
        endAppointmentTimes: '',
        beginCreateTime: '',
        endCreateTime: '',
        createBy: '',
        appointmentCode: ''
    },
    // 检测任务明细数据
    checkDetailData: [] as any,
    tableData: [] as any,
    total: 0 as any,
    tableColumns: [
        { type: 'checkbox', width: 40, fixed: 'left' },
        { field: 'taskCode', title: '任务批号', minWidth: 150, fixed: 'left' },
        { field: 'appointmentCode', title: '预约编号', minWidth: 150 },
        { slot: 'col_reportStatus' },
        { slot: 'col_status' },
        { field: 'appointmentUsers', title: '送检人', minWidth: 150 },
        { field: 'appointmentTimes', title: '送检时间', width: 150 },
        { field: 'createBy', title: '创建人', minWidth: 150 },
        { field: 'createTime', title: '创建时间', minWidth: 150 },
        { slot: 'col_action' }
    ],
    selectIds: [] as any
});

const { total, queryParams, queryForm, checkDetailData, tableData, tableColumns, selectIds } = toRefs(state);

onMounted(() => {
    resetQuery();
});

// 列表查询
function handleQuery() {
    checkTaskList({
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

function handleDateChange(val: any) {
    if (val !== null) {
        if (val[0]) {
            state.queryForm.beginAppointmentTimes = val[0];
        }
        if (val[1]) {
            state.queryForm.endAppointmentTimes = val[1];
        }
    } else {
        state.queryForm.beginAppointmentTimes = '';
        state.queryForm.endAppointmentTimes = '';
    }
};

function handleCreateDateChange(val: any) {
    if (val !== null) {
        if (val[0]) {
            state.queryForm.beginCreateTime = val[0];
        }
        if (val[1]) {
            state.queryForm.endCreateTime = val[1];
        }
    } else {
        state.queryForm.beginCreateTime = '';
        state.queryForm.endCreateTime = '';
    }
};

// 重置查询表单
function resetQuery() {
    queryFormRef.value.resetFields();
    // console.log('queryForm.value', queryForm.value)
    handleQuery();
};

async function handleDel(row: any) {
    try {
        await ElMessageBox.confirm('确定删除？');
        // await this.$Api.contract.delContractType({
        //     contractTypeId: row.contractTypeId
        // })
        ElMessage.success('删除成功');
    } catch (error) {
        console.log(error);
    }
};

async function outExcel() {
    if (state.selectIds.length === 0) {
        ElMessage.error('未选中检测报告');
        return;
    }
    // await this.$Api.checkManagement.resultReport(this.selectIds)
    //     .then((res) => {
    //         console.log(res)
    //         this.$message.success('生成检验报告成功!')
    //         this.getList()
    //     }).catch(() => {

    //     })
};

//查看明细
async function checkDetailDialog(row: any) {
    const props = {
        headData: row
    }
    // 定义回调事件
    const events = {
        cancel: () => {
            console.log('cancel回调函数');
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '检测任务明细页面',
        width: '80%',
        isShowFooter: false,
        customClass: 'month-report__dialog',
        showClose: false
    }
    // 引入弹窗主体组件
    const component = require('./components/checkDetailDialog.vue').default;
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
    dialogManager.openDialog(dialog.key);
};

function downloadDialog(row: any) {
    const props = {
        // 表单数据
        id: row.id,
        model: 'download'
    }
    // 定义回调事件
    const events = {
        cancel: () => {
            console.log('cancel回调函数');
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '检测报告下载对话框',
        width: '60%',
        isShowFooter: false,
        customClass: 'month-report__dialog'
    }
    // 引入弹窗主体组件
    const component = require('./components/statusDialog.vue').default;
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
};

function viewDialog(row: any) {
    const props = {
        id: row.id,
        // download 代表下载弹框   view 代表预览弹框
        model: 'view'
    }
    // 定义回调事件
    const events = {
        cancel: () => {
            console.log('cancel回调函数');
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '检测报告预览对话框',
        width: '60%',
        isShowFooter: false,
        customClass: 'month-report__dialog'
    }
    // 引入弹窗主体组件
    const component = require('./components/statusDialog.vue').default;
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
};
// checkbox 选中事件 返回选中的id
function selectionChange(records: any) {
    state.selectIds = records.map((row: any) => row.id);
    console.log(state.selectIds);
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
</style>
