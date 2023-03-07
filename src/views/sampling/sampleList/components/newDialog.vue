<template>
    <div class="header">
        <el-form :model="ruleForm" label-width="80px" ref="ruleForm" :rules="rules">
            <!-- <el-row>
                <el-col :span="1" />
                <el-col :span="9">
                    <el-form-item label="区域" prop="region">
                        <RegionSelector v-model="ruleForm.region" :modelValue="ruleForm.regionId"
                            @selectChange="selectRegionChange"></RegionSelector>
                    </el-form-item>
                </el-col>
                <el-col :span="1" />
                <el-col :span="9">
                    <el-form-item label="档口" prop="stall">
                        <StallSelector v-model="ruleForm.stall" :modelValue="ruleForm.stallId"
                            :regId="ruleForm.regionId" @selectChange="selectStallChange">
                        </StallSelector>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <el-row>
                <!-- <el-col :span="1" />
                <el-col :span="9">
                    <el-form-item label="批次号" prop="batchNumber">
                        <BatchNumberSelector v-model="ruleForm.batchNumber" :modelValue="ruleForm.batchNumberId"
                            :gid="gid" @selectChange="selectBatchNumberChange">
                        </BatchNumberSelector>
                    </el-form-item>
                </el-col>
                <el-col :span="1" /> -->
                <el-col :span="9">
                    <el-form-item label="进货时间" prop="restockTime">
                        <el-date-picker v-model="ruleForm.restockTime" type="datetime" placeholder="选择日期"
                            value-format="YYYY-MM-DD hh:mm:ss" style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- <div class="recheck" v-show="stallList">
            <span class="title">档口货品列表</span>
            <el-row justify="center">
                <el-col :span="22" style="padding: 20px">
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox v-for="(item, index) in stallList" :key="index" :label="item.sampleName"
                            @change="changeShow" />
                    </el-checkbox-group>
                </el-col>
            </el-row>
        </div> -->
        <div class="recheck">
            <span class="title">抽检样品列表</span>
            <el-row class="action" align="middle">
                <el-col :span="24">
                    <el-row justify="end">
                        <el-button type="primary" :disabled="
                            ruleForm.batchNumber !== undefined || ruleForm.stall === ''
                        " @click="newDialog()">新增货品
                        </el-button>
                    </el-row>
                </el-col>
            </el-row>
            <!--  表格-->
            <el-card>
                <TablePanel ref="table" class="table" :table-columns="tableColumns"
                    :table-data="ruleForm.checkSampleList">
                    <!-- <template #col_sampleName>
                        <vxe-column title="货品名称" :min-width="100">
                            <template #default="{ row }">
                                <div v-show="
                                    judgeStrinArr(row.sampleName, checkList) ||
                                    ruleForm.batchNumber === undefined
                                ">
                                    {{ row.sampleName }}
                                </div>
                            </template>
                        </vxe-column>
                    </template> -->
                    <template #col_basicItemName>
                        <vxe-column title="检测项目" :min-width="100">
                            <template #default="{ row }">
                                <BasicItemSelector v-if="
                                    judgeStrinArr(row.sampleName, checkList) ||
                                    ruleForm.batchNumber === undefined
                                " :disabled="ruleForm.batchNumber === undefined" v-model="row.basicItemName"
                                    :modelValue="row.basicItemId" @selectChange="selectChange" @click="getRow(row)"
                                    class="basicItemName"></BasicItemSelector>
                            </template>
                        </vxe-column>
                    </template>
                    <template #col_quantityIn>
                        <vxe-column title="进货数量(kg)" :min-width="100">
                            <template #default="{ row }">
                                <div v-if="
                                    judgeStrinArr(row.sampleName, checkList) ||
                                    ruleForm.batchNumber === undefined
                                ">
                                    <vxe-input v-model="row.quantityIn" :disabled="ruleForm.batchNumber === undefined"
                                        type="float" min="0.01" step="1"></vxe-input>
                                </div>
                            </template>
                        </vxe-column>
                    </template>
                    <template #col_quantitySample>
                        <vxe-column title="样品数量(g)" :min-width="100">
                            <template #default="{ row }">
                                <div v-if="
                                    judgeStrinArr(row.sampleName, checkList) ||
                                    ruleForm.batchNumber === undefined
                                ">
                                    <vxe-input v-model="row.quantitySample"
                                        :disabled="ruleForm.batchNumber === undefined" type="float" min="0.01" step="1">
                                    </vxe-input>
                                </div>
                            </template>
                        </vxe-column>
                    </template>

                    <!--        操作栏-->
                    <template #col_action>
                        <vxe-column title="操作" fixed="right">
                            <template #default="{ row }">
                                <div v-if="
                                    judgeStrinArr(row.sampleName, checkList) ||
                                    ruleForm.batchNumber === undefined
                                ">
                                    <el-tooltip effect="dark" content="删除" placement="top">
                                        <svg-icon class="icon" icon-class="delete" @click="handelDel(row)" />
                                    </el-tooltip>
                                </div>
                            </template>
                        </vxe-column>
                    </template>
                </TablePanel>
            </el-card>
        </div>
        <div class="form-button">
            <el-button type="default" @click="cancel()">取消</el-button>
            <el-button type="primary" @click="confirm()">确定</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { reactive, toRefs, getCurrentInstance, ref } from 'vue';
