<template>
    <div class="status-dialog-container">
        <el-card shadow="never" class="add">
            <el-row type="flex" justify="space-around" :gutter="20">
                <el-col :span="10">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="130px">
                        <el-form-item label="送检方式" prop="checkMode">
                            <el-radio-group v-model="ruleForm.checkMode" :disabled="true">
                                <el-radio :label="0">普通送检</el-radio>
                                <el-radio :label="1">过海送检</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="送检人姓名" prop="appointmentUserName">
                            <el-input placeholder="请输入送检人姓名" v-model="ruleForm.appointmentUserName"
                                :disabled="model === 'view'"></el-input>
                        </el-form-item>
                        <el-form-item label="送检时间" prop="appointmentTime">
                            <el-date-picker v-model="ruleForm.appointmentTime" type="datetime" placeholder="选择日期"
                                :disabled="model === 'view'">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="mobile">
                            <el-input placeholder="请输入" v-model="ruleForm.mobile" :disabled="model === 'view'">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="idCard">
                            <el-input placeholder="请输入" v-model="ruleForm.idCard" :disabled="model === 'view'">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-if="model === 'edit'" placeholder="请输入" v-model="ruleForm.email"
                                :disabled="model === 'view'"></el-input>
                            <el-input v-else v-model="ruleForm.email" :disabled="model === 'view'"></el-input>
                        </el-form-item>
                        <el-form-item label="区域" prop="region">
                            <RegionSelector :disabled="model === 'view'" v-model="ruleForm.region"
                                :modelValue="ruleForm.regionId" @selectChange="selectRegionChange"></RegionSelector>
                        </el-form-item>
                        <el-form-item label="档口" prop="stall">
                            <StallSelector :disabled="model === 'view'" v-model="ruleForm.stall"
                                :modelValue="ruleForm.stallId" :regId="ruleForm.regionId"
                                @selectChange="selectStallChange">
                            </StallSelector>
                        </el-form-item>
                        <el-form-item label="身份证照片" prop="idCardImg">
                            <div style="display: flex; width: 400px">
                                <el-upload :disabled="model === 'view'" class="avatar-uploader" :action="uploadUrl"
                                    :show-file-list="false" drap accept=".jpg, .jpeg, .png" :on-change="uploadIdCardImg"
                                    :auto-upload="false">
                                    <img v-if="ruleForm.idCardImg" :src="ruleForm.idCardImg" class="avatar" />
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <plus />
                                    </el-icon>
                                </el-upload>
                                <div v-show="model === 'edit'" class="pic">
                                    点击图片进行切换
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="样品照片" prop="sampleImg">
                            <div style="display: flex; width: 400px">
                                <el-upload :disabled="model === 'view'" class="avatar-uploader" :action="uploadUrl"
                                    :show-file-list="false" drap accept=".jpg, .jpeg, .png" :on-change="uploadSampleImg"
                                    :auto-upload="false">
                                    <img v-if="ruleForm.sampleImg" :src="ruleForm.sampleImg" class="avatar" />
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <plus />
                                    </el-icon>
                                </el-upload>
                                <div v-show="model === 'edit'" class="pic">
                                    点击图片进行切换
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="备注" prop="remarks">
                            <el-input v-if="model === 'edit'" :disabled="model === 'view'" v-model="ruleForm.remarks"
                                :rows="5" type="textarea" placeholder="请输入" />
                            <el-input v-else :disabled="model === 'view'" v-model="ruleForm.remarks" :rows="5"
                                type="textarea"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="2" />
                <el-col :span="12">
                    <el-row type="flex" :gutter="20" justify="space-around"
                        v-show="model === 'edit' || model === 'view'">
                        <el-form>
                            <el-col :span="12">
                                <el-form-item label="预约编号">
                                    <el-input v-model="ruleForm.appointmentCode" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="样品状态">
                                    <SelectEnumeration disabled v-model="ruleForm.status" en="SAMPLE_TYPE" />
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>
                    <el-card shadow="never" style="background-color: #d3dce6" v-if="ruleForm.checkMode">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm2" label-width="25%">
                            <el-form-item label="报备批次" prop="batchNumber">
                                <BatchNumberSelector style="width: 75%" :disabled="model === 'view'"
                                    v-model="ruleForm.batchNumber" :modelValue="ruleForm.batchNumberId"
                                    :gid="ruleForm.gid" @selectChange="selectBatchNumberChange" />
                            </el-form-item>
                            <el-form-item label="产地" prop="originFrom">
                                <el-input placeholder="请输入" v-model="ruleForm.originFrom" :disabled="model === 'view'"
                                    style="width: 75%"></el-input>
                            </el-form-item>
                            <el-form-item label="车牌号码" prop="numberPlate">
                                <el-input placeholder="请输入" v-model="ruleForm.numberPlate" :disabled="model === 'view'"
                                    style="width: 75%"></el-input>
                            </el-form-item>
                            <el-form-item label="司机姓名" prop="driverName">
                                <el-input placeholder="请填写" v-model="ruleForm.driverName" :disabled="model === 'view'"
                                    style="width: 75%"></el-input>
                            </el-form-item>
                            <el-form-item label="司机号码" prop="driverCode">
                                <el-input placeholder="请填写" v-model="ruleForm.driverCode" :disabled="model === 'view'"
                                    style="width: 75%"></el-input>
                            </el-form-item>
                            <el-form-item label="发往地" prop="sendTo">
                                <el-input placeholder="请输入" v-model="ruleForm.sendTo" :disabled="model === 'view'"
                                    style="width: 75%"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-col>
            </el-row>
            <el-card>
                <template #header class="clearfix">
                    <el-row align="middle">
                        <el-col :span="12">
                            <el-row justify="start">
                                <h3>预约送检货品明细</h3>
                            </el-row>
                        </el-col>
                        <el-col :span="12">
                            <el-row justify="end">
                                <el-button type="primary" @click="addGoodsDialog" v-show="!(model === 'view')"
                                    :disabled="
                                        (ruleForm.batchNumber !== undefined &&
                                            ruleForm.batchNumber !== null &&
                                            ruleForm.checkMode === 1) ||
                                        ruleForm.stall === '' ||
                                        model === 'view'
                                    ">添加货品</el-button>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>

                <TablePanel ref="table" :table-columns="goodsColumns" :table-data="ruleForm.detailList">
                    <template #col_basicItemName>
                        <vxe-column title="检测项目" :min-width="100">
                            <template #default="{ row }">
                                <BasicItemSelector :disabled="
                                    ruleForm.batchNumber === undefined ||
                                    ruleForm.batchNumber === null ||
                                    model === 'view' ||
                                    ruleForm.checkMode === 0
                                " v-model="row.basicItemName" :modelValue="row.basicItemId" @selectChange="selectChange"
                                    @click="getRow(row)"></BasicItemSelector>
                            </template>
                        </vxe-column>
                    </template>
                    <template #col_weight>
                        <vxe-column title="吨数" :min-width="100">
                            <template #default="{ row }">
                                <vxe-input v-model="row.weight" :disabled="
                                    ruleForm.batchNumber === undefined ||
                                    ruleForm.batchNumber === null ||
                                    ruleForm.batchNumber === '' ||
                                    model === 'view'
                                " type="float" min="0.01" step="1"></vxe-input>
                            </template>
                        </vxe-column>
                    </template>
                    <template #col_quantity>
                        <vxe-column title="件数" :min-width="100">
                            <template #default="{ row }">
                                <vxe-input v-model="row.quantity" :disabled="
                                    ruleForm.batchNumber === undefined ||
                                    ruleForm.batchNumber === null ||
                                    ruleForm.batchNumber === '' ||
                                    model === 'view'
                                " type="number" min="1" step="1"></vxe-input>
                            </template>
                        </vxe-column>
                    </template>
                    <template #col_action>
                        <vxe-column title="操作" :minWidth="100" fixed="right">
                            <template #default="{ row }">
                                <el-tooltip effect="dark" content="删除" placement="top">
                                    <vxe-button icon="iconfont icon-shanchu" type="text" @click="handleDel(row)"
                                        :disabled="model === 'view'" />
                                </el-tooltip>
                            </template>
                        </vxe-column>
                    </template>
                </TablePanel>
                <el-row align="middle">
                    <el-col :span="12">
                        <el-row justify="start">
                            <Pagination v-show="listQuery.total > 0" :total="listQuery.total" :page="listQuery.page"
                                :limit="listQuery.limit" @pagination="getList" />
                        </el-row>
                    </el-col>
                </el-row>
            </el-card>
        </el-card>
        <div class="position">
            <el-button type="primary" v-if="model === 'view'" @click="cancel()">关闭</el-button>
            <el-button v-else @click="cancel()">取消</el-button>
            <el-button v-if="model !== 'view'" type="primary" @click="confirm()">确定</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, onMounted, ref, getCurrentInstance } from 'vue';
