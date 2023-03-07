<template>
    <div class="collection-dialog-container">
        <el-row>
            <el-col :span="6"></el-col>
            <el-col :span="12">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="auto">
                    <el-form-item label="应收款">
                        <span class="font">￥{{ checkAmount }}</span>
                    </el-form-item>
                    <el-form-item label="已收款">
                        <span class="font">￥{{ realAmount }}</span>
                    </el-form-item>
                    <el-form-item label="本次收款" prop="amount">
                        <vxe-input v-model="ruleForm.amount" type="float" min="0.01" step="1"></vxe-input>
                    </el-form-item>
                    <el-form-item label="支付方式" prop="chargeWay">
                        <SelectEnumeration v-model="ruleForm.chargeWay" en="CHECK_TYPE" :clearable="true"
                            placeholder="请选择" />
                    </el-form-item>
                    <div class="notes">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="ruleForm.remark" :rows="5" type="textarea" placeholder="请输入" />
                        </el-form-item>
                    </div>
                </el-form>
            </el-col>
        </el-row>

        <div class="position">
            <el-button @click="cancel()">取消</el-button>
            <el-button type="primary" @click="confirm()">缴费</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, onMounted, ref, getCurrentInstance } from 'vue';
import DatePicker from '@/components/DatePicker/index.vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue';

const { proxy }: any = getCurrentInstance();

const props = defineProps({
    checkAmount: {
        type: Number || String,
        require: true
    },
    realAmount: {
        type: Number || String,
        require: true
    }
})

const amountValidator = (rule: any, value: any, callback: any) => {
    console.log(value)
    if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入缴费金额'))
    } else {
        if (parseFloat(value) > parseFloat(this.checkAmount)) {
            callback(new Error('收款金额不能大于应收金额'))
        } else {
            callback()
        }
    }
}

const state = reactive({
    // 表单对象
    ruleForm: {
        amount: props.checkAmount! - props.realAmount!,
        chargeWay: '',
        remark: ''
        // payType: 0
    },
    // 表单验证规格
    rules: {
        amount: [
            { required: true, validator: amountValidator, trigger: 'blur' }
        ],
        chargeWay: [
            { required: true, message: '请选择支付方式', trigger: 'blur' }
        ]
    }
})

const { ruleForm, rules } = toRefs(state);

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


</script>

<style lang="scss" scoped>
.collection-dialog-container {
    position: relative;
}

.position {
    float: right;
    margin-right: 25%;
    margin-top: 20px;
}

.font {
    color: red;
    font-size: 20px;
    margin-left: 3%;
}

.notes .el-form-item {
    display: block;
}

:deep(.el-form-item__label-wrap .el-form-item__label) {
    display: inline;
}

.vxe-input {
    width: 100%;
}
</style>