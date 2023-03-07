<script lang="ts">
export default {
  name: 'detection'
};
</script>

<template>
  <div class="detiction-concainer">
    <!-- 搜索表单 -->
    <el-card shadow="always">
      <el-form ref="queryFormRef" :inline="true" :model="queryForm">
        <el-form-item label="数据类型" prop="inputType">
          <SelectEnumeration v-model="queryForm.inputType" en="DATA_TYPE" :clearable="true" />
        </el-form-item>
        <el-form-item label="项目名称" prop="itemName">
          <el-input v-model="queryForm.itemName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
          <SelectEnumeration v-model="queryForm.isEnabled" en="OPEN_TYPE" :clearable="true" />
        </el-form-item>
        <el-form-item class="right">
          <el-button type="primary" @click="handleQuery()">查询 </el-button>
          <el-button @click="resetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="always">
      <template #header class="clearfix">
        <el-row :gutter="50" align="middle">
          <el-col :span="12">
            <el-row justify="start">
              <h3>检测项目设置</h3>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row justify="end">
              <el-button type="primary" @click="newDialog()">新增</el-button>
              <!-- <el-button type="success" @click="importFile">导入</el-button>
              <el-button type="warning" @click="outExcel">导出</el-button> -->
              <el-button type="danger" @click="batchDelete">删除</el-button>
            </el-row>
          </el-col>
        </el-row>
      </template>
      <!-- 数据表格-->
      <TablePanel :max-height="550" :table-columns="tableColumns" :table-data="tableData"
        @selectionChange="selectionChange" ref="dataTableRef">
        <!--        自定义列-->
        <template #col_inputType>
          <vxe-column title="数据类型" :min-width="150">
            <template #default="{ row }">
              {{ row.inputType === 0 ? '数值型' : '选项型' }}
            </template>
          </vxe-column>
        </template>

        <template #col_valueStandard>
          <vxe-column title="标准值" :min-width="150">
            <template #default="{ row }">
              <div v-if="row.inputType == 0">
                {{ row.valueStandardOp + row.valueStandard + row.unit }}
              </div>
              <div v-else>
                {{ row.valueStandard }}
              </div>
            </template>
          </vxe-column>
        </template>

        <template #col_isEnable>
          <vxe-column title="是否启用" :min-width="100">
            <template #default="{ row }">
              <el-switch v-model="row.isEnabled" active-color="#13ce66" @change="updateEnable(row)" />
            </template>
          </vxe-column>
        </template>

        <template #col_action>
          <vxe-column title="操作" :width="200" fixed="right">
            <template #default="{ row }">
              <el-tooltip class="item" effect="dark" content="查看明细" placement="top">
                <svg-icon class="icon" icon-class="view" @click="viewDialog(row)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <svg-icon class="icon" icon-class="edit" @click="editDialog(row)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <svg-icon class="icon" icon-class="delete" @click="handleDel(row)" />
              </el-tooltip>
            </template>
          </vxe-column>
        </template>
      </TablePanel>
    </el-card>

    <!-- 分页工具条 -->
    <pagination v-if="total > 0" :total="total" v-model:page="queryParams.current" v-model:limit="queryParams.pageSize"
      @pagination="handleQuery" />
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { toRefs, reactive, onMounted, ref } from 'vue';
import {
  basicItemList,
  basicItemInsert,
  basicItemDelete,
  basicItemEnabled,
  basicItemUpdate
} from '@/api/service/basic';
import { basicItem, basicItemQueryParams } from '@/types/api/basicItem';
import { PageQueryParam } from '@/types/api/base';
import { Dialog } from '@/components/dialogManager/dialogModel';
import _ from 'lodash';
import useStore from '@/store';
// const emit = defineEmits([''])

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const { dialogManager } = useStore();

onMounted(() => {
  handleQuery();
});

let dialog: any = ref();

