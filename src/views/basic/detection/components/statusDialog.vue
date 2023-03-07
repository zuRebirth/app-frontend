<template>
  <div class="header">
    <el-form ref="ruleForm1" :model="ruleForm" :rules="rules" label-width="80px">
      <el-row :gutter="12">
        <el-col :span="3" />
        <el-col :span="12">
          <el-form-item label="是否启用" prop="isEnable">
            <el-switch v-model="ruleForm.isEnabled" active-color="#13ce66" :disabled="model === 'view'">
              ></el-switch>
          </el-form-item>
          <el-form-item label="项目编号" prop="itemCode">
            <el-input v-model="ruleForm.itemCode" :disabled="true" />
          </el-form-item>
          <el-form-item label="项目名称" prop="itemName">
            <el-input v-model="ruleForm.itemName" :disabled="model === 'view' || model === 'edit'" ref="sampleName" />
          </el-form-item>
          <el-form-item label="检测依据" prop="standard">
            <el-input v-model="ruleForm.standard" :disabled="model === 'view'" />
          </el-form-item>
          <el-form-item label="数据单位" prop="unit">
            <el-input v-model="ruleForm.unit" :disabled="model === 'view'" />
          </el-form-item>
          <el-form-item label="数据类型" prop="inputType">
            <el-radio-group v-model="ruleForm.inputType" :disabled="model === 'view'">
              <el-radio :label="0">数值型</el-radio>
              <el-radio :label="1">选项型</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-card v-if="ruleForm.inputType === 0" shadow="never" style="width: 80%; margin-left: 10%">
      <el-form ref="ruleForm2" :model="ruleForm" :rules="rules">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="最小值" prop="valueMin">
              <vxe-input v-model="ruleForm.valueMin" type="float" step="1" :disabled="model === 'view'" min="0.01" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大值" prop="valueMax">
              <vxe-input v-model="ruleForm.valueMax" type="float" step="1" :disabled="model === 'view'" min="0.01" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref="ruleForm3" inline :model="ruleForm" :rules="rules">
        <el-row>
          <el-col :span="4">
            <el-form-item label="标准值" prop="valueStandardOp">
              <SelectEnumeration v-model="ruleForm.valueStandardOp" en="OP_TYPE" :clearable="true" size="small"
                :disabled="model === 'view'" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="valueStandard">
              <vxe-input v-model="ruleForm.valueStandard" type="number" min="0.01" :disabled="model === 'view'" />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="value-text">
            <div>判断为<span>合格</span></div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-else-if="ruleForm.inputType === 1" shadow="never" style="width: 80%; margin-left: 10%">
      <div class="addItem" @click="addItemValue" v-show="model !== 'view'"></div>
      <TablePanel ref="table" class="table" :table-columns="tableColumns" :table-data="ruleForm.listTinyItems">
        <template #col_name>
          <vxe-column field="name" title="选项名称" :min-width="100" :edit-render="model === 'view' ? undefined : {}">
            <template #edit="{ row }">
              <vxe-input v-model="row.name" type="text"></vxe-input>
            </template>
          </vxe-column>
        </template>

        <template #col_isQualified>
          <vxe-column title="是否合格" :min-width="100">
            <template #default="{ row }">
              <el-switch v-model="row.isQualified" active-color="#13ce66" :disabled="model === 'view'" />
            </template>
          </vxe-column>
        </template>
        <!--        操作栏-->
        <template #col_action>
          <vxe-column title="操作" fixed="right" :min-width="100">
            <template #default="{ row }">
              <svg-icon class="icon" icon-class="delete" :disabled="model === 'view'" @click="handleDel(row)" />
            </template>
          </vxe-column>
        </template>
      </TablePanel>
    </el-card>
    <div class="form-button">
      <el-button type="primary" @click="cancel()" v-if="model === 'view'">关闭</el-button>
      <el-button type="default" @click="cancel()" v-else>取消</el-button>
      <el-button v-if="model === 'new'" type="primary" @click="confirm()">确定</el-button>
      <el-button v-else-if="model !== 'view'" type="primary" @click="confirm()">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import TablePanel from '@/components/TablePanel/index.vue';
import { ElMessage } from 'element-plus';
import {
  getBasicItemInfo,
  duplicateBasicItem
} from '@/api/service/basic';

const { proxy }: any = getCurrentInstance();

const props = defineProps({
  rowData: {
    type: Object,
    require: true
  },
  model: {
    type: String,
    require: true
  },
  id: {
    type: Number,
    require: false
  }
});

