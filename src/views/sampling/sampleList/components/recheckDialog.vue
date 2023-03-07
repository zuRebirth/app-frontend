<template>
    <div class="header">
        <el-form :model="ruleForm" label-width="80px">
            <el-row>
                <el-col :span="1" />
                <el-col :span="9">
                    <el-form-item label="样品编号">
                        <el-input v-model="ruleForm.sampleCode" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="1" />
                <el-col :span="9">
                    <el-form-item label="货品">
                        <el-input v-model="ruleForm.sampleName" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1" />
                <el-col :span="9">
                    <el-form-item label="检测项目">
                        <el-input v-model="ruleForm.basicItemName" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="recheck">
            <span class="title">复检</span>
            <el-form class="el-form" :model="ruleForm" label-width="80px" ref="ruleForm1">
                <el-row type="flex" :gutter="20" justify="space-around" style="align-items: center">
                    <el-col :span="8">
                        <el-form-item label="复检数据" style="position: reletive">
                            <vxe-input v-if="ruleForm.basicItemType === 0" type="float" min="0.01" step="1"
                                v-model="ruleForm.recheckData" placeholder="请输入"></vxe-input>
                            <SelectEnumeration clearable v-else-if="ruleForm.basicItemType === 1"
                                v-model="ruleForm.recheckData" placeholder="请选择" en="CHECK_DATA" />
                            <div class="unit" v-show="ruleForm.basicItemType === 0">%</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="检测通道">
                            <el-input v-model="ruleForm.recheckChannel" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="抑制率">
                            <vxe-input v-model="ruleForm.recheckInhibitionRatio" placeholder="请输入" type="float"
                                min="0.01" max="100" step="1.0"></vxe-input>
                            <div class="unit">%</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="form-button">
            <el-button type="default" @click="cancel()">取消</el-button>
            <el-button v-if="model !== 'view'" type="primary" @click="confirm()">保存</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { reactive, toRefs, getCurrentInstance, onMounted } from 'vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue';

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
    ruleForm: {
        sampleCode: '',
        sampleName: '',
        basicItemName: '',
        recheckData: '',
        recheckChannel: '',
        recheckInhibitionRatio: '',
        basicItemType : 0
    } as any,
    // 表单验证规格
    rules: {
        itemName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        standard: [
            { required: true, message: '请输入检测依据', trigger: 'blur' }
        ],
        valueStandard: [
            { required: true, message: '请输入标准值', trigger: 'blur' }
        ],
        valueMax: [
            { required: true, message: '请输入最大值', trigger: 'blur' }
        ],
        valueMin: [
            { required: true, message: '请输入最小值', trigger: 'blur' }
        ]
    }
});

const { model, rules, ruleForm } = toRefs(state);

onMounted(() => {
    state.ruleForm = _.cloneDeep(props.rowData);
    //console.log(state.ruleForm)
});

// 取消事件
function cancel() {
    proxy.$attrs.events.cancel();
};
// 确认事件
function confirm() {
    proxy.$refs.ruleForm1.validate((valid: any) => {
        if (valid) {
            proxy.$attrs.events.confirm(_.cloneDeep(state.ruleForm));
        } else {
            return false;
        }
    })
};


</script>

<style lang="scss" scoped>
.header {
    .vxe-input {
        width: 100%;
    }

    .recheck {
        margin-top: 20px;
        padding: 30px 20px;
        border-radius: 10px;
        border: 3px solid #dcdfe6;

        .title {
            position: relative;
            padding: 10px 30px;
            background-color: #ffffff;
            top: -40px;
            left: -15px;
        }

        .el-form {
            height: 40px;
        }

        .unit {
            position: absolute;
            top: 0;
            right: -16px;
            font-weight: bold;
        }
    }
}

.unit {
    position: absolute;
    top: 0;
    right: -16px;
    font-weight: bold;
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
