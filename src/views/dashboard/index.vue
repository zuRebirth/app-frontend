<template>
    <div class="scheduleArrears">
        <el-card shadow="never">
            <el-row class="box">
                <el-col :span="12">
                    <div style="display: flex">
                        <div class="before"></div>
                        <h2>今日抽检汇总</h2>
                    </div>
                    <el-row type="flex" justify="center">
                        <el-col :span="6">
                            <div class="circle" style="background-color: #409eff">
                                <span class="fontstyle">{{ sampleData.checkCount }}</span>
                            </div>
                            <span class="num">抽检数量</span>
                        </el-col>
                        <el-col :span="6">
                            <div class="circle" style="background-color: #67c23a">
                                <span class="fontstyle">{{ sampleData.checkPassCount }}</span>
                            </div>
                            <span class="num">合格数量</span>
                        </el-col>
                        <el-col :span="6">
                            <div class="circle" style="background-color: #f56c6c">
                                <span class="fontstyle">{{ sampleData.checkFailCount }}</span>
                            </div>
                            <span class="num1">不合格数量</span>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12">
                    <div style="display: flex">
                        <div class="before"></div>
                        <h2>今日送检汇总</h2>
                    </div>
                    <el-row type="flex" justify="center" class="row">
                        <el-col :span="6">
                            <div class="circle" style="background-color: #409eff">
                                <span class="fontstyle">{{ taskData.checkCount }}</span>
                            </div>
                            <span class="num">送检数量</span>
                        </el-col>
                        <el-col :span="6">
                            <div class="circle" style="background-color: #67c23a">
                                <span class="fontstyle">{{ taskData.checkPassCount }}</span>
                            </div>
                            <span class="num">合格数量</span>
                        </el-col>
                        <el-col :span="6">
                            <div class="circle" style="background-color: #f56c6c">
                                <span class="fontstyle">{{ taskData.checkFailCount }}</span>
                            </div>
                            <span class="num1">不合格数量</span>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
        <el-card shadow="never">
            <template #header class="clearfix">
                <el-row justify="start">
                    <h3>待处理不合格抽样样品列表</h3>
                </el-row>
            </template>
            <!--      表格-->
            <TablePanel ref="table" :table-columns="tableColumns" :table-data="tableData"
                @selectionChange="selectionChange" :maxHeight="550">
                <!--        自定义列-->
                <template #col_valueStandard>
                    <vxe-column title="标准值" :min-width="100">
                        <template #default="{ row }">
                            <span v-if="row.basicItemType === 0">
                                {{ row.valueStandardOp + row.valueStandard + row.unit }}</span>
                            <span v-if="row.basicItemType === 1">
                                {{ row.valueStandard }}</span>
                        </template>
                    </vxe-column>
                </template>

                <template #col_checkData>
                    <vxe-column title="初检数据" :min-width="100">
                        <template #default="{ row }">
                            <span v-if="row.basicItemType === 0 && row.checkData !== null">{{
                                    row.checkData + row.unit
                            }}</span>
                            <span v-else-if="row.basicItemType === 1">{{
                                    row.checkData
                            }}</span>
                        </template>
                    </vxe-column>
                </template>

                <template #col_checkChannel>
                    <vxe-column title="初检通道" :min-width="100">
                        <template #default="{ row }">
                            <span v-if="row.checkChannel !== null">{{
                                    row.checkChannel
                            }}</span>
                        </template>
                    </vxe-column>
                </template>

                <template #col_checkInhibitionRatio>
                    <vxe-column title="初检抑制率" :min-width="100">
                        <template #default="{ row }">
                            <span v-if="row.checkInhibitionRatio !== null">{{
                                    row.checkInhibitionRatio + '%'
                            }}</span>
                        </template>
                    </vxe-column>
                </template>

                <template #col_recheckData>
                    <vxe-column title="复检数据" :min-width="100">
                        <template #default="{ row }">
                            <span v-if="row.basicItemType === 0" v-show="row.recheckData !== null">{{ row.recheckData +
                                    row.unit
                            }}</span>
                            <span v-else-if="row.basicItemType === 1" v-show="row.recheckData !== null">{{
                                    row.recheckData
                            }}</span>
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
                    <vxe-column title="检验结果" :min-width="100">
                        <template #default="{ row }">
                            <span v-if="row.recheckResult !== 2">
                                <el-tag v-if="row?.recheckResult === 0" type="danger">不合格</el-tag>
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

                <!--        操作栏-->
                <template #col_action>
                    <vxe-column title="操作" :minWidth="100" fixed="right">
                        <template #default="{ row }">
                            <el-button type="text" size="small" @click="editDialog(row)">处理</el-button>
                        </template>
                    </vxe-column>
                </template>
            </TablePanel>
            <el-row align="middle">
                <el-col :span="12">
                    <el-row justify="start">
                        <Pagination v-show="sampleListQuery.total > 0" :total="sampleListQuery.total"
                            :page="sampleListQuery.current" :limit="sampleListQuery.pageSize"
                            @pagination="sampleGetList()" />
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
        <el-card shadow="never">
            <template #header class="clearfix">
                <el-row align="middle">
                    <el-col :span="12">
                        <el-row justify="start">
                            <h3>待复检送检检测项目列表</h3>
                        </el-row>
                    </el-col>
                </el-row>
            </template>

            <TablePanel :maxHeight="550" :table-columns="tableColumns2" :table-data="tableData2"
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
                    <vxe-column title="复检数据" :min-width="120">
                        <template #default="{ row }">
                            <span v-if="!curListStatus[row.id].editRecheckStatus">{{
                                    row.recheckData
                            }}</span>
                            <vxe-input v-else-if="row.inputType === 0" class="recheckData" v-model="row.recheckData"
                                placeholder="单行输入" type="float" min="0.01" max="100" step="1.0" @blur="reselblur">
                            </vxe-input>
                            <SelectEnumeration v-else-if="row.inputType === 1" class="recheckData" placeholder="请选择"
                                v-model="row.recheckData" en="CHECK_TYPE" @blur="reselblur" />
                        </template>
                    </vxe-column>
                </template>
                <template #col_recheckChannel>
                    <vxe-column title="复检通道" :min-width="120">
                        <template #default="{ row }">
                            <span v-if="!curListStatus[row.id].editRecheckStatus">{{
                                    row.recheckChannel
                            }}</span>
                            <vxe-input v-else class="recheckChannel" v-model="row.recheckChannel" placeholder="单行输入">
                            </vxe-input>
                        </template>
                    </vxe-column>
                </template>
                <template #col_recheckInhibitionRatio>
                    <vxe-column title="复检抑制率" :min-width="120">
                        <template #default="{ row }">
                            <span v-if="!curListStatus[row.id].editRecheckStatus">{{
                                    row.recheckInhibitionRatio
                            }}</span>
                            <vxe-input v-else class="recheckInhibitionRatio" type="float"
                                v-model="row.recheckInhibitionRatio" placeholder="单行输入" min="0.01" max="100" step="1.0">
                            </vxe-input>
                        </template>
                    </vxe-column>
                </template>
                <!-- 检测结果 -->
                <template #col_checkResult>
                    <vxe-column title="检测结果" :min-width="100">
                        <template #default="{ row }">
                            <el-tag v-if="row?.checkResult === 0" type="danger">不合格</el-tag>
                            <el-tag v-else-if="row?.checkResult === 1" type="success">合格</el-tag>
                        </template>
                    </vxe-column>
                </template>

                <!-- 操作 -->
                <template #col_action>
                    <vxe-column title="操作" :width="130" fixed="right">
                        <template #default="{ row }">
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
                        </template>
                    </vxe-column>
                </template>
            </TablePanel>
            <el-row align="middle">
                <el-col :span="12">
                    <el-row justify="start">
                        <Pagination v-show="recheckListQuery.total > 0" :total="recheckListQuery.total"
                            :page="recheckListQuery.current" :limit="recheckListQuery.pageSize"
                            @pagination="getList(recheckListQuery)" />
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import Pagination from '@/components/Pagination/index.vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue'
import { OP_TYPE } from '@/utils/enumeration';
import { Dialog } from '@/components/dialogManager/dialogModel';
import { computed, onMounted, onUnmounted, reactive, ref, toRefs, getCurrentInstance } from 'vue';
import useStore from '@/store';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import {
    getSample,
    getTask,
    getFailedList,
    getreCheckList,
    reCheckUpdate,
    failSampleUpdate
} from '@/api/service/dashboard';

