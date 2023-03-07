<template>
    <div class="add-goods-dialog-container">
        <el-row>
            <el-col :span="2"></el-col>
            <el-col :span="15">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="80px">
                    <el-form-item label="货品名称" prop="sampleName">
                        <SampleNameSelector v-model="ruleForm.sampleName" :gid="gid"></SampleNameSelector>
                    </el-form-item>
                    <el-form-item label="检测项" prop="basicItemName">
                        <BasicItemSelector v-model="ruleForm.basicItemName" :modelValue="ruleForm.basicItemId"
                            @selectChange="selectChange"></BasicItemSelector>
                    </el-form-item>
                    <el-form-item label="吨数" prop="weight" v-if="checkMode === 1">
                        <vxe-input v-model="ruleForm.weight" type="float" min="0.01" step="1"></vxe-input>
                    </el-form-item>
                    <el-form-item label="件数" prop="quantity" v-if="checkMode === 1">
                        <vxe-input v-model="ruleForm.quantity" type="number" min="1"></vxe-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <div class="position">
            <el-button @click="cancel()">取消</el-button>
            <el-button type="primary" @click="confirm()">确定</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, onMounted, ref, getCurrentInstance } from 'vue';
import SampleNameSelector from '@/components/SampleNameSelector/index.vue';
import BasicItemSelector from '@/components/BasicItemSelector/index.vue';

const { proxy }: any = getCurrentInstance();

const props = defineProps({
    gid: {
        type: Number,
        required: true
    },
    // 送检类型
    checkMode: {
        type: Number,
        required: true
    }
})

const state = reactive({
    // 表单对象
    ruleForm: {
        sampleName: '',
        basicItemId: '',
        basicItemName: '',
        weight: '',
        quantity: ''
    },
    // 表单验证规格
    rules: {} as any,
    rule1: {
        sampleName: [
            { required: true, message: '请选择货品名称', trigger: 'blur' }
        ],
        basicItemName: [
            { required: true, message: '请选择检测项', trigger: 'blur' }
        ],
        weight: [
            { required: true, message: '请输入吨数', trigger: 'blur' }
        ],
        quantity: [
            { required: true, message: '请输入件数', trigger: 'blur' }
        ]
    },
    rule2: {
        sampleName: [
            { required: true, message: '请选择货品名称', trigger: 'blur' }
        ],
        basicItemName: [
            { required: true, message: '请选择检测项', trigger: 'blur' }
        ]
    }
})

const { ruleForm, rules, rule1, rule2 } = toRefs(state);

onMounted(() => {
    state.rules = props.checkMode === 0 ? state.rule2 : state.rule1;
})

// 确认事件
function confirm() {
    proxy.$refs.ruleForm1.validate((valid: any) => {
        if (valid) {
            proxy.$attrs.events.confirm(state.ruleForm);
        } else {
            console.log('error submit!!')
            return false
        }
    })
}

function cancel() {
    proxy.$attrs.events.cancel();
}

function selectChange(value: any) {
    state.ruleForm.basicItemId = value.id;
    state.ruleForm.basicItemName = value.itemName;
}

</script>

<style lang="scss" scoped>
.add-goods-dialog-container {
  position: relative;
}

.position {
  float: right;
  right: 0;
  margin-top: 10px;
}
.vxe-input {
  width: 100%;
}
</style>