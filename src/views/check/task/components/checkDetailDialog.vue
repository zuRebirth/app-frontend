<template>
    <div class="check-detail-dialog">
        <el-row justify="center">
            <h1>{{ headData?.taskCode }}任务明细</h1>
        </el-row>
        <el-row>
            <el-col :span="1" />
            <el-col :span="12">
                <strong>送检时间：</strong>{{ headData?.appointmentTimes }}
            </el-col>
        </el-row>
        <el-card shadow="never">
            <template #header>
                <el-row align="middle">
                    <el-col :span="12">
                        <el-row justify="start">
                            <h3>检测项目列表</h3>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
            <TablePanel :table-columns="tableColumns" :table-data="tableData">
                <template #col_valueStandard>
                    <vxe-column title="判定限值" :min-width="100">
                        <template #default="{ row }">
                            <span v-if="row.inputType === 0">
                                {{ row.valueStandardOp + row.valueStandard + row.unit }}</span>
                            <span v-if="row.inputType === 1"> {{ row.valueStandard }}</span>
                        </template>
                    </vxe-column>
                </template>
                <!-- 初检-->
                <template #col_checkData>
                    <vxe-column title="初检数据" :min-width="120">
                        <template #default="{ row }">
                            <div v-if="!curListStatus[row.id].editCheckStatus">
                                <div v-if="row.inputType === 0">
                                    <span v-if="row.checkData !== null">{{
                                            row.checkData + row.unit
                                    }}</span>
                                </div>
                                <span v-else-if="row.inputType === 1">{{ row.checkData }}</span>
                            </div>
                            <vxe-input class="checkData" v-else-if="row.inputType === 0" v-model="row.checkData"
                                placeholder="单行输入" type="float" min="0.01" step="1.0" @focus="focus('0')" />
                            <BasicItemValuesSelector class="checkData" v-else-if="row.inputType === 1"
                                v-model="row.checkData" :id="row.basicItemId" @blur="selblur"></BasicItemValuesSelector>
                        </template>
                    </vxe-column>
                </template>
                <template #col_checkChannel>
                    <vxe-column title="初检通道" :min-width="120">
                        <template #default="{ row }">
                            <span v-if="!curListStatus[row.id].editCheckStatus">
                                <span v-if="row.checkData !== null">{{
                                        row.checkChannel
                                }}</span>
                            </span>
                            <vxe-input v-else class="checkChannel" v-model="row.checkChannel" placeholder="单行输入"
                                @focus="focus('1')"></vxe-input>
                        </template>
                    </vxe-column>
                </template>
                <template #col_checkInhibitionRatio>
                    <vxe-column title="初检抑制率" :min-width="120">
                        <template #default="{ row }">
                            <span v-if="!curListStatus[row.id].editCheckStatus">
                                <span v-if="row.checkData !== null">{{
                                        row.checkInhibitionRatio + '%'
                                }}</span>
                            </span>
                            <vxe-input v-else class="checkInhibitionRatio" v-model="row.checkInhibitionRatio"
                                placeholder="单行输入" type="float" min="0.01" max="100" step="1.0" @focus="focus('2')">
                            </vxe-input>
                        </template>
                    </vxe-column>
                </template>
                <!-- 复检 -->
                <template #col_recheckData>
                    <vxe-column title="复检数据" :min-width="120">
                        <template #default="{ row }">
                            <div v-if="!curListStatus[row.id].editRecheckStatus">
                                <span v-if="row.inputType === 0" v-show="row.recheckData !== null">{{ row.recheckData +
                                        row.unit
                                }}</span>
                                <span v-else-if="row.inputType === 1" v-show="row.recheckData !== null">{{
                                        row.recheckData
                                }}</span>
                            </div>
                            <vxe-input class="recheckData" v-else-if="row.inputType === 0" v-model="row.recheckData"
                                placeholder="单行输入" type="float" min="0.01" step="1.0" @focus="focus('0')">
                            </vxe-input>
                            <BasicItemValuesSelector class="recheckData" v-else-if="row.inputType === 1"
                                v-model="row.recheckData" :id="row.basicItemId" @blur="reselblur">
                            </BasicItemValuesSelector>
                        </template>
                    </vxe-column>
                </template>
                <template #col_recheckChannel>
                    <vxe-column title="复检通道" :min-width="120">
                        <template #default="{ row }">
                            <span v-if="!curListStatus[row.id].editRecheckStatus">{{
                                    row.recheckChannel
                            }}</span>
                            <vxe-input class="recheckChannel" v-else v-model="row.recheckChannel" placeholder="单行输入"
                                @focus="focus('1')"></vxe-input>
                        </template>
                    </vxe-column>
                </template>
                <template #col_recheckInhibitionRatio>
                    <vxe-column title="复检抑制率" :min-width="120">
                        <template #default="{ row }">
                            <div v-if="!curListStatus[row.id].editRecheckStatus">
                                <span v-if="row.recheckInhibitionRatio !== null">{{
                                        row.recheckInhibitionRatio + '%'
                                }}</span>
                            </div>
                            <vxe-input v-else class="recheckInhibitionRatio" v-model="row.recheckInhibitionRatio"
                                placeholder="单行输入" type="float" min="0.01" max="100" step="1.0" @focus="focus('2')">
                            </vxe-input>
                        </template>
                    </vxe-column>
                </template>
                <!-- 检测结果 -->
                <template #col_checkResult>
                    <vxe-column title="检测结果" :min-width="100">
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

                <!-- 操作 -->
                <template #col_action>
                    <vxe-column title="操作" :width="150" fixed="right">
                        <template #default="{ row }">
                            <div v-if="row.recheckResult !== 2 || row.checkResult === 1"></div>
                            <div v-else-if="
                                !curListStatus[row.id].editCheckStatus &&
                                !curListStatus[row.id].editRecheckStatus
                            ">
                                <vxe-button size="mini" status="primary" content="初检录入"
                                    v-if="row.checkData === null && row.recheckData === null" type="text"
                                    @click="editFirstEntry(row)" />
                                <vxe-button v-else size="mini" status="primary" type="text" content="复检录入"
                                    @click="editSecondEntry(row)" />
                            </div>
                            <div v-else>
                                <vxe-button size="mini" status="primary" type="text" content="保存"
                                    @click="confirm(row)" />
                                <vxe-button size="mini" status="primary" type="text" content="取消"
                                    @click="cancelEntry(row)" />
                            </div>
                        </template>
                    </vxe-column>
                </template>
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
        <div class="form-button">
            <el-button type="default" @click="cancel()">关闭</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TablePanel from '@/components/TablePanel/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { OP_TYPE } from '@/utils/enumeration'
