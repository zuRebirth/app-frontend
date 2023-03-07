<script lang="ts">
export default {
  name: 'price'
};
</script>

<template>
  <!-- <div>
    <el-button @click="openDialog">测试弹窗</el-button>
  </div> -->
  <div class="scheduleArrears">
    <el-card shadow="never">
      <el-form ref="queryFormRef" :inline="true" :model="queryForm">
        <el-form-item label="启用人" prop="enbledBy">
          <el-input v-model="queryForm.enbledBy" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="是否启用" prop="isEnabled">
          <SelectEnumeration v-model="queryForm.isEnabled" en="OPEN_TYPE" :clearable="true" />
        </el-form-item>

        <el-form-item class="right">
          <el-button type="primary" @click="handleQuery()">查询</el-button>
          <el-button @click="resetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <template #header class="clearfix">
        <el-row align="middle">
          <el-col :span="12">
            <el-row justify="start">
              <h3>预约单价列表</h3>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row justify="end">
              <el-button type="primary" @click="newDialog()">新增</el-button>
              <el-button type="danger" @click="deleteAllList">删除</el-button>
            </el-row>
          </el-col>
        </el-row>
      </template>

      <TablePanel :maxHeight="550" :table-columns="tableColumns" :table-data="tableData" ref="dataTableRef"
        @selectionChange="selectionChange">

        <!-- 自定义列-->
        <template #col_checkMethod>
          <vxe-column title="检验方式" :min-width="100" fixed="left">
            <template #default="{ row }">
              {{ row.checkMethod === 0 ? '送检' : '抽检' }}
            </template>
          </vxe-column>
        </template>

        <template #col_isEnabled>
          <vxe-column title="是否启用" :min-width="150">
            <template #default="{ row }">
              <el-switch v-model="row.isEnabled" active-color="#13ce66" @change="changeEnabled(row)">
              </el-switch>
            </template>
          </vxe-column>
        </template>

        <template #col_action>
          <vxe-column title="操作" :width="200" fixed="right">
            <template #default="{ row }">
              <el-tooltip class="item" effect="dark" content="查看明细" placement="top">
                <svg-icon class="icon" icon-class="view" @click="viewDialog(row)" />
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <svg-icon class="icon" icon-class="edit" @click="editDialog(row)" />
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <svg-icon class="icon" icon-class="delete" @click="handleDel(row)" />
              </el-tooltip>
              <el-tooltip effect="dark" content="查看修改历史" placement="top">
                <svg-icon class="icon" icon-class="iconmonstr-time-17" @click="viewHistoryDialog(row)" />
              </el-tooltip>
            </template>
          </vxe-column>
        </template>
      </TablePanel>

      <el-row align="middle">
        <el-col :span="12">
          <el-row justify="start">
            <pagination v-if="total > 0" :total="total" v-model:page="queryParams.current"
              v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import Pagination from '@/components/Pagination/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import TablePanel from '@/components/TablePanel/index.vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue';
import dayjs from 'dayjs';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { computed, onMounted, onUnmounted, reactive, ref, toRefs, getCurrentInstance } from 'vue';
import { Dialog } from '@/components/dialogManager/dialogModel';
import useStore from '@/store';
import { 
  basicPriceList, 
  basicPriceInsert, 
  basicPriceDelete, 
  basicPriceEdit,
  basicPriceEnbled 
} from '@/api/service/basic';
import { basicPriceQueryParams } from '@/types/api/basicprice';
import { PageQueryParam } from '@/types/api/base';
// import component from './demoDialog.vue'

const id = ref(1);
let dialog: any = ref();
const queryFormRef = ref(ElForm);
const { dialogManager } = useStore();
const { proxy }: any = getCurrentInstance();

const state = reactive({
  // 当前启用的数量
  enableNum: '',
  // 选中的启用id数组对象
  selectEnable: [] as any,
  // 选中的id
  selectIds: [] as any,
  queryParams: {
    current: 1,
    pageSize: 10
  } as PageQueryParam,
  total: 0,
  // 查询表单
  queryForm: {
    enbledBy: undefined,
    isEnabled: undefined,
    startTime: undefined,
    endTime: undefined
  } as basicPriceQueryParams,
  tableData: [] as any,
  title: '',
  // 表格设置
  tableColumns: [
    { type: 'checkbox', width: 40, fixed: 'left' },
    { slot: 'col_checkMethod' },
    { field: 'unitPrice', title: '价格(元)', minWidth: 80 },
    { field: 'batchNumber', title: '计费批次样品数(个/每批)', minWidth: 170 },
    { field: 'createTime', title: '创建时间', minWidth: 150 },
    { field: 'enbledBy', title: '启用人', minWidth: 100 },
    { field: 'enbledTime', title: '启用时间', minWidth: 150 },
    { slot: 'col_isEnabled' },
    { slot: 'col_action' }
  ],
  // 历史查询记录
  historyData: [] as any
})

const {
  enableNum,
  selectEnable,
  selectIds,
  queryParams,
  total,
  queryForm,
  tableData,
  title,
  tableColumns,
  historyData
} = toRefs(state);

onMounted(() => {
  resetQuery();
})

