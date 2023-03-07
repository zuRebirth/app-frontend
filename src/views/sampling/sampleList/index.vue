<script lang="ts">
export default {
  name: 'sampling'
};
</script>
<template>
  <div class="scheduleArrears">
    <el-card shadow="never">
      <el-form ref="queryFormRef" class="form" :inline="true" :model="queryForm">
        <el-form-item label="样品名称">
          <el-input v-model="queryForm.sampleName" placeholder="支持模糊查询" />
        </el-form-item>
        <el-form-item label="样品编号">
          <el-input v-model="queryForm.sampleCode" placeholder="支持模糊查询" />
        </el-form-item>
        <el-form-item label="收样员">
          <el-input v-model="queryForm.receiveBy" placeholder="支持模糊查询" />
        </el-form-item>
        <el-form-item label="收样时间">
          <DatePicker :start-time="queryForm.receiveTimeStart" :end-time="queryForm.receiveTimeEnd"
            @change="handleDateChange" />
        </el-form-item>

        <!-- <el-form-item label="区域">
          <RegionSelector v-model="queryForm.region" :modelValue="queryForm.regionId"
                        @selectChange="selectRegionChange" placeholder="支持模糊查询"></RegionSelector>
        </el-form-item>

        <el-form-item label="档口">
          <StallSelector v-model="queryForm.stall" :modelValue="queryForm.stallId"
                        @selectChange="selectStallChange" :regId="regionId" placeholder="支持模糊查询">
                    </StallSelector>
        </el-form-item> -->

        <el-form-item label="检测结果">
          <SelectEnumeration v-model="queryForm.checkResult" en="CHECK_END" :clearable="true" />
        </el-form-item>
        <el-form-item class="right">
          <el-button type="primary" @click="handleQuery"> 查询</el-button>
          <el-button @click="resetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <template #header class="clearfix">
        <el-row align="middle">
          <el-col :span="10">
            <el-row justify="start">
              <h3>抽检样品列表</h3>
            </el-row>
          </el-col>
          <el-col :span="13">
            <el-row justify="end">
              <!-- <el-button type="warning" @click="resultOutExcel"
                >导出检验结果公示</el-button
              > -->
              <el-button type="primary" @click="newDialog">新增 </el-button>
              <!-- <el-button type="success" @click="importFile">导入</el-button>
              <el-button type="warning" @click="outExcel">导出</el-button> -->
              <el-button type="danger" @click="batchDelete">删除 </el-button>
            </el-row>
          </el-col>
          <el-col :span="1">
            <vxe-toolbar ref="xToolbar1" custom></vxe-toolbar>
          </el-col>
        </el-row>
      </template>
      <!--      表格-->
      <TablePanel :maxHeight="550" ref="table" :table-columns="tableColumns" :table-data="tableData"
        @selectionChange="selectionChange">
        <!--        自定义列-->
        <template #col_valueStandard>
          <vxe-column title="标准值" :min-width="100" field="valueStandard">
            <template #default="{ row }">
              <span v-if="row.basicItemType === 0">
                {{ row.valueStandardOp + row.valueStandard + row.unit }}</span>
              <span v-if="row.basicItemType === 1">
                {{ row.valueStandard }}</span>
            </template>
          </vxe-column>
        </template>

        <template #col_checkData>
          <vxe-column title="初检数据" :min-width="80" field="checkData">
            <template #default="{ row }">
              <span v-if="row.basicItemType === 0 && row.checkData !== null">{{
                  row.checkData + row.unit
              }}</span>
              <span v-else-if="row.basicItemType === 1">{{
                  row.checkData
              }}</span>
            </template>
          </vxe-column>
        </template>

        <template #col_recheckData>
          <vxe-column title="复检数据" :min-width="100" field="recheckData">
            <template #default="{ row }">
              <span v-if="row.basicItemType === 0" v-show="row.recheckData !== null">{{ row.recheckData + row.unit
              }}</span>
              <span v-else-if="row.basicItemType === 1" v-show="row.recheckData !== null">{{ row.recheckData }}</span>
            </template>
          </vxe-column>
        </template>

        <template #col_checkResult>
          <vxe-column title="检验结果" :min-width="100" field="recheckResult">
            <template #default="{ row }">
              <span v-if="row.recheckResult !== 2">
                <el-tag v-if="row.recheckResult === 0" type="danger">不合格</el-tag>
                <el-tag v-else type="success">合格</el-tag>
              </span>
              <span v-else>
                <el-tag v-if="row.checkResult === 0" type="danger">不合格</el-tag>
                <el-tag v-else-if="row.checkResult === 1" type="success">合格</el-tag>
                <el-tag v-else type="warning">未检测</el-tag>
              </span>
            </template>
          </vxe-column>
        </template>

        <!--        操作栏-->
        <template #col_action>
          <vxe-column title="操作" :minWidth="220" fixed="right" field="action">
            <template #default="{ row }">
              <el-tooltip effect="dark" content="查看明细" placement="top">
                <svg-icon class="icon" icon-class="view" @click="viewDialog(row)" />
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <svg-icon class="icon" icon-class="edit" @click="editDialog(row)" />
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <svg-icon class="icon" icon-class="delete" @click="handleDel(row)" />
              </el-tooltip>
              <el-tooltip effect="dark" content="复检" placement="top">
                <svg-icon class="icon" icon-class="recheck" @click="recheckDialog(row)" />
              </el-tooltip>
            </template>
          </vxe-column>
        </template>
      </TablePanel>
      <el-card>
        <el-row>
          <div class="total">合计</div>
          <div class="total1">
            <strong>进货数量：</strong><span style="color: red">{{ checkSampleTotal.quantityIn }}kg</span>
          </div>
          <div class="total2">
            <strong>样品数量：</strong><span style="color: red">{{ checkSampleTotal.quantitySample }}g</span>
          </div>
        </el-row>
      </el-card>
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
import DatePicker from '@/components/DatePicker/index.vue';
import SelectEnumeration from '@/components/SelectEnumeration/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { getCurrentInstance, reactive, toRefs, onMounted, ref } from 'vue';
import { sampleList, sampleListQueryParams } from '@/types/api/sampleList';
import {
  sampleListQuery,
  sampleTotalQuery,
  addSample,
  batchDeleteSample,
  updateSample,
  reCheckSample
} from '@/api/service/sampleList';
import { PageQueryParam } from '@/types/api/base';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import useStore from '@/store';
import { Dialog } from '@/components/dialogManager/dialogModel';
import { dataTool } from 'echarts';

