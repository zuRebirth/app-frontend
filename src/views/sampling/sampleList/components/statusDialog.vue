<template>
    <div class="header">
        <el-form ref="ruleForm1" :model="ruleForm" :rules="rules" label-width="auto">
            <el-row :gutter="20">
                <el-col :span="2"></el-col>
                <el-col :span="8">
                    <el-form-item label="检测结果">
                        <div>
                            <i v-if="
                                (ruleForm.checkResult === 0 &&
                                    ruleForm.recheckResult === 2) ||
                                ruleForm.recheckResult === 0
                            " class="icon iconfont icon-buhege-">
                            </i>
                            <i v-else-if="
                                ruleForm.checkResult === 1 || ruleForm.recheckResult === 1
                            " class="icon iconfont icon-hege1">
                            </i>
                            <span v-else-if="ruleForm.checkResult === 2">
                                <el-tag type="warning">未检测</el-tag>
                            </span>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="3"></el-col>
                <el-col :span="8">
                    <el-form-item label="收样时间" style="font-weight: bold">
                        {{ ruleForm.receiveTime }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="2"></el-col>
                <el-col :span="8">
                    <el-form-item label="样品编号">
                        <el-input v-model="ruleForm.sampleCode" :disabled="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="3"></el-col>
                <el-col :span="8">
                    <el-form-item label="收样人">
                        <el-input v-model="ruleForm.receiveBy" :disabled="true" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="2"></el-col>
                <el-col :span="8">
                    <el-form-item label="区域" prop="region">
                        <el-input v-model="ruleForm.region"
                            :disabled="model === 'view' || ruleForm.checkResult !== 2" />
                    </el-form-item>
                </el-col>
                <el-col :span="3"></el-col>
                <el-col :span="8">
                    <el-form-item label="档口" prop="stall">
                        <el-input v-model="ruleForm.stall" :disabled="model === 'view' || ruleForm.checkResult !== 2" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="2"></el-col>
                <el-col :span="8">
                    <el-form-item label="批次号">
                        <el-input v-model="ruleForm.batchNumber"
                            :disabled="model === 'view' || ruleForm.checkResult !== 2" />
                    </el-form-item>
                </el-col>
                <el-col :span="3"></el-col>
                <el-col :span="8">
                    <el-form-item label="车牌号码">
                        <el-input v-model="ruleForm.numberPlate"
                            :disabled="model === 'view' || ruleForm.checkResult !== 2" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="2"></el-col>
                <el-col :span="8">
                    <el-form-item label="货品" prop="sampleName">
                        <el-input v-model="ruleForm.sampleName"
                            :disabled="model === 'view' || ruleForm.checkResult !== 2" />
                    </el-form-item>
                </el-col>
                <el-col :span="2"></el-col>
                <el-col :span="9">
                    <el-form-item label="进货时间" prop="restockTime" label-width="105px">
                        <el-date-picker v-model="ruleForm.restockTime" type="datetime" placeholder="选择日期"
                            value-format="YYYY-MM-DD hh:mm:ss"
                            :disabled="model === 'view' || ruleForm.checkResult !== 2" style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8" :offset="2">
                    <el-form-item label="检测项目" prop="basicItemName">
                        <BasicItemSelector :disabled="model === 'view' || ruleForm.checkResult !== 2"
                            v-model="ruleForm.basicItemName" :modelValue="ruleForm.basicItemId"
                            @selectChange="selectChange"></BasicItemSelector>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="2"></el-col>
                <el-col :span="8">
                    <el-form-item label="进货数量" prop="quantityIn" style="position: reletive">
                        <vxe-input v-model="ruleForm.quantityIn" type="float"
                            :disabled="model === 'view' || ruleForm.checkResult !== 2" step="10" min="0.01" />
                        <div class="unit unit1">KG</div>
                    </el-form-item>
                </el-col>
                <el-col :span="3"></el-col>
                <el-col :span="8">
                    <el-form-item label="样品数量" prop="quantitySample" style="position: reletive">
                        <vxe-input v-model="ruleForm.quantitySample" type="float"
                            :disabled="model === 'view' || ruleForm.checkResult !== 2" step="10" min="0.01" />
                        <div class="unit">G</div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="border-box">
            <span class="title">初检</span>
            <el-form ref="ruleForm2" :model="ruleForm" label-width="auto">
                <el-row :gutter="20" class="paddingBorder">
                    <el-col :span="1"></el-col>
                    <el-col :span="7">
                        <el-form-item label="初检数据" style="position: reletive" label-width="auto">
                            <vxe-input v-if="model === 'view' || ruleForm.checkResult !== 2"
                                v-model="ruleForm.checkData" :disabled="true" />
                            <vxe-input v-else-if="ruleForm.basicItemType === 0" placeholder="请输入"
                                v-model="ruleForm.checkData" :disabled="model === 'view'" type="float" min="0.01"
                                step="1.0" />
                            <BasicItemValuesSelector v-else-if="ruleForm.basicItemType === 1"
                                v-model="ruleForm.checkData" :id="ruleForm.basicItemId"
                                :disabled="model === 'view' || ruleForm.checkResult !== 2"></BasicItemValuesSelector>
                            <div class="unit" v-show="ruleForm.basicItemType === 0">{{ ruleForm.unit }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="初检通道">
                            <el-input v-if="model === 'view' || ruleForm.checkResult !== 2"
                                v-model="ruleForm.checkChannel" :disabled="true" />
                            <el-input v-else placeholder="请输入" v-model="ruleForm.checkChannel"
                                :disabled="model === 'view'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="抑制率">
                            <vxe-input v-if="model === 'view' || ruleForm.checkResult !== 2"
                                v-model="ruleForm.checkInhibitionRatio" :disabled="true" type="float" min="0.01"
                                max="100" step="1.0" />
                            <vxe-input v-else type="float" placeholder="请输入" v-model="ruleForm.checkInhibitionRatio"
                                :disabled="model === 'view' || ruleForm.checkResult === 1" min="0.01" max="100"
                                step="1.0" />
                            <div class="unit">%</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div class="border-box">
            <span class="title">复检</span>
            <el-form ref="ruleForm3" :model="ruleForm" label-width="auto">
                <el-row :gutter="20" class="paddingBorder">
                    <el-col :span="1"></el-col>
                    <el-col :span="7">
                        <el-form-item label="复检数据" style="position: reletive">
                            <vxe-input
                                v-if="model === 'view' || ruleForm.checkResult !== 0 || ruleForm.recheckResult !== 2"
                                v-model="ruleForm.recheckData" :disabled="true" />
                            <vxe-input v-else-if="ruleForm.basicItemType === 0" v-model="ruleForm.recheckData"
                                :disabled="model === 'view'" placeholder="请输入" type="float" min="0.01" step="1.0" />
                            <BasicItemValuesSelector v-else-if="ruleForm.basicItemType === 1"
                                v-model="ruleForm.recheckData" :id="ruleForm.basicItemId" :disabled="model === 'view'">
                            </BasicItemValuesSelector>
                            <div class="unit" v-show="ruleForm.basicItemType === 0">{{ ruleForm.unit }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="复检通道">
                            <el-input
                                v-if="model === 'view' || ruleForm.checkResult !== 0 || ruleForm.recheckResult !== 2"
                                v-model="ruleForm.recheckChannel" :disabled="true" />
                            <el-input v-else v-model="ruleForm.recheckChannel" :disabled="model === 'view'"
                                placeholder="请输入" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="抑制率">
                            <vxe-input
                                v-if="model === 'view' || ruleForm.checkResult !== 0 || ruleForm.recheckResult !== 2"
                                type="float" v-model="ruleForm.recheckInhibitionRatio" :disabled="true" min="0.01"
                                max="100" step="1.0" />
                            <vxe-input v-else type="float" v-model="ruleForm.recheckInhibitionRatio"
                                :disabled="model === 'view'" placeholder="请输入" min="0.01" max="100" step="1.0" />
                            <div class="unit">%</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div class="border-box">
            <span class="title">不合格处理方式</span>
            <el-form ref="ruleForm4" :model="ruleForm" label-width="auto">
                <el-row :gutter="20" class="paddingBorder">
                    <el-col :span="1"></el-col>
                    <el-col :span="14">
                        <el-form-item label="处理方式">
                            <el-input
                                v-if="model === 'view' || ruleForm.checkResult === 1 || ruleForm.recheckResult === 1 || ruleForm.checkResult === 2"
                                v-model="ruleForm.wasteMethod" :disabled="true" />
                            <el-input v-else placeholder="请输入" v-model="ruleForm.wasteMethod"
                                :disabled="model === 'view'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="处理数量" style="position: reletive">
                            <el-input
                                v-if="model === 'view' || ruleForm.checkResult === 1 || ruleForm.recheckResult === 1 || ruleForm.checkResult === 2"
                                v-model="ruleForm.wasteWeight" :disabled="true" />
                            <el-input v-else v-model="ruleForm.wasteWeight" :disabled="model === 'view'"
                                placeholder="请输入" />
                            <div class="unit unit1">KG</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="border-box">
            <span class="title">备注</span>
            <el-form ref="ruleForm5" :model="ruleForm">
                <el-row :gutter="20" class="paddingBorder">
                    <el-col :span="1" />
                    <el-col :span="21">
                        <el-form-item label=" ">
                            <el-input v-if="model === 'view'" type="textarea" :autosize="{ minRows: 3, maxRows: 4 }"
                                v-model="ruleForm.remarks" :disabled="model === 'view'" />
                            <el-input v-else type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" placeholder="请输入"
                                v-model="ruleForm.remarks" :disabled="model === 'view'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" />
                </el-row>
            </el-form>
        </div>
        <div class="form-button edit" v-if="model === 'edit'">
            <el-button type="default" @click="cancel()">取消</el-button>
            <el-button v-if="model !== 'view'" type="primary" @click="confirm()">保存</el-button>
        </div>
        <div class="form-button" style="margin-right: 2%" v-else>
            <el-button v-if="model === 'view'" type="primary" @click="cancel()">关闭</el-button>
            <el-button v-else type="default" @click="cancel()">取消</el-button>
            <el-button v-show="model !== 'view'" type="primary" @click="confirm()">保存</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue';
import BasicItemValuesSelector from '@/components/BasicItemValuesSelector/index.vue';
import BasicItemSelector from '@/components/BasicItemSelector/index.vue';


const { proxy }: any = getCurrentInstance();

const props = defineProps({
    rowData: {
        type: Object,
        require: true
    },
    model: {
        type: String,
        require: true
    }
});

const state = reactive({
    model: props.model,
    // 表单对象
    ruleForm: {
        sampleCode: '',
        sampleName: '',
        restockTime: '',
        receiveBy: '',
        receiveTime: '',
        region: '',
        stall: '',
        batchNumber: '',
        numberPlate: '',
        basicItemName: '',
        basicItemId: '',
        quantityIn: '',
        quantitySample: '',
        checkData: '',
        checkChannel: '',
        checkInhibitionRatio: '',
        recheckData: '',
        recheckChannel: '',
        recheckInhibitionRatio: '',
        wasteMethod: '',
        wasteWeight: '',
        remarks: '',
        checkResult: 0,
        recheckResult: 0,
        basicItemType: 0,
        unit: ''
    } as any,
    // 表单验证规格
    rules: {
        region: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
        stall: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
        sampleName: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
        basicItemName: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
        quantityIn: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
        quantitySample: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
        restockTime: [
            { required: true, message: '请输入', trigger: 'blur' }
        ]
    },
    formArr: ['ruleForm1', 'ruleForm2', 'ruleForm3']
});

const { model, ruleForm, rules, formArr } = toRefs(state);

onMounted(() => {
    if (state.model !== 'new') {
        state.ruleForm = _.cloneDeep(props.rowData);
        console.log(ruleForm)
    }
});

// 取消事件
function cancel() {
    proxy.$attrs.events.cancel();
};
// 确认事件
function confirm() {
    proxy.$refs.ruleForm5.validate((valid: any) => {
        if (valid) {
            proxy.$attrs.events.confirm(_.cloneDeep(state.ruleForm));
        } else {
            return false;
        }
    })
};

function selectChange(value: any) {
    //console.log(value)
    state.ruleForm.basicItemId = value.id;
    state.ruleForm.basicItemName = value.itemName;
};

</script>

<style lang="scss" scoped>
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

:deep(.vxe-input--inner) {
    width: 96%;
}

.border-box {
    width: 95%;
    margin-left: 25px;
    margin-top: 25px;
    border-radius: 10px;
    border: 3px solid #dcdfe6;
    padding: 0 12px 0 0;

    .title {
        position: relative;
        padding: 10px 30px;
        background-color: #ffffff;
        top: -10px;
        left: 10px;
        font-weight: bold;
    }

    .paddingBorder {
        padding: 10px;
    }
}

.unit {
    position: absolute;
    top: 0;
    right: -16px;
    font-weight: bold;
}

.unit1 {
    right: -22px;
}

.edit {
    margin-right: 2%;
}

.vxe-input {
    width: 100%;
}

.icon {
    font-size: 40px;
}

.icon-hege1 {
    color: green;
}

.icon-buhege- {
    color: red;
}
</style>