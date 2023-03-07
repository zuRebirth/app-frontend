<template>
  <div class="dialog-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      ref="ruleForm1"
      style="margin-left: 15%"
    >
      <el-row :gutter="12">
        <el-col :span="15">
          <el-form-item label="检验方式" prop="checkMethod" label-width="auto">
            <el-select v-model="ruleForm.checkMethod" :disabled="true">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="价格"
            prop="unitPrice"
            style="position: reletive"
          >
            <vxe-input
              type="float"
              min="0.01"
              step="1"
              v-model="ruleForm.unitPrice"
              placeholder="请输入价格"
              :disabled="model === 'viewData'"
            ></vxe-input>
            <div class="unit">元</div>
          </el-form-item>
          <el-form-item
            label="计算批次样品数量"
            prop="batchNumber"
            style="position: reletive"
          >
            <vxe-input
              type="number"
              min="1"
              v-model="ruleForm.batchNumber"
              placeholder="请输入"
              :disabled="model === 'viewData'"
            ></vxe-input>
            <div class="unit1">个/每批</div>
          </el-form-item>
          <el-form-item
            label="创建时间"
            prop="createTime"
            v-show="model === 'viewData'"
          >
            <el-input v-model="ruleForm.createTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item
            label="启用人"
            prop="enbledBy"
            v-show="model === 'viewData'"
          >
            <el-input v-model="ruleForm.enbledBy" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item
            label="启用时间"
            prop="enbledTime"
            v-show="model === 'viewData'"
          >
            <el-input v-model="ruleForm.enbledTime" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnabled">
            <el-switch
              v-model="ruleForm.isEnabled"
              active-color="#13ce66"
              :disabled="model === 'viewData'"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="form-button">
      <el-button v-if="model === 'viewData'" type="primary" @click="cancel()"
        >关闭</el-button
      >
      <el-button v-else type="default" @click="cancel()">取消</el-button>
      <el-button v-if="model === 'new'" type="primary" @click="confirm()"
        >确定</el-button
      >
      <el-button
        v-else-if="model !== 'viewData'"
        type="primary"
        @click="confirm()"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { ElMessage } from 'element-plus';

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

const checkBatchNumber = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('样品数不能为空'));
  }
  setTimeout(() => {
    if (!(value | 0)) {
      callback(new Error('请输入整数'));
    } else {
      callback();
    }
  }, 100);
};

const checkUnitPrice = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('价格不能为空'));
  }
  setTimeout(() => {
    // 保留两位小数
    state.ruleForm.unitPrice =
      String(value).match(/^\d*(\.?\d{0,2})/g)![0] || '';
    callback();
  }, 100);
};

const state = reactive({
  rowData: props.rowData,
  model: props.model,
  // 检验方式
  options: [
    {
      value: 0,
      label: '送检'
    },
    {
      value: 1,
      label: '抽检'
    }
  ],
  // 表单对象
  ruleForm: {
    checkMethod: 0,
    unitPrice: '',
    batchNumber: '',
    isEnabled: 'true',
    createTime: '',
    enbledBy: 'admin',
    enbledTime: '',
    createBy: 'admin',
    id: '',
    updateBy: 'admin'
  } as any,
  // 表单验证规格
  rules: {
    unitPrice: [{ validator: checkUnitPrice, trigger: 'blur' }],
    batchNumber: [{ validator: checkBatchNumber, trigger: 'blur' }]
  }
});

const { options, ruleForm, model, rules } = toRefs(state);

onMounted(() => {
  if (state.model !== 'new') {
    state.ruleForm = _.cloneDeep(state.rowData);
    // console.log(props.rowData)
  }
});

// 取消事件
function cancel() {
  proxy.$attrs.events.cancel();
}

// 确认事件
function confirm() {
  proxy.$refs.ruleForm1.validate((valid: any) => {
    //console.log(valid);
    if (valid) {
      proxy.$attrs.events.confirm(state.ruleForm);
      //console.log(state.ruleForm);
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}
</script>

<style lang="scss" scoped>
.dialog-container {
  position: relative;
  padding: 20px;

  .el-select {
    width: 100%;
  }
}

.form-button {
  margin-top: 20px;
  float: right;
}

.unit,
.unit1 {
  position: absolute;
  font-weight: bold;
  top: 0;
}

.unit {
  right: -23px;
}

.unit1 {
  right: -53px;
}

.vxe-input {
  width: 100%;
}
</style>