const queryFormRef = ref(ElForm);
const { proxy }: any = getCurrentInstance();

const { dialogManager } = useStore();
let dialog: any = ref();

const state = reactive({
  // 分页
  queryParams: {
    current: 1,
    pageSize: 10
  } as PageQueryParam,
  // 查询表单
  queryForm: {
    batchNumber: '',
    receiveTimeEnd: '',
    receiveTimeStart: '',
    region: '',
    sampleCode: '',
    sampleName: '',
    stall: '',
    status: 0,
    receiveBy: '',
    checkResult: '',
    stallId: '',
    regionId: ''
  },
  // 表格数据
  tableData: [] as any,
  title: '' as any,
  total: 0,
  // 表格设置
  tableColumns: [
    { type: 'checkbox', width: 40, fixed: 'left' },
    { field: 'sampleCode', title: '样品编号', minWidth: 130, fixed: 'left' },
    { field: 'basicItemName', title: '检测项目', minWidth: 120 },
    { slot: 'col_checkResult' },
    { field: 'sampleName', title: '样品名称', minWidth: 130 },
    { field: 'region', title: '区域', minWidth: 130 },
    { field: 'stall', title: '档口', minWidth: 130 },
    { field: 'batchNumber', title: '批次号', minWidth: 180 },
    { field: 'quantityIn', title: '进货数量（kg）', minWidth: 140 },
    { field: 'quantitySample', title: '样品数量（g）', minWidth: 120 },
    { slot: 'col_valueStandard' },
    { slot: 'col_checkData' },
    { slot: 'col_recheckData' },
    { field: 'receiveBy', title: '收样员', minWidth: 100 },
    { field: 'receiveTime', title: '收样时间', minWidth: 150 },
    { slot: 'col_action' }
  ],
  selectIds: [] as any,
  checkSampleTotal: {
    quantityIn: 0,
    quantitySample: 0
  } as any,
  regionId: '' as any
});

