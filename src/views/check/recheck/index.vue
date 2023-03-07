<template>
    <div class="scheduleArrears">
        <el-card shadow="never">
            <el-form ref="queryFormRef" :inline="true" :model="queryForm" class="form">
                <el-form-item label="送检人">
                    <el-input placeholder="支持模糊查询" v-model="queryForm.appointmentUserName"></el-input>
                </el-form-item>
                <el-form-item label="样品名称">
                    <el-input placeholder="支持模糊查询" v-model="queryForm.sampleName"></el-input>
                </el-form-item>
                <el-form-item label="检测员">
                    <el-input placeholder="支持模糊查询" v-model="queryForm.checkBy"></el-input>
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
                            <h3>待复检检测项目列表</h3>
                        </el-row>
                    </el-col>
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
                            <span v-if="row.inputType === 0">{{
                                    row.checkData + row.unit
                            }}</span>
                            <span v-if="row.inputType === 1">{{ row.checkData }}</span>
                        </template>
                    </vxe-column>
                </template>
                <template #col_checkInhibitionRatio>
                    <vxe-column title="初检抑制率" :min-width="100">
                        <template #default="{ row }">
                            <span>{{ row.checkInhibitionRatio + '%' }}</span>
                        </template>
                    </vxe-column>
                </template>
                <!-- 复检 -->
                <template #col_recheckData>
                    <vxe-column title="复检数据" :min-width="100">
                        <!-- <template #default="{ row }">
                            <span v-if="!curListStatus[row.id].editRecheckStatus">{{
                                    row.recheckData
                            }}</span>
                            <vxe-input v-else-if="row.inputType === 0" class="recheckData" v-model="row.recheckData"
                                placeholder="单行输入" type="float" min="0.01" step="1.0">
                            </vxe-input>
                            <SelectEnumeration v-else-if="row.inputType === 1" @blur="reselblur" class="recheckData"
                                placeholder="请选择" v-model="row.recheckData" en="CHECK_DATA" />
                        </template> -->
                    </vxe-column>
                </template>
                <template #col_recheckChannel>
                    <vxe-column title="复检通道" :min-width="100">
                        <!-- <template #default="{ row }">
                            <span v-if="!curListStatus[row.id].editRecheckStatus">{{
                                    row.recheckChannel
                            }}</span>
                            <vxe-input v-else class="recheckChannel" v-model="row.recheckChannel" placeholder="单行输入">
                            </vxe-input>
                        </template> -->
                    </vxe-column>
                </template>
                <template #col_recheckInhibitionRatio>
                    <vxe-column title="复检抑制率" :min-width="100">
                        <!-- <template #default="{ row }">
                            <span v-if="!curListStatus[row.id].editRecheckStatus">{{
                                    row.recheckInhibitionRatio
                            }}</span>
                            <vxe-input class="recheckInhibitionRatio" v-else type="float"
                                v-model="row.recheckInhibitionRatio" placeholder="单行输入" min="0.01" max="100" step="1.0">
                            </vxe-input>
                        </template> -->
                    </vxe-column>
                </template>
                <!-- 检测结果 -->
                <template #col_checkResult>
                    <vxe-column title="检测结果" :min-width="100">
                        <template #default="{ row }">
                            <el-tag v-if="row.checkResult === 0" type="danger">不合格</el-tag>
                            <el-tag v-else-if="row.checkResult === 1" type="success">合格</el-tag>
                        </template>
                    </vxe-column>
                </template>

                <!-- 操作 -->
                <template #col_action>
                    <vxe-column title="操作" :width="130" fixed="right">
                        <!-- <template #default="{ row }">
                            <div v-if="
                                row.recheckData && !curListStatus[row.id].editRecheckStatus
                            "></div>
                            <el-button v-else-if="!curListStatus[row.id].editRecheckStatus" type="text"
                                @click="editSecondEntry(row)">复检录入</el-button>
                            <div v-else>
                                <vxe-button size="mini" status="primary" type="text" content="保存"
                                    @click="confirm(row)" />
                                <vxe-button type="text" size="mini" style="color: #909399" content="取消"
                                    @click="cancel(row)" />
                            </div>
                        </template> -->
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
import { OP_TYPE } from '@/utils/enumeration';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { toRefs, reactive, onMounted, ref, toRef, getCurrentInstance } from 'vue';
import useStore from '@/store';
import { PageQueryParam } from '@/types/api/base';
import { checkRecheckList } from '@/api/service/check';

const { proxy }: any = getCurrentInstance();
const queryFormRef = ref(ElForm);
const { dialogManager } = useStore();

let dialog: any = ref();