let dialog: any = ref();
const { dialogManager } = useStore();
const { proxy }: any = getCurrentInstance();

const state = reactive({
    // 当前每列是否在录入状态
    curListStatus: [] as any,
    // 样品列表
    sampleListQuery: {
        current: 1,
        pageSize: 10,
        total: 0
    },
    // 复检列表
    recheckListQuery: {
        current: 1,
        pageSize: 10,
        total: 0
    },
    // 样品列表查询表单
    sampleQueryForm: {
        batchNumber: '',
        numberPlate: '',
        receiveTimeEnd: '',
        receiveTimeStart: '',
        region: '',
        sampleCode: '',
        sampleName: '',
        stall: '',
        status: 0,
        submitBy: '',
        checkResult: 0
    },
    // 复检列表查询表单
    recheckQueryForm: {
        appointmentUserName: '',
        beginCheckTime: '',
        endCheckTime: '',
        checkBy: '',
        sampleName: ''
    },
    tableData: [] as any,
    tableColumns: [
        { field: 'sampleCode', title: '样品编号', minWidth: 150, fixed: 'left' },
        { field: 'basicItemName', title: '检测项目', minWidth: 150 },
        { slot: 'col_checkResult' },
        { field: 'sampleName', title: '样品名称', minWidth: 100 },
        { field: 'region', title: '区域', minWidth: 130 },
        { field: 'stall', title: '档口', minWidth: 130 },
        { field: 'numberPlate', title: '车牌号码', minWidth: 150 },
        { field: 'batchNumber', title: '批次号', minWidth: 150 },
        { field: 'quantityIn', title: '进货数量(kg)', minWidth: 120 },
        { field: 'quantitySample', title: '样品数量(g)', minWidth: 120 },
        { slot: 'col_valueStandard' },
        { slot: 'col_checkData' },
        { slot: 'col_checkChannel' },
        { slot: 'col_checkInhibitionRatio' },
        { slot: 'col_recheckData' },
        { slot: 'col_recheckChannel' },
        { slot: 'col_recheckInhibitionRatio' },
        { field: 'wasteMethod', title: '不合格处理方式', minWidth: 150 },
        { field: 'wasteWeight', title: '处理数量(kg)', minWidth: 150 },
        { field: 'remarks', title: '备注', minWidth: 100 },
        { slot: 'col_action' }
    ],
    tableData2: [] as any,
    tableColumns2: [
        { type: 'checkbox', width: 40, fixed: 'left' },
        { field: 'appointmentUserName', title: '送检人', minWidth: 100 },
        { field: 'sampleName', title: '货品名称', minWidth: 100 },
        { field: 'checkItemName', title: '检测项目', minWidth: 150 },
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
    ],
    // 今日抽检汇总数据
    sampleData: {
        checkCount: 0,
        checkFailCount: 0,
        checkPassCount: 0
    } as any,
    // 今日送检汇总数据
    taskData: {
        checkCount: 0,
        checkFailCount: 0,
        checkPassCount: 0
    } as any,
})