const {
  queryParams,
  queryForm,
  tableData,
  title,
  tableColumns,
  selectIds,
  checkSampleTotal,
  regionId,
  total
} = toRefs(state);

onMounted(() => {
  resetQuery();
  // proxy.$refs.table.connect(proxy.$refs.xToolbar1);
});

// 列表查询
function handleQuery() {
  sampleListQuery({
    ...state.queryParams,
    ...state.queryForm
  }).then(({ data }) => {
    //console.log(data);
    state.queryParams.current = data.page;
    state.queryParams.pageSize = data.limit;
    state.total = data.total;
    state.tableData = data.data || [];
  });
  queryTotal();
}

// 样品列总和
function queryTotal() {
  sampleTotalQuery({
    ...state.queryParams,
    ...state.queryForm
  }).then(({ data }) => {
    state.checkSampleTotal.quantityIn = data.quantityIn;
    state.checkSampleTotal.quantitySample = data.quantitySample;
    //console.log('样品列总和',state.checkSampleTotal);
  });
}

// 日期转换
function handleDateChange(val: any) {
  if (val !== null) {
    if (val[0]) {
      state.queryForm.receiveTimeStart = val[0];
    }
    if (val[1]) {
      state.queryForm.receiveTimeEnd = val[1];
    }
  } else {
    // state.queryForm.startTime = '';
    // state.queryForm.endTime = '';
  }
}

// 重置查询表单
function resetQuery() {
  queryFormRef.value.resetFields();
  // console.log('queryForm.value', queryForm.value)
  handleQuery();
}

// 删除
async function handleDel(row: any) {
  try {
    await ElMessageBox.confirm('确定删除？');
    await batchDeleteSample([row.id]).then(() => {
      ElMessage.success('删除成功');
      handleQuery();
    })
  } catch (error) {
    console.log(error);
  }
}

async function batchDelete() {
  if (state.selectIds.length === 0) {
    ElMessage.error('请勾选删除数据项');
    return;
  } else {
    try {
      await state.selectIds.forEach((item: any) => {
        state.tableData.forEach((ele: any) => {
          if (ele.id === item && ele.checkResult !== 2) {
            throw '已检测数据不可删除！';
          }
        });
      });
      await ElMessageBox.confirm(
        '确定删除这' + state.selectIds.length + '条记录？'
      );
      console.log('删除', state.selectIds)
      await batchDeleteSample(state.selectIds).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      })
    } catch (error: any) {
      console.log(error);
      if (error === 'cancel') {
        return;
      }
      ElMessage.error(error);
    }
  }
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
    width: '30%',
    isShowFooter: false,
    customClass: 'month-report__dialog'
  };
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