function init() {
};
// 列表查询
function handleQuery() {
  basicPriceList({
    ...state.queryParams,
    ...state.queryForm
  }).then(({ data }) => {
    // console.log('basic');
    console.log(data);
    state.queryParams.current = data.page;
    state.queryParams.pageSize = data.limit;
    state.total = data.total;
    state.tableData = data.data || [];
  });
};

// 日期转换
function handleDateChange(val: any) {
  if (val[0]) {
    state.queryForm.startTime = dayjs(val[0]).format('YYYY-MM-DD');
  }
  if (val[1]) {
    state.queryForm.endTime = dayjs(val[1]).format('YYYY-MM-DD');
  }
};

// 重置查询表单
function resetQuery() {
  queryFormRef.value.resetFields();
  // console.log('queryForm.value', queryForm.value)
  handleQuery();
}


// 删除
async function handleDel(row: any) {
  if (row.isEnabled === true) {
    await ElMessage.error('启用的预约单价不可删除');
  } else {
    try {
      await ElMessageBox.confirm('确定删除？');
      let Del: any = [];
      Del.push(row.id);
      await basicPriceDelete(Del);
      ElMessage.success('删除成功');
      handleQuery();
    } catch (error) {
      //console.log(error)
    }
  }
};

// 批量删除
async function deleteAllList() {
  console.log(state.selectIds)
  if (state.selectIds.length === 0) {
    ElMessage.error('请勾选删除数据项');
    return;
  } else {
    try {
      state.selectIds.forEach((item: any) => {
        state.tableData.forEach((ele: any) => {
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
      //在vue中，await是等待的意思，await关键字只能放在async函数里，
      // await配合async一起使用，相当于把异步函数变成了同步，
      // await会等待后面表达式的返回结果之后才执行下一步。
      await basicPriceDelete(state.selectIds);
      ElMessage.success('删除成功');
      handleQuery();
    } catch (error: any) {
      if (error === 'cancel') {
        return
      }
      ElMessage.error(error);
    }
  }
}

// 编辑
function editDialog(row: any) {
  const props = {
    // 表单数据
    rowData: row,
    // model 弹窗状态 view: 查看, edit: 编辑
    model: 'edit'
  }
  // 定义回调事件
  const events = {
    confirm: (formData: any) => {
      formData.id = row.id;
      formData.updateBy = 'admin';
      basicPriceEdit({
        ...formData,
      })
        .then(({ data }) => {
          ElMessage({
            message: '修改成功',
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
  }
  // 定义弹窗配置
  const meta = {
    title: '编辑',
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
};

// 查看列表
function viewDialog(row: any) {
  const props = {
    // 表单数据
    rowData: row,
    // model 弹窗状态 viewData: 查看, edit: 编辑
    model: 'viewData'
  }
  // 定义回调事件
  const events = {
    cancel: () => {
      console.log('cancel回调函数');
      dialogManager.closeDialog(dialog.key);
    }
  }
  // 定义弹窗配置
  const meta = {
    title: '编辑',
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

// 查看历史记录弹窗
function viewHistoryDialog(row: any) {
  const props = {
    // 表单数据
    id: row.id
  }
  // 定义回调事件
  const events = {
    confirm: () => {
      console.log('confirm回调函数')
    },
    cancel: () => {
      console.log('cancel回调函数')
      dialogManager.closeDialog(dialog.key);
    }
  }
  // 定义弹窗配置
  const meta = {
    title: '预约单价修改历史',
    width: '40%',
    isShowFooter: false,
    customClass: 'month-report__dialog'
  };
  // 引入弹窗主体组件
  const component = require('./components/viewHistoryDialog.vue').default;
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
};

// 新增列表
function newDialog() {
  const props = {
    model: 'new'
  };
  // 定义回调事件
  const events = {
    confirm: (formData: any) => {
      //console.log('confirm回调函数', formData);
      basicPriceInsert({
        ...formData
      })
        .then(({ data }) => {
          ElMessage({
            message: '保存成功',
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
};

// 更新状态(单个启用)
function changeEnabled(row: any) {
  basicPriceEnbled({
    id: row.id,
    isEnabled: row.isEnabled
  }).then(({data}) => {
    //console.log(data);
    ElMessage.success('更新成功');
    handleQuery();
  })
}
// checkbox 选中事件 返回选中的id
function selectionChange(records: any) {
  state.selectIds = records.map((row: any) => row.id);
  console.log(state.selectIds);
}

function openDialog() {
  // 定义传参，这里为凸显每次点击后不同设置id自加1
  const props = {
    id: id.value++
  };
  console.log(id.value)
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
    width: 500,
    bodyHeight: 300,
    // isDestroyByClose: true
    isShowFooter: false,
    customClass: 'month-report__dialog'
  };
  // 引入弹窗主体组件
  const component = require("./demoDialog.vue").default
  dialog = new Dialog(component, props, events, meta);
  dialogManager.addDialog(dialog);
  dialogManager.openDialog(dialog.key);
}

onUnmounted(() => {
  // 组件销毁时记得同时销毁弹窗
  dialogManager.removeDialog(dialog.key);
});
</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
}

.el-form {
  margin-top: 20px;
}

.scheduleArrears {
  position: relative;
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