const sampleNameValidator = (rule: any, value: any, callback: Function) => {
  if (value === '' || value === undefined || value === null) {
    callback(new Error('请输入项目名称'));
  } else {
    duplicateBasicItem({ itemName: value })
      .then(({ data }) => {
        if (data === true) {
          callback(new Error('已有相同的检测项目名称'));
        } else {
          callback();
        }
      })

  }
};
const state = reactive({
  model: props.model,
  // 当前是否相同
  isEqual: false,
  // 表单对象
  ruleForm: {
    itemCode: '',
    itemName: '',
    isEnabled: true,
    standard: '',
    inputType: 0,
    valueStandardOp: '',
    valueMax: '',
    valueMin: '',
    valueStandard: '',
    unit: '',
    listTinyItems: [] as any[]
  } as any,
  // 表单验证规格
  rules: {
    itemName: [
      {
        required: true,
        validator: sampleNameValidator,
        trigger: 'blur',
        max: 30
      }
    ],
    standard: [
      { required: true, message: '请输入检测依据', trigger: 'blur', max: 50 }
    ],
    valueStandard: [
      { required: true, message: '请输入标准值', trigger: 'blur' }
    ],
    valueStandardOp: [
      {
        required: false,
        message: '请输入标准值操作符号',
        trigger: 'blur',
        max: 20
      }
    ],
    valueMax: [
      {
        required: true,
        validator: (rule: any, value: any, callback: Function) => {
          if (value === '' || value === undefined || value === null) {
            callback(new Error('请输入最大值'));
          } else {
            if (parseFloat(value) < parseFloat(String(state.ruleForm.valueMin))) {
              callback(new Error('最大值不可小于最小值'));
            } else {
              callback();
            }
          }
        },
        trigger: 'blur'
      }
    ],
    valueMin: [{ required: true, message: '请输入最小值', trigger: 'blur' }]
  },
  formArr1: ['ruleForm1', 'ruleForm2', 'ruleForm3'],
  formArr2: ['ruleForm1'],
  itemValueList: [],
  // 表格设置
  tableColumns: [
    { field: 'no', type: 'seq', title: '序号', minWidth: 60 },
    { slot: 'col_name' },
    { slot: 'col_isQualified' },
    { slot: 'col_action' }
  ] as any[],
  tableIndex: 1
});
const { ruleForm, rules, model, tableColumns } = toRefs(state);

onMounted(() => {
  if (state.model !== 'new') {
    state.ruleForm = _.cloneDeep(props.rowData);
    getBasicItemInfo(props.id).then(({data}) => {
      //console.log(data);
      state.ruleForm = data || [];
    })
  }
})

function cancel() {
  proxy.$attrs.events.cancel();
}
// 封装验证函数
function checkForm(formName: any) {
  const _self = proxy;
  _self.resultArr = [];
  // resolve 挂起 -> 完成
  const result = new Promise<void>(function (resolve, reject) {
    _self.$refs[formName].validate((valid: any) => {
      if (valid) {
        // 成功
        resolve();
      } else {
        // 失败
        reject();
      }
    });
  });
  _self.resultArr.push(result); // push 得到promise的结果
}
// 确认事件
function confirm() {
  //console.log('确认事件')
  const _self = proxy;
  let refsArr = [];
  //console.log(state.formArr1,state.formArr2);
  if (state.ruleForm.inputType === 0) {
    refsArr = state.formArr1;
  } else {
    refsArr = state.formArr2;
    // console.log(_self.$refs.table.$refs.table.getRecordset().insertRecords)
    // console.log(_self.ruleForm.listTinyItems)
    proxy.$refs.table.$refs.table.getRecordset().insertRecords.forEach((item: any) => {
      let exist = false;
      for (let i = 0; i < state.ruleForm.listTinyItems.length; i++) {
        if (
          item.name === state.ruleForm.listTinyItems[i].name &&
          item.isQualified === state.ruleForm.listTinyItems[i].isQualified
        ) {
          exist = true;
        }
      }
      if (!exist) {
        state.ruleForm.listTinyItems.push(item);
      }
    });
  }
  refsArr.forEach(item => {
    _self.checkForm(item);
  });
  // resultArr数组的值必须是promise对象才能使用Promise.all，在checkForm做了这一步
  //console.log(refsArr);
  Promise.all(_self.resultArr)
    .then(() => {
      if (state.ruleForm.inputType === 1) {
        let isQualifiedNum = 0;
        state.ruleForm.listTinyItems.forEach((item: any) => {
          if (item.isQualified === true) {
            isQualifiedNum++;
          }
        });
        if (isQualifiedNum === 0) {
          ElMessage({ message: '没有合格项', type: 'warning' });
          return false;
        } else if (isQualifiedNum > 1) {
          ElMessage({ message: '合格项只能有一个', type: 'warning' });
          return false;
        }
      }
      proxy.$attrs.events.confirm(_.cloneDeep(state.ruleForm));
    })
    .catch(err => {
      console.log(err);
      return false;
    });
}
function handleDel(row: any) {
  console.log(row);
  let item: any = 0;
  for (let i = 0; i < state.ruleForm.listTinyItems.length; i++) {
    if (
      row.name === state.ruleForm.listTinyItems[i].name &&
      row.isQualified === state.ruleForm.listTinyItems[i].isQualified
    ) {
      item = i;
    }
  }
  state.ruleForm.listTinyItems.splice(item, 1);
  proxy.$refs.table.$refs.table.remove(row);
  console.log(proxy.ruleForm.listTinyItems);
}
async function addItemValue() {
  const value = {
    name: '',
    isQualified: true
  };
  const { row: newRow } = await proxy.$refs.table.$refs.table.insertAt(
    value,
    -1
  );
  proxy.$refs.table.$refs.table.setActiveCell(newRow, 'name');
}
</script>

<style lang="scss" scoped>
.form-button {
  margin-top: 20px;
  margin-right: 10%;
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

.vxe-input {
  width: 100%;
}

.addItem {
  position: relative;
  height: 35px;
  width: 35px;
  border-radius: 50%;
  background-color: #67c23a;
  cursor: pointer;
  margin: 6px;
}

.addItem:before {
  content: '+';
  font-weight: bold;
  color: #fff;
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
}

.addItem:hover {
  opacity: 0.5;
}

.icon {
  cursor: pointer;
  margin: 0 7px;
  border: none;
  font-size: 25px;
}
</style>