const state = reactive({
  loading: false,
  // 选中id数组
  selectIds: [] as any[],
  queryForm: {
    inputType: undefined || '',
    itemName: undefined || '',
    isEnabled: undefined || 1
  } as basicItemQueryParams,
  // 分页
  queryParams: {
    current: 1,
    pageSize: 10
  } as PageQueryParam,
  total: 0,
  tableData: [] as basicItem[],
  // 表格设置
  tableColumns: [
    { type: 'checkbox', width: 40, fixed: 'left' },
    { field: 'itemCode', title: '项目编号', minWidth: 150, fixed: 'left' },
    { field: 'itemName', title: '项目名称', minWidth: 150 },
    { slot: 'col_inputType' },
    { slot: 'col_valueStandard' },
    { field: 'standard', title: '检测依据', minWidth: 150 },
    { slot: 'col_isEnable' },
    { slot: 'col_action' }
  ],
  formData: {
    itemCode: undefined,
    itemName: undefined,
    isEnabled: true,
    standard: '',
    inputType: 0,
    valueStandardOp: '',
    valueMax: '',
    valueMin: '',
    valueStandard: '',
    unit: '',
    listTinyItems: []
  },
  model: undefined as any
});

const {
  model,
  queryParams,
  queryForm,
  tableColumns,
  tableData,
  formData,
  selectIds,
  total
} = toRefs(state);

// 重置查询表单
function resetQuery() {
  queryFormRef.value.resetFields();
  // console.log('queryForm.value', queryForm.value)
  handleQuery();
}

// 查询
function handleQuery() {
  // emit('roleClick', {});
  basicItemList({
    ...state.queryParams,
    ...state.queryForm
  }).then(({ data }) => {
    // console.log('basic');
    console.log(data);
    state.queryParams.current = data.page;
    state.queryParams.pageSize = data.limit;
    state.total = data.total;
    state.tableData = data.data || [];
    // console.log(state);
  });
}

// 导入
function importFile() {
  const props = {};
  // 定义回调事件
  const events = {
    confirm: () => {
      console.log('confirm回调函数');
    },
    cancel: () => {
      console.log('cancel回调函数');
      dialogManager.closeDialog(dialog.key);
    }
  };
  // 定义弹窗配置
  const meta = {
    title: '批量导入检测项目',
    width: '40%',
    isShowFooter: false,
    customClass: 'month-report__dialog'
  };
  // 引入弹窗主体组件
  const component = require('./components/importDialog.vue').default;
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
  // dialog = new Dialog(component, props, events, meta);
  // dialogManager.addDialog(dialog);
  dialogManager.openDialog(dialog.key);
}

// 导出
async function outExcel() {
  // 不勾选默认导出所有数据
  if (state.selectIds.length === 0) {
    state.tableData.forEach((item: any) => {
      state.selectIds.push(item.id);
    });
    await ElMessageBox.confirm(`是否确认导出当前查询结果所有数据?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        // state.$Api.excel.basicItemExport(state.selectIds)
        //   .then(function (res) {
        //     excelDownload(res, '检测项目数据.xlsx')
        //   })
      })
      .catch((e: any) => {
        console.log(e);
        ElMessage({
          type: 'info',
          message: '已取消导出'
        });
      });
    state.selectIds = [];
  } else {
    await ElMessageBox.confirm(
      `是否确认导出所勾选${state.selectIds.length}条数据项?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        // state.$Api.excel.basicItemExport(state.selectIds)
        //   .then(function (res) {
        //     excelDownload(res, '检测项目数据.xlsx')
        //   })
      })
      .catch(e => {
        console.log(e);
        ElMessage({
          type: 'info',
          message: '已取消导出'
        });
      });
  }
}

