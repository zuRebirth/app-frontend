<template>
    <div class="status-dialog-container">
        <el-card shadow="never" class="add">
            <el-row type="flex" :gutter="20">
                <el-col :span="10">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="130px">
                        <el-form-item label="送检方式" prop="checkMode">
                            <el-radio-group v-model="ruleForm.checkMode" :disabled="model === 'view'">
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
                        <!-- <el-form-item label="身份证号" prop="idCard">
                            <el-input placeholder="请输入" v-model="ruleForm.idCard" :disabled="model === 'view'">
                            </el-input>
                        </el-form-item> -->
                        <!-- <el-form-item label="身份证照片" prop="idCardImg">
                            <div>
                                <el-upload :disabled="model === 'view'" class="avatar-uploader" :action="uploadUrl"
                                    :show-file-list="false" drap accept=".jpg, .jpeg, .png" :on-change="uploadIdCardImg"
                                    :auto-upload="false">
                                    <img v-if="ruleForm.idCardImg" :src="ruleForm.idCardImg" class="avatar" />
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <plus />
                                    </el-icon>
                                </el-upload>
                            </div>
                        </el-form-item> -->
                        <!-- <el-form-item label="样品照片" prop="sampleImg">
                            <el-upload :disabled="model === 'view'" class="avatar-uploader" :action="uploadUrl"
                                :show-file-list="false" drap accept=".jpg, .jpeg, .png" :on-change="uploadSampleImg"
                                :auto-upload="false">
                                <img v-if="ruleForm.sampleImg" :src="ruleForm.sampleImg" class="avatar" />
                                <el-icon v-else class="avatar-uploader-icon">
                                    <plus />
                                </el-icon>
                            </el-upload>
                        </el-form-item> -->
                        <el-form-item label="备注" prop="remarks">
                            <el-input v-if="model === 'edit'" :disabled="model === 'view'" v-model="ruleForm.remarks"
                                :rows="5" type="textarea" placeholder="请输入" />
                            <el-input v-else :disabled="model === 'view'" v-model="ruleForm.remarks" :rows="5"
                                type="textarea"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="10" v-show="model === 'edit' || model === 'view'">
                    <el-form label-width="100px" :rules="rules">
                        <el-form-item label="预约编号">
                            <el-input v-model="ruleForm.appointmentCode" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="样品状态">
                            <SelectEnumeration disabled v-model="ruleForm.status" en="SAMPLE_TYPE" />
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-if="model === 'edit'" placeholder="请输入" v-model="ruleForm.email"
                                :disabled="model === 'view'"></el-input>
                            <el-input v-else v-model="ruleForm.email" :disabled="model === 'view'"></el-input>
                        </el-form-item>
                        <el-form-item label="区域" prop="region">
                            <el-input v-model="ruleForm.region" :disabled="model === 'view'" placeholder="请输入" />
                        </el-form-item>
                        <el-form-item label="档口" prop="stall">
                            <el-input v-model="ruleForm.stall" :disabled="model === 'view'" placeholder="请输入" />
                        </el-form-item>
                    </el-form>
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
                                <!-- <el-button type="primary" @click="addGoodsDialog" v-show="!(model === 'view')">添加货品
                                </el-button> -->
                            </el-row>
                        </el-col>
                    </el-row>
                </template>

                <TablePanel ref="table" :table-columns="goodsColumns" :table-data="ruleForm.detailList">
                    <template #col_basicItemName>
                        <vxe-column title="检测项目" :min-width="100">
                            <template #default="{ row }">
                                <BasicItemSelector :disabled="
                                    ruleForm.batchNumber === undefined || model === 'view'
                                " v-model="row.basicItemName" :modelValue="row.basicItemId"
                                    @selectChange="selectChange" @click="getRow(row)"></BasicItemSelector>
                            </template>
                        </vxe-column>
                    </template>
                    <template #col_weight>
                        <vxe-column title="吨数" :min-width="100">
                            <template #default="{ row }">
                                <vxe-input v-model="row.weight" :disabled="true" type="float" min="0.01" step="1">
                                </vxe-input>
                            </template>
                        </vxe-column>
                    </template>
                    <template #col_quantity>
                        <vxe-column title="件数" :min-width="100">
                            <template #default="{ row }">
                                <vxe-input v-model="row.quantity" :disabled="true" type="number" min="1" step="1">
                                </vxe-input>
                            </template>
                        </vxe-column>
                    </template>
                    <template #col_action>
                        <vxe-column title="操作" :minWidth="100" fixed="right">
                            <template #default="{ row }">
                                <svg-icon class="icon" icon-class="delete" @click="handleDel(row)"
                                    v-show="model !== 'view'" />
                                <!-- <vxe-button icon="iconfont icon-shanchu" type="text" @click="handleDel(row)"
                                    :disabled="model === 'view'" /> -->
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
        </el-card>
        <div class="position">
            <el-button type="primary" v-if="model === 'view'" @click="cancel()">关闭</el-button>
            <el-button v-else @click="cancel()">取消</el-button>
            <!-- <el-button v-if="model !== 'view'" type="primary" @click="confirm()">确定</el-button> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import SvgIcon from '@/components/SvgIcon/index.vue';