import dayjs from 'dayjs';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import useStore from '@/store';
import { Dialog } from '@/components/dialogManager/dialogModel';
import TablePanel from '@/components/TablePanel/index.vue';
import BasicItemSelector from '@/components/BasicItemSelector/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

const { proxy }: any = getCurrentInstance();
const { dialogManager } = useStore();

let dialog: any = ref();

const state = reactive({
    // 表单对象
    ruleForm: {
        // 区域
        region: '514',
        // 区域id
        regionId: '114',
        // 档口
        stall: 'A区',
        stallId: '3113',
        // 批次号
        batchNumber: 'A12344555',
        batchNumberId: '241411',
        // 车牌号码
        numberPlate: '粤A12345',
        // 进货时间
        restockTime: dayjs(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        checkSampleList: [{
            basicItemId: 0,
            basicItemName: '',
            quantityIn: '',
            quantitySample: '',
            sampleName: '',
        }] as any
    },
    // 表单验证规格
    rules: {
        region: [
            { required: false, message: '请选择', trigger: 'blur' }
        ],
        stall: [
            { required: false, message: '请选择', trigger: 'blur' }
        ],
        batchNumber: [
            { required: false, message: '请选择', trigger: 'blur' }
        ],
        numberPlate: [
            { required: false, message: '请输入', trigger: 'blur', max: 20 }
        ],
        restockTime: [
            { required: false, message: '请输入', trigger: 'blur' }
        ]
    },
    // 表格数据
    sampleList: [] as any,
    // 表格设置
    tableColumns: [
        { slot: 'col_sampleName' },
        { slot: 'col_basicItemName' },
        { slot: 'col_quantityIn' },
        { slot: 'col_quantitySample' },
        { slot: 'col_action' }
    ],
    loading: false,
    // 档口报备 id
    gid: '114514',
    // 添加货品时当前行的数据
    nowRow: '21241' as any,
    // 有批次号的档口货品列表勾选框 ps: ['苹果','香蕉']
    checkList: ['苹果', '香蕉'] as any,
    // 记录最开始货品勾选框的数组
    originCheckList: [] as any,
    // 有批次号的档口货品列表
    stallList: [] as any
});

const { ruleForm, rules, sampleList, loading, gid, nowRow, checkList, tableColumns, originCheckList, stallList } = toRefs(state);

// 取消事件
function cancel() {
    proxy.$attrs.events.cancel();
};

// 确认事件
function confirm() {
    proxy.$refs.ruleForm.validate((valid: any) => {
        if (valid) {
            //console.log(proxy.$refs.table.$refs.table.getRecordset())
            // 有批次号提交
            if (state.ruleForm.batchNumber !== undefined) {
                //console.log('无批次号提交1')
                // this.ruleForm.checkSampleList = _.clone(this.$refs.table.$refs.table.getRecordset().insertRecords)
                // proxy.$refs.table.$refs.table.getRecordset().insertRecords.forEach((addItem: any) => {
                //     state.ruleForm.checkSampleList.push(addItem);
                // })
                // 确定时候当前的选择框
                // console.log('确定时候当前的选择框' + this.checkList)
                // 原本的货品数量
                // console.log('原本的货品数量' + this.originCheckList)
                // 需要删除的货品名字
                const Goods: any[] = [];
                state.originCheckList.forEach((item: any) => {
                    if (!proxy.judgeStrinArr(item, state.checkList)) {
                        Goods.push(item);
                    }
                })
                // console.log('需要删除的货品信息' + Goods)
                for (let i = 0; i < Goods.length; i++) {
                    for (let j = 0; j < state.ruleForm.checkSampleList.length; j++) {
                        if (Goods[i] === state.ruleForm.checkSampleList[j].sampleName) {
                            state.ruleForm.checkSampleList.splice(j, 1);
                            break;
                        }
                    }
                }
               // console.log('无批次号提交2', state.ruleForm)
                // if (state.ruleForm.checkSampleList.length === 0) {
                //     ElMessage.error('货品不能为空');
                //     state.ruleForm.checkSampleList.splice(0, state.ruleForm.checkSampleList.length);
                //     return;
                // }
                let isEmpty = false
                //console.log('无批次号提交3', state.ruleForm.checkSampleList)
                for (let i = 0; i < state.ruleForm.checkSampleList.length; i++) {
                    if (state.ruleForm.checkSampleList[i].basicItemName === '' || state.ruleForm.checkSampleList[i].basicItemName === undefined) {
                        // this.ruleForm.checkSampleList[i].$refs.basicItemName.style = 'border 1px solid red'
                        console.log(proxy.$refs.basicItemName);
                        isEmpty = true;
                    }
                }
               // console.log('无批次号提交3', state.ruleForm)
                if (isEmpty) {
                    ElMessage.error('请选择货品检测项目名称');
                    state.ruleForm.checkSampleList.splice(0, state.ruleForm.checkSampleList.length);
                    return;
                }
               // console.log('提交表格数据', state.ruleForm)
                proxy.$attrs.events.confirm((state.ruleForm));
            } else { // 无批次号提交
                state.ruleForm.checkSampleList = proxy.$refs.table.$refs.table.getRecordset().insertRecords;
                //console.log('无批次号提交', state.ruleForm.checkSampleList[0].basicItemName)
                proxy.$attrs.events.confirm(_.cloneDeep(state.ruleForm));
            }
        } else {
            return false;
        }
    })
}

// 定义新增状态弹窗
function newDialog() {
    const props = {
        gid: state.ruleForm.stallId
    }
    // 定义回调事件
    const events = {
        confirm: (formData: any) => {
            console.log(formData)
            proxy.$refs.table.$refs.table.insertAt(formData, -1);
            dialogManager.closeDialog(dialog.key);
        },
        cancel: () => {
            console.log('cancel回调函数')
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '新增货品项目',
        width: '30%',
        isShowFooter: false,
        customClass: 'month-report__dialog'
    }
    // 引入弹窗主体组件
    const component = require('./newSampleDialog.vue').default;
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
    // dialog = new Dialog(component, props, events, meta);
    // dialogManager.addDialog(dialog);
    dialogManager.openDialog(dialog.key);
};

function handelDel(row: any) {
    if (state.ruleForm.batchNumber === undefined || state.ruleForm.batchNumber === null || state.ruleForm.batchNumber === '') {
        proxy.$refs.table.$refs.table.remove(row);
    } else {
        let id;
        state.checkList.forEach((item: any, index: any) => {
            if (item === row.sampleName) {
                id = index;
            }
        })
        // 删除一个复选框
        state.checkList.splice(id, 1);
    }
};

function selectRegionChange(value: any) {
    if (value === '') {
        state.ruleForm.stall = '';
        state.ruleForm.stallId = '';
        state.ruleForm.batchNumber = '';
        state.ruleForm.batchNumberId = '';
        state.ruleForm.numberPlate = '';
        state.gid = '';
        state.nowRow = '';
        state.checkList = [];
        state.originCheckList = [];
        state.stallList = '';
        state.ruleForm.numberPlate = '';
        state.ruleForm.stall = '';
        state.ruleForm.regionId = '';
        state.ruleForm.region = '';
        proxy.$refs.table.$refs.table.remove();
        return;
    }
    state.ruleForm.regionId = value.regId;
    state.ruleForm.region = value.regName;
}

function selectStallChange(value: any) {
    if (value === '') {
        state.ruleForm.batchNumber = '';
        state.ruleForm.batchNumberId = '';
        proxy.$refs.table.$refs.table.remove();
        state.gid = '';
        state.nowRow = '';
        state.checkList = [];
        state.originCheckList = [];
        state.stallList = '';
        state.ruleForm.numberPlate = '';
        state.ruleForm.stall = '';
        return;
    }
    state.ruleForm.stall = value.mrgNumber;
    state.ruleForm.stallId = value.mrgId;
    // state.$Api.third.getMerchantInfo({
    //     mrgId: value.mrgId
    // }).then((res) => {
    //     console.log(res)
    //     this.gid = res.data.gid
    // })
};

function selectBatchNumberChange(value: any) {
    if (state.ruleForm.batchNumber === undefined) {
        state.stallList = '';
        state.ruleForm.numberPlate = '';
        proxy.$refs.table.$refs.table.remove();
        state.nowRow = '';
        state.checkList = [];
        state.originCheckList = [];
    }
    // 初始化数组
    state.checkList = [];
    state.ruleForm.batchNumber = value.incomNum;
    state.ruleForm.batchNumberId = value.incomTid;
    // this.$Api.third.getIncomTrainsInfo({ incomTid: value.incomTid }).then((res) => {
    //     this.ruleForm.numberPlate = res.data.trainNum
    //     const newItem = res.data.incomTrainsGoodsList.map(i => {
    //         return {
    //             sampleName: i.goodName,
    //             quantitySample: i.goodNum,
    //             quantityIn: i.weight,
    //             sampleId: i.goodId,
    //             basicItemName: '',
    //             basicItemId: ''
    //         }
    //     })
    //     // 获取货品列表的数据(复选框的显示)
    //     this.stallList = newItem
    //     // 删除原有的货品列表数据，防止切换档口时无限添加货品
    //     this.$refs.table.$refs.table.remove()
    //     newItem.forEach((item) => {
    //         // 复选框全选中
    //         this.checkList.push(item.sampleName)
    //         // 获取初始的选择框列表
    //         this.originCheckList.push(item.sampleName)
    //         // 插入数据
    //         this.$refs.table.$refs.table.insertAt(item, -1)
    //     })
    //     console.log(this.originCheckList)
    // })
};

function selectChange(value: any) {
    state.nowRow.basicItemId = value.id;
    state.nowRow.basicItemName = value.itemName;
};

function getRow(row: any) {
    state.nowRow = row;
}
// 判断一个字符串str是否在数组arr中
function judgeStrinArr(str: any, arr: any) {
    const a = arr.indexOf(`${str}`);
    return a > -1;
}

</script>

<style lang="scss" scoped>
.header {
    .recheck {
        margin-top: 20px;
        border-radius: 10px;
        border: 3px solid #dcdfe6;
        padding-bottom: 10px;

        .title {
            position: relative;
            padding: 10px 30px;
            background-color: #ffffff;
            top: -10px;
            left: 10px;
            font-weight: bold;
        }

        .el-form {
            height: 40px;
        }
    }
}

.el-select {
    width: 100%;
}

.action {
    padding-right: 20px;
    margin-bottom: 10px;
}

.form-button {
    margin-top: 20px;
    float: right;
}

.value-text {
    font-weight: bold;
    height: 32px;
    display: flex;
    align-items: center;

    span {
        color: #67c23a;
    }
}
</style>