// 批量删除
async function batchDelete() {
  if (state.selectIds.length === 0) {
    ElMessage.error('请勾选删除数据项');
    return;
  }
  try {
    state.selectIds.forEach(item => {
      state.tableData.forEach(ele => {
        if (ele.id === item && ele.isEnabled === true) {
          throw '已启用数据不可删除！';
        }
      });
    });
    await ElMessageBox.confirm(
      `确定删除这${state.selectIds.length}条数据？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    await basicItemDelete(state.selectIds)
      .then(() => {
        ElMessage({
          message: '删除成功',
          type: 'success'
        })
        handleQuery();
      })
  } catch (error: any) {
    if (error === 'cancel') {
      return;
    }
    ElMessage.error(error);
  }
}

// 选中
function selectionChange(records: any) {
  state.selectIds = records.map((row: any) => row.id);
  //console.log(state.selectIds);
}

// 更新启用状态
function updateEnable(row: any) {
  // basicItemEnabled({
  //   id: row.id,
  //   isEnabled: row.isEnabled
  // }).then(() => {
  //   handleQuery();
  //   ElMessage.success('更新成功');
  // })
}

// 新增
function newDialog() {
  const props = {
    model: 'new'
  };
  // 定义回调事件
  const events = {
    confirm: (data: any) => {
      basicItemInsert({
        ...data,
        createBy: "",
        enableBy: "",
        enableTime: ""
      }).then(({data}) => {
        ElMessage({
          message: '新增成功',
          type: 'success'
        })
        handleQuery();
        dialogManager.closeDialog(dialog.key);
      })
    },
    cancel: () => {
      console.log('cancel回调函数');
      dialogManager.closeDialog(dialog.key);
    }
  };
  // 定义弹窗配置
  const meta = {
    title: '新增检测项目',
    width: '40%',
    isShowFooter: false,
    customClass: 'month-report__dialog'
  };
  // 引入弹窗主体组件
  const component = require('./components/statusDialog.vue').default;
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

function viewDialog(row: any) {
  const props = {
    id: row.id,
    // model 弹窗状态 view：查看，edit：编辑
    model: 'view'
  };
  // 定义回调事件
  const events = {
    confirm: () => {
      console.log('confirm回调函数');
    },
    cancel: () => {
      console.log('cancel回调函数');
      dialogManager.closeDialog(dialog.key);
    }
  };
  // 定义弹窗配置
  const meta = {
    title: '新增检测项目',
    width: '40%',
    isShowFooter: false,
    customClass: 'month-report__dialog'
  };
  // 引入弹窗主体组件
  const component = require('./components/statusDialog.vue').default;
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

function editDialog(row: any) {
  const props = {
    id: row.id,
    // model 弹窗状态 view：查看，edit：编辑
    model: 'edit'
  };
  // 定义回调事件
  const events = {
    confirm: (FormData: any) => {
      console.log('confirm回调函数', FormData);
      basicItemUpdate({
        ...FormData
      })
        .then(({ data }) => {
          ElMessage({
            message: '编辑成功',
            type: 'success'
          })
          handleQuery();
          dialogManager.closeDialog(dialog.key);
        })
    },
    cancel: () => {
      //console.log('cancel回调函数');
      dialogManager.closeDialog(dialog.key);
    }
  };
  // 定义弹窗配置
  const meta = {
    title: '编辑检测项目',
    width: '40%',
    isShowFooter: false,
    customClass: 'month-report__dialog'
  };
  // 引入弹窗主体组件
  const component = require('./components/statusDialog.vue').default;
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

async function handleDel(row: any) {
  try {
    await ElMessageBox.confirm('确定删除该条数据？', '警告')
    await basicItemDelete([row.id])
      .then(() => {
        ElMessage({
          message: '删除成功',
          type: 'success'
        })
        handleQuery();
      })
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped lang="scss">
.el-card {
  margin-bottom: 20px;
}

.el-form {
  margin-top: 20px;
}

.right {
  position: absolute;
  right: 5%;
}

.icon {
  cursor: pointer;
  margin: 0 7px;
  border: none;
  font-size: 25px;
}

.icon:hover {
  color: #409eff;
}
</style>