const state = reactive({
    // 当前每列是否在录入状态
    curListStatus: [] as any,
    // 分页
    queryParams: {
        current: 1,
        pageSize: 10
    } as PageQueryParam,
    queryForm: {
        appointmentUserName: '',
        beginCheckTime: '',
        endCheckTime: '',
        checkBy: '',
        sampleName: ''
    },
    total: 0,
    tableData: [] as any,
    tableColumns: [
        { field: 'appointmentUserName', title: '送检人', minWidth: 100 },
        { field: 'sampleName', title: '货品名称', minWidth: 100 },
        { field: 'checkItemName', title: '检测项目', minWidth: 100 },
        { slot: 'col_checkResult' },
        { slot: 'col_valueStandard' },
        { slot: 'col_checkData' },
        { field: 'checkChannel', title: '检测通道', minWidth: 100 },
        { slot: 'col_checkInhibitionRatio' },

        { slot: 'col_recheckData' },
        { slot: 'col_recheckChannel' },
        { slot: 'col_recheckInhibitionRatio' },

        { field: 'checkBy', title: '检验员', minWidth: 100 },
        { field: 'checkTime', title: '检验时间', minWidth: 150 },
        { slot: 'col_action' }
    ]
});

const { curListStatus, queryParams, queryForm, tableData, tableColumns, total } = toRefs(state);

onMounted(() => {
    resetQuery();
});


function resetQuery() {
    queryFormRef.value.resetFields();
    // console.log('queryForm.value', queryForm.value)
    handleQuery();
};

// 复检录入的状态
function editSecondEntry(row: any) {
    state.curListStatus[row.id].editRecheckStatus = true;
    // this.$nextTick(() => { document.getElementsByClassName('vxe-input--inner')[0].focus() })
};

// 日期转换
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
    console.log(val)
};

function confirm(row: any) {
    if ((!row.recheckData || !row.recheckChannel || !row.recheckInhibitionRatio) && row.checkResult !== 2) {
        if (!row.recheckData) {
            document.querySelector('.recheckData')?.classList.add('red');
        }
        if (!row.recheckChannel) {
            document.querySelector('.recheckChannel')?.classList.add('red');
        }
        if (!row.recheckInhibitionRatio) {
            document.querySelector('.recheckInhibitionRatio')?.classList.add('red');
        }
        ElMessage({
            message: '复检数据未完全录入',
            type: 'error'
        })
        return;
    }
    // 当前是复检,点击确定按钮
    state.curListStatus[row.id].editRecheckStatus = false;
    // console.log(row)
    if (row.inputType === 1) {
        row.recheckResult = row.recheckData === row.valueStandard ? 1 : 0;
    } else {
        if (row.valueStandardOp === '<') {
            row.recheckResult = parseFloat(row.recheckData) < parseFloat(row.valueStandard) ? 1 : 0;
        } else if (row.valueStandardOp === '<=') {
            row.recheckResult = parseFloat(row.recheckData) <= parseFloat(row.valueStandard) ? 1 : 0;
        } else if (row.valueStandardOp === '>') {
            row.recheckResult = parseFloat(row.recheckData) > parseFloat(row.valueStandard) ? 1 : 0;
        } else if (row.valueStandardOp === '>=') {
            row.recheckResult = parseFloat(row.recheckData) >= parseFloat(row.valueStandard) ? 1 : 0;
        } else {
            row.recheckResult = parseFloat(row.recheckData) === parseFloat(row.valueStandard) ? 1 : 0;
        }
    }
    // try {
    //     // this.$Api 调用接口传入row给后端
    //     this.$Api.checkManagement.recheckUpdate({
    //         id: row.id,
    //         recheckChannel: row.recheckChannel,
    //         recheckData: row.recheckData,
    //         recheckInhibitionRatio: row.recheckInhibitionRatio,
    //         recheckResult: row.recheckResult
    //     }).then(() => {
    //         this.$message.success('录入复检数据成功')
    //         this.getList()
    //     })
    //         .catch(() => { })
    // } catch (error) {
    //     this.$message.error(`${error}不能为空`)
    //     this.getList()
    // }
};

function cancel(row: any) {
    // 获取当前列的id值
    const id = row.id;
    // 当前是复检,点击取消按钮
    state.curListStatus[id].editRecheckStatus = false;
    row.recheckData = null;
    row.recheckChannel = null;
    row.recheckInhibitionRatio = null;
};

// 列表查询
function handleQuery() {
    checkRecheckList({
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

function reselblur() {
    document.querySelector('.recheckData')?.classList.remove('red');
};


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

.red {
    border: 1px solid #f56c6c;
    border-radius: 5px;
}
</style>