import DatePicker from '@/components/DatePicker/index.vue';
import tableConfig from './table.config';
import TablePanel from '@/components/TablePanel/index.vue';
import Pagination from '@/components/Pagination/index.vue';
import BasicItemSelector from '@/components/BasicItemSelector/index.vue';
import BatchNumberSelector from '@/components/BatchNumberSelector/index.vue';
import { Dialog } from '@/components/dialogManager/dialogModel';
import _ from 'lodash';
import useStore from '@/store';
import { ElMessage } from 'element-plus';

const { dialogManager } = useStore();
const { proxy }: any = getCurrentInstance();
let dialog: any = ref();

const props = defineProps({
    tableData: {
        type: Object,
        require: false
    },
    model: {
        type: String,
        require: true
    },
    id: {
        type: Number,
        require: false
    },
    appointmentId: {
        type: Number,
        require: false
    }
})

const idCardValidator = (rule: any, value: any, callback: any) => {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入身份证号'))
    } else {
        if (!reg.test(value)) {
            callback(new Error('请输入正确的身份证号(如：432123198912103118)，请使用英文字符格式'))
        } else {
            callback()
        }
    }
}
const phoneValidator = (rule: any, value: any, callback: any) => {
    const reg = /^[1][3, 4, 5, 6, 7, 8][0-9]{9}$/
    if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入手机号'))
    } else {
        if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号'))
        } else {
            callback()
        }
    }
}
const driverCodeValidator = (rule: any, value: any, callback: any) => {
    const reg = /^[1][3, 4, 5, 6, 7, 8][0-9]{9}$/
    if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入手机号'))
    } else {
        if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号'))
        } else {
            callback()
        }
    }
}

