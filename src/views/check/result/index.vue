<template>
    <div class="scheduleArrears">
        <el-card shadow="never">
            <el-form ref="queryFormRef" :inline="true" :model="queryForm" class="form">
                <el-form-item label="送检人">
                    <el-input placeholder="支持模糊查询" v-model="queryForm.appointmentUser"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input placeholder="支持模糊查询" v-model="queryForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="样品名称">
                    <el-input placeholder="支持模糊查询" v-model="queryForm.sampleName"></el-input>
                </el-form-item>
                <el-form-item label="检测结果">
                    <SelectEnumeration v-model="queryForm.checkResult" en="CHECK_END" />
                </el-form-item>
                <el-form-item label="送检时间">
                    <DatePicker placeholder="选择日期" :start-time="queryForm.beginCheckTime"
                        :end-time="queryForm.endCheckTime" @change="handleDateChange" />
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
                            <h3>检测结果列表</h3>
                        </el-row>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-row justify="end">
                            <el-button type="primary" @click="outExcel">导出数据
                            </el-button>
                        </el-row>
                    </el-col> -->
                </el-row>
            </template>

            <TablePanel :maxHeight="550" :table-columns="tableColumns" :table-data="tableData"
                @selectionChange="selectionChange">
                <!-- 判定限值 -->
                <template #col_valueStandard>
                    <vxe-column title="判定限值" :min-width="100">
                        <template #default="{ row }">
                            <span v-if="row.inputType === 0">
                                {{ row.valueStandardOp + row.valueStandard + row.unit }}</span>
                            <span v-if="row.inputType === 1"> {{ row.valueStandard }}</span>
                        </template>
                    </vxe-column>
                </template>
                <template #col_checkData>
                    <vxe-column title="初检数据" :min-width="100">
                        <template #default="{ row }">
                            <div v-if="row.recheckResult === 2 && row.checkResult === 0" style="color: red">
                                <span v-if="row.inputType === 0">
                                    {{ row.checkData + row.unit }}</span>
                                <span v-if="row.inputType === 1"> {{ row.checkData }}</span>
                            </div>
                            <div v-else>
                                <span v-if="row.inputType === 0">
                                    {{ row.checkData + row.unit }}</span>
                                <span v-if="row.inputType === 1"> {{ row.checkData }}</span>
                            </div>
                        </template>
                    </vxe-column>
                </template>

                <template #col_checkChannel>
                    <vxe-column title="初检通道" :min-width="100">
                        <template #default="{ row }">
                            {{ row.checkChannel }}
                        </template>
                    </vxe-column>
                </template>

                <template #col_checkInhibitionRatio>
                    <vxe-column title="初检抑制率" :min-width="100">
                        <template #default="{ row }">
                            <div v-show="row.checkInhibitionRatio !== null">
                                {{ row.checkInhibitionRatio + '%' }}
                            </div>
                        </template>
                    </vxe-column>
                </template>

                <template #col_recheckData>
                    <vxe-column title="复检数据" :min-width="100">
                        <template #default="{ row }">
                            <div v-show="row.recheckData !== null">
                                <div v-if="row.recheckResult === 0" style="color: red">
                                    <span v-if="row.inputType === 0">{{
                                            row.recheckData + row.unit
                                    }}</span>
                                    <span v-else-if="row.inputType === 1">{{
                                            row.recheckData
                                    }}</span>
                                </div>
                                <div v-else>
                                    <span v-if="row.inputType === 0">{{
                                            row.recheckData + row.unit
                                    }}</span>
                                    <span v-else-if="row.inputType === 1">{{
                                            row.recheckData
                                    }}</span>
                                </div>
                            </div>
                        </template>
                    </vxe-column>
                </template>

                <template #col_recheckChannel>
                    <vxe-column title="复检通道" :min-width="100">
                        <template #default="{ row }">
                            <span v-show="row.recheckData !== null">{{
                                    row.recheckChannel
                            }}</span>
                        </template>
                    </vxe-column>
                </template>

                <template #col_recheckInhibitionRatio>
                    <vxe-column title="复检抑制率" :min-width="100">
                        <template #default="{ row }">
                            <span v-show="row.recheckData !== null">{{
                                    row.recheckInhibitionRatio + '%'
                            }}</span>
                        </template>
                    </vxe-column>
                </template>
                <template #col_checkResult>
                    <vxe-column title="检验结果" :width="150">
                        <template #default="{ row }">
                            <span v-if="row.recheckResult !== 2">
                                <el-tag v-if="row.recheckResult === 0" type="danger">不合格</el-tag>
                                <el-tag v-else type="success">合格</el-tag>
                            </span>
                            <span v-else>
                                <el-tag v-if="row.checkResult === 0" type="danger">不合格</el-tag>
                                <el-tag v-else-if="row.checkResult === 1" type="success">合格</el-tag>
                                <el-tag v-else type="warning">未检测</el-tag>
                            </span>
                        </template>
                    </vxe-column>
                </template>
            </TablePanel>
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
import { OP_TYPE } from '@/utils/enumeration';
// import { excelDownload } from '@/utils/excel'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { toRefs, reactive, onMounted, ref, toRef } from 'vue';
import { PageQueryParam } from '@/types/api/base';
import { checkResultList } from '@/api/service/check';