import { getCurrentInstance, reactive, ref, toRefs, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { checkTaskList, checkTaskDetail } from '@/api/service/check';
import { PageQueryParam } from '@/types/api/base';

const { proxy }: any = getCurrentInstance();

const props = defineProps({
    headData: {
        type: Object,
        require: true
    }
});

const state = reactive({
    headData: props.headData,
    i: 0,
    // 当前每列是否在录入状态
    curListStatus: [] as any,
    queryParams: {
        current: 1,
        pageSize: 10
    } as PageQueryParam,
    total: 0,
    tableData: [] as any,
    // 表格设置
    tableColumns: [
        { type: 'checkbox', width: 40, fixed: 'left' },
        { field: 'appointmentCode', title: '送检编号', minWidth: 150 },
        { field: 'appointmentUserName', title: '送检人', minWidth: 100 },
        { field: 'sampleName', title: '货品名称', minWidth: 100 },
        { field: 'checkItemName', title: '检测项目', minWidth: 100 },
        { slot: 'col_checkResult' },
        { slot: 'col_valueStandard' },
        { slot: 'col_checkData' },
        { slot: 'col_checkChannel' },
        { slot: 'col_checkInhibitionRatio' },
        { slot: 'col_recheckData' },
        { slot: 'col_recheckChannel' },
        { slot: 'col_recheckInhibitionRatio' },
        { field: 'checkBy', title: '检验员', minWidth: 100 },
        { field: 'checkTime', title: '检验时间', minWidth: 170 },
        { slot: 'col_action' }
    ]
})

const { headData, i, curListStatus, queryParams, tableData, tableColumns, total } = toRefs(state);

onMounted(() => {
    handleQuery();
    addEnterListener();
});

// 取消事件
function cancel() {
    proxy.$attrs.events.cancel();
};

function addEnterListener() {
    // if (window.__completeEnterBind__) return;
    // window.addEventListener('keydown', this.enterCallback);
    // window.__completeEnterBind__ = true;
};

function removeEnterListener() {
    // window.removeEventListener('keydown', this.enterCallback)
    // window.__completeEnterBind__ = false
};

function enterCallback(e: any) {
    // console.log(this.i)
    // if (e.keyCode === 13 || e.keyCode === 9) {
    //     if (this.i === 2) { this.i = -1 }
    //     document.getElementsByClassName('vxe-input--inner')[++this.i].focus()
    // }
};

function handleQuery() {
    checkTaskDetail({
        ...state.queryParams,
        id: state.headData!.id,
        appointmentTimes: state.headData!.appointmentTimes,
        status: state.headData!.status,
    })
        .then((data) => {
            state.tableData = data.data.data || [];
            //后台接口无数据
            //console.log('12313',data)
            state.tableData.forEach((ele: any) => {
                state.curListStatus[ele.id] = {
                    // 当前此列是否在录入初检数据
                    editCheckStatus: false,
                    // 当前此列是否在录入复检数据
                    editRecheckStatus: false
                }
                OP_TYPE.forEach((OP) => {
                    if (ele.valueStandardOp === OP.value) {
                        ele.valueStandardOp = OP.label
                    }
                })
            })
            state.queryParams.pageSize = data.data.pageSize;
            state.queryParams.current = data.data.current;
            state.total = data.data.total;
        })
        .catch((error) => {
            console.log(error)
        })
  
};

// 初检录入的状态
function editFirstEntry(row: any) {
    state.i = 0;
    state.curListStatus[row.id].editCheckStatus = true;
    // 聚焦第一个输入框
    // proxy.$nextTick(() => { document.getElementsByClassName('vxe-input--inner')[0].focus() })
};

// 复检录入的状态
function editSecondEntry(row: any) {
    state.i = 0
    state.curListStatus[row.id].editRecheckStatus = true;
    // // 聚焦第一个输入框
    // this.$nextTick(() => { document.getElementsByClassName('vxe-input--inner')[0].focus() })
};

function confirm(row: any) {
    // 获取当前行
    const cur = state.curListStatus[row.id];
    // 如果当前是【复检】,点击确定按钮
    // 判断输入复检数据是否为空
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
            offset: 300,
            type: 'error'
        })
        return;
    }
    if (cur.editRecheckStatus) {
        cur.editRecheckStatus = false
        // 判断输入的复检数据是否合格
        // 如果是文字类型
        if (row.inputType === 1) {
            row.recheckResult = row.recheckData === row.valueStandard ? 1 : 0
        }
        // 如果是数字类型
        else {
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
            // // this.$Api 调用接口传入row给后端
            // this.$Api.checkManagement.taskDetailUpdate({
            //     id: row.id,
            //     checkChannel: null,
            //     checkData: null,
            //     checkInhibitionRatio: null,
            //     checkResult: null,
            //     recheckChannel: row.recheckChannel,
            //     recheckData: row.recheckData,
            //     recheckInhibitionRatio: row.recheckInhibitionRatio,
            //     recheckResult: row.recheckResult
            // })
            //     .then((res) => {
            //         this.$message.success('录入复检数据成功')
            //         console.log(res)
            //     }).catch((err) => {
            //         console.log(err)
            //     })
            // return
        } catch (error) {
            // this.getList()
        }
    }
    // 没return代表是【初检】
    if (!row.checkData || !row.checkChannel || !row.checkInhibitionRatio) {
        if (!row.checkData) {
            document.querySelector('.checkData')?.classList.add('red');
        }
        if (!row.checkChannel) {
            document.querySelector('.checkChannel')?.classList.add('red');
        }
        if (!row.checkInhibitionRatio) {
            document.querySelector('.checkInhibitionRatio')?.classList.add('red');
        }
        ElMessage({
            message: '初检数据未完全录入',
            offset: 300,
            type: 'error'
        });
        return;
    }
    cur.editCheckStatus = false;
    // 判断输入的复检数据是否合格
    // 如果是文字类型
    if (row.inputType === 1) {
        row.checkResult = row.checkData === row.valueStandard ? 1 : 0;
    }
    // 如果是数字类型
    else {
        if (row.valueStandardOp === '<') {
            row.checkResult = parseFloat(row.checkData) < parseFloat(row.valueStandard) ? 1 : 0;
        } else if (row.valueStandardOp === '<=') {
            row.checkResult = parseFloat(row.checkData) <= parseFloat(row.valueStandard) ? 1 : 0;
        } else if (row.valueStandardOp === '>') {
            row.checkResult = parseFloat(row.checkData) > parseFloat(row.valueStandard) ? 1 : 0;
        } else if (row.valueStandardOp === '>=') {
            row.checkResult = parseFloat(row.checkData) >= parseFloat(row.valueStandard) ? 1 : 0;
        } else {
            row.checkResult = parseFloat(row.checkData) === parseFloat(row.valueStandard) ? 1 : 0;
        }
    }
    try {
        // this.$Api.checkManagement.taskDetailUpdate({
        //     id: row.id,
        //     checkChannel: row.checkChannel,
        //     checkData: row.checkData,
        //     checkInhibitionRatio: row.checkInhibitionRatio,
        //     checkResult: row.checkResult,
        //     recheckChannel: row.recheckChannel,
        //     recheckData: row.recheckData,
        //     recheckInhibitionRatio: row.recheckInhibitionRatio,
        //     recheckResult: row.recheckResult
        // })
        //     .then((res) => {
        //         this.$message.success('录入初检数据成功')
        //         console.log(res)
        //     }).catch((err) => {
        //         console.log(err)
        //     })
    } catch (error) {
        // this.getList()
    }
};

function cancelEntry(row: any) {
    // 获取当前列的id值
    const id = row.id;
    // 如果当前是复检,点击取消按钮
    if (state.curListStatus[id].editRecheckStatus) {
        state.curListStatus[id].editRecheckStatus = false;
        row.recheckData = null;
        row.recheckChannel = null;
        row.recheckInhibitionRatio = null;
        state.i = 0;
        return
    }
    // 如果上面没有return 代表当前肯定是初检的点击取消按钮
    state.curListStatus[id].editCheckStatus = false;
    row.checkData = null;
    row.checkChannel = null;
    row.checkInhibitionRatio = null;
    state.i = 0;
};

function focus(row: any) {
    state.i = parseInt(row);
};
function selblur() {
    document.querySelector('.checkData')?.classList.remove('red');
};
function reselblur() {
    document.querySelector('.recheckData')?.classList.remove('red');
};

</script>

<style lang="scss" scoped>
.red {
    border: 1px solid #f56c6c;
    border-radius: 5px;
}

.form-button {
    margin-top: 20px;
    float: right;
}
</style>