const state = reactive({
    listQuery: {
        page: 1,
        limit: 10,
        total: 0
    },
    // 表单对象
    ruleForm: {
        checkMode: 0,
        appointmentUserName: '',
        appointmentTime: '',
        mobile: '',
        idCard: '',
        email: '',
        // 区域
        region: '',
        // 区域id
        regionId: '',
        // 档口
        stall: '',
        // 档口id
        stallId: '',
        gid: '',
        idCardImg: '',
        sampleImg: '',
        remarks: '',
        appointmentCode: '',
        status: '',
        // 批次号
        batchNumber: undefined,
        batchNumberId: '',
        originFrom: '',
        numberPlate: '',
        driverName: '',
        driverCode: '',
        sendTo: '',
        detailList: [] as any
    },
    // 表单验证规格
    rules: {
        appointmentUserName: [
            { required: true, message: '请输入送检人', trigger: 'blur' }
        ],
        appointmentTime: [
            { required: true, message: '请选择预约时间', trigger: 'blur' }
        ],
        mobile: [
            { required: true, validator: phoneValidator, trigger: 'blur' }
        ],
        email: [
            { required: false, message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        idCard: [
            { required: true, validator: idCardValidator, trigger: 'blur' }
        ],
        region: [
            { required: true, message: '请输入区域', trigger: 'blur' }
        ],
        stall: [
            { required: true, message: '请输入档口', trigger: 'blur' }
        ],
        originFrom: [
            { required: true, message: '请输入产地', trigger: 'blur' }
        ],
        numberPlate: [
            { required: true, message: '请输入车牌号码', trigger: 'blur' }
        ],
        driverName: [
            { required: true, message: '请输入司机姓名', trigger: 'blur' }
        ],
        driverCode: [
            { required: true, validator: driverCodeValidator, trigger: 'blur' }
        ],
        sendTo: [
            { required: true, message: '请输入发往地', trigger: 'blur' }
        ]
    },
    formArr1: ['ruleForm1', 'ruleForm2'],
    formArr: ['ruleForm1'],
    uploadUrl: '',
    loading: false,
    // 根据报备批次id 获取的报备批次信息
    batchInfo: [] as any,
    // 添加货品时当前行的数据
    nowRow: '' as any,
    goodsColumns: {} as any
})

const {
    listQuery,
    ruleForm,
    rules,
    formArr1,
    formArr,
    uploadUrl,
    loading,
    batchInfo,
    nowRow,
    goodsColumns
} = toRefs(state);

onMounted(() => {
    state.goodsColumns = tableConfig.goodsColumns1;
    // if (this.model !== 'new') {
    //   // this.ruleForm = _.cloneDeep(this.tableData)
    //   this.$Api.checkAppointment.getItemById({ id: this.id })
    //     .then((res) => {
    //       console.log(res)
    //       this.ruleForm = res.data || []
    //       this.$Api.third.getMerchantInfo({
    //         mrgId: this.ruleForm.stallId
    //       }).then((res) => {
    //         console.log(res)
    //         this.ruleForm.gid = res.data.gid
    //       })
    //     })
    //   this.getList()
    // }
})

// 列表查询
function getList(listQuery?: any) {
    // if (!listQuery) {
    //     listQuery = this.listQuery
    // } else {
    //     this.listQuery.page = listQuery.page
    //     this.listQuery.limit = listQuery.limit
    // }
    // this.$Api.checkAppointment
    //     .queryDetailById({
    //         current: listQuery.page,
    //         pageSize: listQuery.limit,
    //         id: this.id
    //     }).then((res) => {
    //         this.ruleForm.detailList = res.data.data || []
    //         this.listQuery.limit = res.data.pageSize
    //         this.listQuery.page = res.data.current
    //         this.listQuery.total = res.data.total
    //     }).catch(() => { })
}

// 添加货品
function addGoodsDialog() {
    const props = {
        gid: state.ruleForm.gid
    }
    // 定义回调事件
    const events = {
        confirm: (formData: any) => {
            console.log(formData);
            console.log(proxy.$refs.table.$refs.table.getRecordset());
            proxy.$refs.table.$refs.table.insertAt(formData, -1);
            state.ruleForm.detailList.push(formData);
            console.log(state.ruleForm.detailList);
            dialogManager.closeDialog(dialog.key);
        },
        cancel: () => {
            console.log('cancel回调函数')
            dialogManager.closeDialog(dialog.key);
        }
    }
    // 定义弹窗配置
    const meta = {
        title: '添加货品',
        width: '30%',
        isShowFooter: false,
        customClass: 'month-report__dialog'
    }
    // 引入弹窗主体组件
    const component = require('./addGoodsDialog.vue').default
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
}

// 表格删除
function handleDel(row: any) {
    proxy.$refs.table.$refs.table.remove(row);
    proxy.ruleForm.detailList = state.ruleForm.detailList.filter(function (item: any) {
        return item !== row;
    })
    console.log(state.ruleForm.detailList);
    console.log(proxy.$refs.table.$refs.table.getRecordset());
}

// 封装验证函数
function checkForm(formName: any) {
    const _self = proxy;
    _self.resultArr = [];
    const result = new Promise<void>(function (resolve, reject) {
        _self.$refs[formName].validate((valid: any) => {
            if (valid) {
                resolve();
            } else {
                reject();
            }
        })
    })
    _self.resultArr.push(result); // push 得到promise的结果
}

// 确认事件
function confirm() {
    const _self = proxy;
    let formRefs = [];
    if (state.ruleForm.checkMode === 0) {
        formRefs = state.formArr;
    } else {
        formRefs = state.formArr1;
    }
    formRefs.forEach(item => {
        _self.checkForm(item);
    })
    // resultArr数组的值必须是promise对象才能使用Promise.all，在checkForm做了这一步
    Promise.all(_self.resultArr).then(() => {
        console.log(state.ruleForm)
        if (state.ruleForm.detailList.length === 0) {
            ElMessage.error('货品不能为空');
            return;
        }
        let isEmpty = false;
        for (let i = 0; i < state.ruleForm.detailList.length; i++) {
            if (state.ruleForm.detailList[i].basicItemName === '' || state.ruleForm.detailList[i].basicItemName === undefined) {
                // this.ruleForm.detailList[i].$refs.basicItemName.style = 'border 1px solid red'
                isEmpty = true;
            }
        }
        if (isEmpty) {
            ElMessage.error('请选择货品检测项目名称');
            return;
        }
        // console.log('提交表格')
        proxy.$attrs.events.confirm(_.cloneDeep(state.ruleForm));
    }).catch(() => {
        return false;
    })
}

// 取消事件
function cancel() {
    proxy.$attrs.events.cancel()
}

function uploadSampleImg(file: any) {
    if (file !== null) {
        const data = new FormData()
        data.append('file', file.raw)
        // this.$Api.upload.upload(data).then((res) => {
        //     this.ruleForm.sampleImg = res.data
        //     return res.data
        // })
    }
}

function uploadIdCardImg(file: any) {
    if (file !== null) {
        const data = new FormData()
        data.append('file', file.raw)
        // this.$Api.upload.upload(data).then((res) => {
        //     this.ruleForm.idCardImg = res.data
        //     return res.data
        // })
    }
}

function selectRegionChange(value: any) {
    if (value === '') {
        state.ruleForm.stall = '';
        state.ruleForm.stallId = '';
        state.ruleForm.batchNumber = undefined;
        state.ruleForm.batchNumberId = '';
        proxy.$refs.table.$refs.table.remove();
        state.ruleForm.gid = '';
        state.nowRow = '';
        state.ruleForm.numberPlate = '';
        state.ruleForm.stall = '';
        // 过海信息
        state.ruleForm.originFrom = '';
        state.ruleForm.numberPlate = '';
        state.ruleForm.driverName = '';
        state.ruleForm.driverCode = '';
        state.ruleForm.sendTo = '';
        return
    }
    state.ruleForm.regionId = value.regId;
    state.ruleForm.region = value.regName;
}

function selectStallChange(value: any) {
    if (value === '') {
        state.ruleForm.batchNumber = undefined;
        state.ruleForm.batchNumberId = '';
        proxy.$refs.table.$refs.table.remove();
        state.ruleForm.gid = '';
        state.nowRow = '';
        state.ruleForm.numberPlate = '';
        state.ruleForm.stall = '';
        // 过海信息
        state.ruleForm.originFrom = '';
        state.ruleForm.numberPlate = '';
        state.ruleForm.driverName = '';
        state.ruleForm.driverCode = '';
        state.ruleForm.sendTo = '';
        return;
    }
    state.ruleForm.stall = value.mrgNumber
    state.ruleForm.stallId = value.mrgId
    // this.$Api.third.getMerchantInfo({
    //     mrgId: value.mrgId
    // }).then((res) => {
    //     console.log(res)
    //     this.ruleForm.gid = res.data.gid
    // })
}

function selectBatchNumberChange(value: any) {
    if (state.ruleForm.batchNumber === undefined) {
        state.ruleForm.originFrom = '';
        state.ruleForm.numberPlate = '';
        state.ruleForm.driverName = '';
        state.ruleForm.driverCode = '';
        state.ruleForm.sendTo = '';
        proxy.$refs.table.$refs.table.remove();
    }
    state.ruleForm.batchNumber = value.incomNum;
    state.ruleForm.batchNumberId = value.incomTid;
    // this.$Api.third.getIncomTrainsInfo({ incomTid: value.incomTid }).then((res) => {
    //     this.ruleForm.originFrom = res.data.origin
    //     this.ruleForm.numberPlate = res.data.trainNum
    //     this.ruleForm.driverName = res.data.shipperName
    //     this.ruleForm.driverCode = res.data.shipperPhone
    //     this.ruleForm.sendTo = res.data.receivingAddress

    //     const newItem = res.data.incomTrainsGoodsList.map(i => {
    //         return {
    //             sampleName: i.goodName,
    //             quantity: i.goodNum,
    //             weight: i.weight,
    //             sampleId: i.goodId,
    //             basicItemName: '',
    //             basicItemId: ''
    //         }
    //     })
    //     this.$refs.table.$refs.table.remove()
    //     newItem.forEach((item) => {
    //         this.$refs.table.$refs.table.insertAt(item, -1)
    //     })
    //     this.ruleForm.detailList = newItem
    // })
}

function selectChange(value: any) {
    state.nowRow.basicItemId = value.id;
    state.nowRow.basicItemName = value.itemName;
}

function getRow(row: any) {
    state.nowRow = row;
}

</script>

<style>
</style>