const queryFormRef = ref(ElForm);

const state = reactive({
    // 分页
    queryParams: {
        current: 1,
        pageSize: 10
    } as PageQueryParam,
    total: 0,
    queryForm: {
        appointmentUser: '',
        mobile: '',
        sampleName: '',
        checkResult: '',
        beginCheckTime: '',
        endCheckTime: ''
    },
    tableData: [] as any,
    tableColumns: [
        { type: 'checkbox', width: 40, fixed: 'left' },
        { field: 'checkItemName', title: '检测项目', minWidth: 100 },
        { slot: 'col_checkResult' },
        { field: 'appointmentTime', title: '送检时间', minWidth: 150 },
        { field: 'appointmentUserName', title: '送检人', minWidth: 130 },
        { field: 'mobile', title: '手机号码', minWidth: 130 },
        { field: 'sampleName', title: '样品名称', minWidth: 100 },
        { slot: 'col_valueStandard' },
        { slot: 'col_checkData' },
        { slot: 'col_checkChannel' },
        { slot: 'col_checkInhibitionRatio' },
        { slot: 'col_recheckData' },
        { slot: 'col_recheckChannel' },
        { slot: 'col_recheckInhibitionRatio' }
    ],
    selectIds: [] as any
})

const { queryParams, queryForm, tableData, tableColumns, selectIds, total } = toRefs(state);

onMounted(() => {
    resetQuery();
});

// 列表查询
function handleQuery() {
    checkResultList({
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

// 重置查询表单
function resetQuery() {
    queryFormRef.value.resetFields();
    // console.log('queryForm.value', queryForm.value)
    handleQuery();
};

function handleDateChange(val: any) {
    if (val !== null) {
        if (val[0]) {
            state.queryForm.beginCheckTime = val[0];
        }
        if (val[1]) {
            state.queryForm.endCheckTime = val[1];
        }
    } else {
        state.queryForm.beginCheckTime = '';
        state.queryForm.endCheckTime = '';
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
            // this.$Api.excel.checkResultExport(this.selectIds)
            //     .then(function (res) {
            //         excelDownload(res, '检测结果数据.xlsx')
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
        ElMessageBox.confirm(`是否确认导出所勾选${state.selectIds.length}条数据项?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // this.$Api.excel.checkResultExport(this.selectIds)
            //     .then(function (res) {
            //         excelDownload(res, '检测结果数据.xlsx')
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
    state.selectIds = records.map((row: any) => row.id)
    //console.log(state.selectIds);
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