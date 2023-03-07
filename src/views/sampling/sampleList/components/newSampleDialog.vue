<template>
    <div class="header">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="80px">
            <el-row :gutter="12">
                <el-col :span="15">
                    <!-- <el-form-item label="样品名称" prop="sampleName">
                        <SampleNameSelector v-model="ruleForm.sampleName" :gid="gid"></SampleNameSelector>
                    </el-form-item> -->
                    <el-form-item label="检测项目" prop="basicItemId">
                        <BasicItemSelector v-model="ruleForm.basicItemName" :modelValue="ruleForm.basicItemId"
                            @selectChange="selectChange"></BasicItemSelector>
                    </el-form-item>
                    <el-form-item label="进货数量" prop="quantityIn" style="position: reletive">
                        <vxe-input v-model="ruleForm.quantityIn" min="0.01" type="float" step="1" clearable></vxe-input>
                        <div class="unit unit1">KG</div>
                    </el-form-item>
                    <el-form-item label="样品数量" prop="quantitySample">
                        <vxe-input v-model="ruleForm.quantitySample" min="0.01" type="float" step="1" clearable>
                        </vxe-input>
                        <div class="unit">G</div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="form-button">
            <el-button type="default" @click="cancel()">取消</el-button>
            <el-button v-if="model !== 'view'" type="primary" @click="confirm()">确定</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { reactive, toRefs, getCurrentInstance, onMounted } from 'vue';
import SampleNameSelector from '@/components/SampleNameSelector/index.vue';
import BasicItemSelector from '@/components/BasicItemSelector/index.vue';

const { proxy }: any = getCurrentInstance();

const props = defineProps({
    gid: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        require: true
    }
});

const state = reactive({
    gid: props.gid,
    model: props.model,
    // 表单对象
    ruleForm: {
        sampleName: '测试样品',
        basicItemName: '',
        basicItemId: '',
        quantityIn: '',
        quantitySample: ''
    },
    // 表单验证规格
    rules: {
        sampleName: [
            { required: true, message: '请选择', trigger: 'blur' }
        ],
        basicItemId: [
            { required: true, message: '请选择', trigger: 'blur' }
        ],
        quantityIn: [
            { required: true, message: '请填写', trigger: 'blur' }
        ],
        quantitySample: [
            { required: true, message: '请填写', trigger: 'blur' }
        ]
    }
});

const { gid, ruleForm, rules, model } = toRefs(state);

onMounted(() => {

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

function selectChange(value: any) {
    state.ruleForm.basicItemId = value.id;
    state.ruleForm.basicItemName = value.itemName;
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