const {
    curListStatus,
    sampleListQuery,
    recheckListQuery,
    sampleQueryForm,
    recheckQueryForm,
    tableData,
    tableColumns,
    tableData2,
    tableColumns2,
    sampleData,
    taskData
} = toRefs(state);

onMounted(() => {
    workBenchGetList();
    sampleGetList();
    recheckGetList();
});

// 今日抽检送检汇总查询
function workBenchGetList() {
    getSample().then(({ data }) => {
        state.sampleData.checkCount = data.checkCount;
        state.sampleData.checkFailCount = data.checkFailCount;
        state.sampleData.checkPassCount = data.checkPassCount;
    })
    getTask().then(({ data }) => {
        state.taskData.checkCount = data.checkCount;
        state.taskData.checkFailCount = data.checkFailCount;
        state.taskData.checkPassCount = data.checkPassCount;
    })
}

// 样品列表查询
function sampleGetList() {
    getFailedList({
        ...state.sampleListQuery,
        ...state.sampleQueryForm
    })
        .then(({ data }) => {
            //console.log('样品', data);
            data.data.forEach((item: any) => {
                OP_TYPE.forEach((OP) => {
                    if (item.valueStandardOp === OP.value) {
                        item.valueStandardOp = OP.label
                    }
                })
            })
            state.tableData = data.data || [];
            state.sampleListQuery.pageSize = data.pageSize;
            state.sampleListQuery.current = data.current;
            state.sampleListQuery.total = data.total;
            //console.log(state.tableData);
        })
}

