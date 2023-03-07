<template>
    <div class="refund-dialog-container">
        <el-row>
            <el-col :span="6"></el-col>
            <el-col :span="12">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="auto" justify="middle">
                    <el-form-item label="商户名称">
                        <el-input v-model="ruleForm.merchantName" :disabled="true"> </el-input>
                    </el-form-item>
                    <!--          <el-form-item label="退款类型" prop="payType">-->
                    <!--            <el-input v-model="ruleForm.payType"></el-input>-->
                    <!--          </el-form-item>-->
                    <el-form-item label="账户余额">
                        <span class="accountBalance">￥{{ realAmount }}</span>
                    </el-form-item>
                    <el-form-item label="退款金额" prop="amount">
                        <vxe-input v-model="ruleForm.amount" type="float" min="0.01" step="1"></vxe-input>
                    </el-form-item>
                    <el-form-item label="退款方式" prop="chargeWay">
                        <SelectEnumeration v-model="ruleForm.chargeWay" en="CHARGE_TYPE" :clearable="true"
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
            <el-button type="primary" @click="confirm()">退费</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, onMounted, ref, getCurrentInstance } from 'vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue';

const { proxy }: any = getCurrentInstance();

const props = defineProps({
    realAmount: {
        type: Number || String,
        require: true
    },
    stall: {
        type: String,
        require: true
    }
})

const amountValidator = (rule: any, value: any, callback: any) => {
    console.log(value)
    if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入退费金额'))
    } else {
        if (parseFloat(value) > parseFloat(props.realAmount!.toString())) {
            callback(new Error('退费金额不能大于账户余额'))
        } else {
            callback()
        }
    }
}

const state = reactive({
    // 表单对象
    ruleForm: {
        merchantName: props.stall,
        // payType: 1,
        chargeWay: '',
        amount: props.realAmount,
        remark: ''
    },
    // 表单验证规格
    rules: {
        payType: [
            { required: true, message: '请输入', trigger: 'blur' }
        ],
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
    // 确认事件
    proxy.$refs.ruleForm1.validate((valid: any) => {
        if (valid) {
            proxy.$attrs.events.confirm(state.ruleForm);
        } else {
            console.log('error submit!!');
            return false;
        }
    })
}
// 取消事件
function cancel() {
    proxy.$attrs.events.cancel();
}

</script>

<style lang="scss" scoped>
.refund-dialog-container {
    position: relative;
}

.position {
    float: right;
    margin-right: 25%;
    margin-top: 20px;
}

.accountBalance {
    color: red;
    font-size: 20px;
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