import DatePicker from '@/components/DatePicker/index.vue';
import tableConfig from './table.config';
import TablePanel from '@/components/TablePanel/index.vue';
import Pagination from '@/components/Pagination/index.vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue';
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import { PageQueryParam } from '@/types/api/base';
import {
    checkAppintmentDetailList,
    checkAppintmentDetail,
    checkAppintmentDetailDelete
} from '@/api/service/checkappointment';

const { proxy }: any = getCurrentInstance();

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
});

const idCardValidator = (rule: any, value: any, callback: any) => {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入身份证号'))
    } else {
        if (!reg.test(value)) {
            callback(new Error('请输入正确的身份证号'))
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
    queryParams: {
        current: 1,
        pageSize: 10
    } as PageQueryParam,
    total: 0,
    // 表单对象
    ruleForm: {
        checkMode: 0,
        appointmentUserName: '',
        appointmentTime: '',
        mobile: '',
        idCard: '',
        email: '',
        region: '',
        stall: '',
        idCardImg: '',
        sampleImg: '',
        remarks: '',
        appointmentCode: '',
        status: '',
        batchNumber: '',
        originFrom: '',
        numberPlate: '',
        driverName: '',
        driverCode: '',
        sendTo: '',
        detailList: [] as any
    } as any,
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
    goodsColumns: {} as any
})

const {
    queryParams,
    total,
    ruleForm,
    rules,
    formArr1,
    formArr,
    goodsColumns
} = toRefs(state);

onMounted(() => {
    state.goodsColumns = tableConfig.goodsColumns1
    if (props.model !== 'new') {
        //state.ruleForm = _.cloneDeep(props.tableData);
        checkAppintmentDetail(
            props.id
        )
            .then(({ data }) => {
                //console.log(data);
                state.ruleForm = data || [];
            })
        handleQuery();
    }
})

// 列表查询
function handleQuery() {
    checkAppintmentDetailList({
        ...state.queryParams,
        id: props.id
    })
        .then(({ data }) => {
            //console.log(data);
            state.ruleForm.detailList = data.data || [];
            //console.log(state.ruleForm.detailList)
            state.queryParams.pageSize = data.pageSize;
            state.queryParams.current = data.current;
            state.total = data.total;
        })
}

// 表格删除
function handleDel(row: any) {
    checkAppintmentDetailDelete({
        ...state.queryParams,
        id: row.id
    }).then(() => {
        handleQuery();
    })
}

// 封装验证函数
function checkForm(formName: any) {
    const _self = proxy;
    _self.resultArr = []
    const result = new Promise<void>(function (resolve, reject) {
        _self.$refs[formName].validate((valid:any) => {
            if (valid) {
                resolve()
            } else { reject() }
        })
    })
    _self.resultArr.push(result) // push 得到promise的结果
}

function cancel() {
    proxy.$attrs.events.cancel();
}

</script>

<style>
</style>