// 复检列表查询
function recheckGetList() {
    getreCheckList({
        ...state.recheckListQuery,
        ...state.recheckQueryForm
    })
        .then(({ data }) => {
            console.log('复检列表', data);
            state.tableData2 = data.data || [];
            console.log('复检列表', state.tableData2);
            state.tableData2.forEach((item: any) => {
                OP_TYPE.forEach((OP) => {
                    if (item.valueStandardOp === OP.value) {
                        item.valueStandardOp = OP.label;
                    }
                })
                // 当前此列是否在录入复检数据
                state.curListStatus[item.id] = {
                    editRecheckStatus: false
                }
            })
            state.recheckListQuery.pageSize = data.pageSize;
            state.recheckListQuery.current = data.current;
            state.recheckListQuery.total = data.total;
        })
}

// 定义编辑状态弹窗
function editDialog(row: any) {
    const props = {
        // 表单数据
        rowData: row,
        // model 弹窗状态 view：查看，edit：编辑
        model: 'edit'
    }
    // 定义回调事件
    const events = {
        confirm: (data: any) => {
            failSampleUpdate({
                ...data
            }).then((res) => {
                console.log(res);
                ElMessage({
                    message: '修改成功',
                    type: 'success'
                })
                dialogManager.closeDialog(dialog.key);
                sampleGetList();
            })
            //console.log('保存数据', data)
        },
        cancel: () => {
            console.log('cancel回调函数')
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '编辑检测项目',
        width: '50%',
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
}

// 复检录入的状态
function editSecondEntry(row: any) {
    state.curListStatus[row.id].editRecheckStatus = true;
    // proxy.$nextTick(() => { document.getElementsByClassName('vxe-input--inner')[0].focus() })
}

function confirm(row: any) {
    if ((!row.recheckData || !row.recheckChannel || !row.recheckInhibitionRatio) && row.checkResult !== 2) {
        if (!row.recheckData) {
            document.querySelector('.recheckData')!.classList.add('red');
        }
        if (!row.recheckChannel) {
            document.querySelector('.recheckChannel')!.classList.add('red');
        }
        if (!row.recheckInhibitionRatio) {
            document.querySelector('.recheckInhibitionRatio')!.classList.add('red');
        }
        ElMessage({
            message: '复检数据未完全录入',
            type: 'error'
        })
        return
    }
    // 当前是复检,点击确定按钮
    state.curListStatus[row.id].editRecheckStatus = false;
    //console.log(row)
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
    try {
        if (!row.recheckData || !row.recheckChannel || !row.recheckInhibitionRatio) {
            throw ('录入复检数据');
        }
        reCheckUpdate({
            id: row.id,
            recheckChannel: row.recheckChannel,
            recheckData: row.recheckData,
            recheckInhibitionRatio: row.recheckInhibitionRatio,
            recheckResult: row.recheckResult
        })
            .then(({ data }) => {
                ElMessage.success('录入复检数据成功');
                resetForm2();
            })
    } catch (error) {
        ElMessage.error(`${error}不能为空`);
        resetForm2();
    }
}

function cancel(row: any) {
    // 获取当前列的id值
    const id = row.id;
    // 当前是复检,点击取消按钮
    state.curListStatus[id].editRecheckStatus = false;
    row.recheckData = null;
    row.recheckChannel = null;
    row.recheckInhibitionRatio = null;
}

// 样品列表查询
function resetForm1() {
    // Object.assign(proxy.$data.sampleQueryForm, proxy.$options.data().sampleQueryForm);
    sampleGetList();
}

// 复检列表查询
function resetForm2() {
    // Object.assign(proxy.$data.recheckQueryForm, proxy.$options.data().recheckQueryForm);
    recheckGetList();
}

function reselblur() {
    document.querySelector('.recheckData')!.classList.remove('red');
}

</script>

<style scoped>
.el-card {
    margin-bottom: 20px;
}

.box {
    height: 200px;
}

.before {
    margin: 14px 10px;
    padding-left: 8px;
    background-color: #dcdfe6;
}

.circle {
    position: relative;
    height: 100px;
    width: 100px;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    border-radius: 50%;
    padding-top: 100px;
}

.clearfix {
    height: 100px;
}

.title {
    font-weight: bold;
}

.circle>span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 26px;
    color: #fff;
    font-weight: bold;
}

.num {
    font-weight: bold;
    margin: 18px 14px 14px 14px;
    display: block;
}

.num1 {
    font-weight: bold;
    margin: 18px 14px 14px 8px;
    display: block;
}

.el-button--small {
    padding: 9px 15px;
}

.red {
    border: 1px solid #f56c6c;
    border-radius: 5px;
}
</style>