// excel 导出
async function outExcel() {
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
        // this.$Api.excel.checkSampleExport(this.selectIds)
        //     .then(function (res) {
        //         excelDownload(res, '样品列表-导出数据.xlsx')
        //     })
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
        // this.$Api.excel.checkSampleExport(this.selectIds)
        //     .then(function (res) {
        //         excelDownload(res, '样品列表-导出数据.xlsx')
        //     })
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

// 导出结果公示
async function resultOutExcel() {
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
        // this.$Api.excel.checkSampleExportResult(this.selectIds)
        //     .then(function (res) {
        //         excelDownload(res, '样品列表-导出检验结果公示.xlsx')
        //     })
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
    ElMessageBox.confirm(
      `是否确认导出所勾选${state.selectIds.length}条数据项?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        // this.$Api.excel.checkSampleExportResult(this.selectIds)
        //     .then(function (res) {
        //         excelDownload(res, '样品列表-导出检验结果公示.xlsx')
        //     })
      })
      .catch((e: any) => {
        console.log(e);
        ElMessage({
          type: 'info',
          message: '已取消导出'
        });
      });
  }
}

// 定义查看状态弹窗
function viewDialog(row: any) {
  const props = {
    // 表单数据
    rowData: row,
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
    title: '查看检测项目详情',
    width: '50%',
    isShowFooter: false,
    customClass: 'month-report__dialog'
  };
  // 引入弹窗主体组件
  const component = require('./components/statusDialog.vue').default;
  if (dialog.length) {
    dialog.props = props;
    dialogManager.updateDialog(dialog);
  } else {
    // 新建并添加弹窗
    dialog = new Dialog(component, props, events, meta);
    dialogManager.addDialog(dialog);
  }
  dialogManager.openDialog(dialog.key);
}

// 定义编辑状态弹窗
function editDialog(row: any) {
  const props = {
    // 表单数据
    rowData: row,
    // model 弹窗状态 view：查看，edit：编辑
    model: 'edit'
  };
  // 定义回调事件
  const events = {
    confirm: (data: any) => {
      //console.log('编辑状态弹窗confirm回调函数',data);
      updateSample({
        ...data
      }).then(() => {
        ElMessage({
          message: '修改成功',
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
    width: '50%',
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

// 定义新增状态弹窗
function newDialog() {
  const props = {};
  // 定义回调事件
  const events = {
    confirm: (data: any) => {
      console.log('confirm回调函数', data);
      let FormData: any = [];
      for (let i = 0; i < data.checkSampleList.length; i++) {
        FormData.push({
          basicItemId: data.checkSampleList[i].basicItemId,
          basicItemName: data.checkSampleList[i].basicItemName,
          basicItemType: 0,
          batchNumber: "批次2(20220324P)",
          batchNumberId: "string",
          createBy: "string",
          numberPlate: "string",
          quantityIn: data.checkSampleList[i].quantityIn,
          quantitySample: data.checkSampleList[i].quantitySample,
          receiveBy: "cyy",
          receiveTime: data.restockTime,
          region: "鲜菜四区",
          regionId: "string",
          restockTime: data.restockTime,
          sampleCode: "string",
          sampleId: "string",
          sampleName: data.checkSampleList[i].sampleName,
          stall: "菜篮子三号档口",
          stallId: "string",
          status: 0,
          unit: "%",
          updateBy: "cyy",
          valueStandard: "10",
          valueStandardOp: ">"
        })
      }
      addSample(FormData).then(() => {
        ElMessage({
          message: '保存成功',
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
    title: '新增样品项目',
    width: '50%',
    isShowFooter: false,
    customClass: 'month-report__dialog'
  };
  // 引入弹窗主体组件
  const component = require('./components/newDialog.vue').default;
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

function recheckDialog(row: any) {
  const props = {
    // 表单数据
    rowData: row
  };
  // 定义回调事件
  const events = {
    confirm: (data: any) => {
      reCheckSample({
        ...data
      }).then(() => {
        ElMessage({
          message: '保存成功',
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
    title: '复检对话框',
    width: '40%',
    isShowFooter: false,
    customClass: 'month-report__dialog'
  };
  // 引入弹窗主体组件
  const component = require('./components/recheckDialog.vue').default;
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
// checkbox 选中事件 返回选中的id
function selectionChange(records: any) {
  state.selectIds = records.map((row: any) => row.id);
  console.log(state.selectIds);
}

function selectRegionChange(value: any) {
  state.regionId = value.regId;
  state.queryForm.region = value.regName;
}

function selectStallChange(value: any) {
  state.queryForm.stall = value.mrgNumber;
}
</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
}

.el-form {
  margin-top: 20px;
}

.right {
  float: right;
  right: 0;
}

.vxe-button {
  margin-left: 0;
}

.total {
  margin-left: 5%;
  color: red;
}

.total1 {
  margin-left: 32%;
}

.total2 {
  margin-left: 3%;
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
