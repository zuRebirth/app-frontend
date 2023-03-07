<template>
  <div class="report-container">
    <el-card shadow="never" class="card-container">
      <el-row :getter="100">
        <el-col :span="12">
          <div class="titleBefore"></div>
          <div id="week" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>
        <el-col :span="12">
          <div class="titleBefore titleBefore2"></div>
          <div id="area" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>
      </el-row>
      <el-row :getter="100">
        <el-col :span="12">
          <div class="titleBefore"></div>
          <div id="stall" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>
        <el-col :span="12">
          <div class="titleBefore titleBefore2"></div>
          <div id="sample" :style="{ width: '100%', height: '300px' }"></div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <template #header class="clearfix">
        <el-row>
          <el-col>
            <div style="display: flex">
              <div class="before"></div>
              <h3>统计报表</h3>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form ref="queryFormRef" :model="queryForm" class="form">
              <el-row type="flex" justify="space-around">
                <el-col :span="6">
                  <el-form-item label="开始时间">
                    <el-date-picker v-model="queryForm.createTime" type="datetime" placeholder="选择日期"
                      value-format="YYYY-MM-DD HH:mm:ss" @change="changeStartTime">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="结束时间">
                    <el-date-picker v-model="queryForm.endTime" type="datetime" placeholder="选择日期"
                      value-format="YYYY-MM-DD HH:mm:ss" @change="changeEndTime">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="6">
            <el-row justify="end">
              <el-button type="primary" @click="handleQuery">查询</el-button>
              <!-- <el-button type="warning" @click="outExcel">导出数据</el-button> -->
            </el-row>
          </el-col>
        </el-row>
      </template>

      <TablePanel :maxHeight="400" :table-columns="tableColumns" :table-data="tableData"
        @selectionChange="selectionChange">
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
import TablePanel from '@/components/TablePanel/index.vue';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { computed, onMounted, onUnmounted, reactive, ref, toRefs, getCurrentInstance } from 'vue';
import { PageQueryParam } from '@/types/api/base';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import {
  checkAnalysisList,
  checkAnalysisRegion,
  checkAnalysisCurrent,
  checkAnalysisAnStall,
  checkAnalysisAnSample
} from '@/api/service/check';

const queryFormRef = ref(ElForm);

const state = reactive({
  queryParams: {
    current: 1,
    pageSize: 10
  } as PageQueryParam,
  total: 0,
  queryForm: {
    createTime: '',
    endTime: ''
  },
  tableData: [] as any,
  tableColumns: [
    { field: 'region', title: '区域', minWidth: 100 },
    { field: 'stall', title: '档口', minWidth: 100 },
    { field: 'sampleName', title: '样品名称', minWidth: 100 },
    { field: 'checkCount', title: '检测数量', minWidth: 100 },
    { field: 'checkPassCount', title: '合格数量', minWidth: 100 },
    { field: 'checkFailCount', title: '不合格数量', minWidth: 100 }
  ]
})

const {
  queryParams,
  queryForm,
  total,
  tableData,
  tableColumns
} = toRefs(state);

onMounted(() => {
  fetchData();
  handleQuery();
})

function getPastDate(num: any) {
  const cur = new Date(); // 获取当前时间对象
  const pastDate = new Date(cur.getTime() - (num * 24 * 3600 * 1000));
  const date = pastDate.toLocaleDateString().split('/');
  const mon = Number(date[1]) < 10 ? `0${date[1]}` : date[1];
  const day = Number(date[2]) < 10 ? `0${date[2]}` : date[2];
  return date[0] + '-' + mon + '-' + day; // 显示的格式是：2020-04-13 
}

// 判断一个字符串str是否在数组arr中
function judgeStrinArr(str: string, arr: string) {
  const a = arr.indexOf(`${str}`);
  return a > -1;
}

function fetchData() {
  //获取周分析数据
  checkAnalysisCurrent({
    ...state.queryParams,
    ...state.queryForm
  }).then((data) => {
    console.log(data);
    const myChart1 = echarts.init(document.getElementById('week')!);
    const areaOption = {
      title: { text: '周检测分析' },
      legend: {},
      tooltip: {},
      dataset: {
        // 提供一份数据。
        source: [] as any[]
      },
      xAxis: { type: 'category' },
      yAxis: { minInterval: 1 },
      series: [
        {
          type: 'bar',
          itemStyle: { normal: { color: '#409EFF' } }
        },
        {
          type: 'bar',
          itemStyle: { normal: { color: '#67C23A' } }
        },
        {
          type: 'bar',
          itemStyle: { normal: { color: '#F56C6C' } }
        }
      ]
    }
    const timeArray: any = [];
    data.data.data.forEach((item:any) => {
      if (item.time !== undefined) {
        timeArray.push(item.time.split(' ')[0]);
      }
    })
    for (let i = 0; i < 7; i++) {
      let dayTime = getPastDate(i);
      let index = 0;
      if (judgeStrinArr(dayTime, timeArray)) {
        timeArray.forEach((item: any, i: any) => {
          if (item === dayTime) {
            index = i;
          }
        })
        const date = dayTime.split('-');
        dayTime = parseInt(date[1]) + '月' + parseInt(date[2]) + '日';
        areaOption.dataset.source.unshift([`${dayTime}`, `${data.data.data[index].checkCount}`,
        `${data.data.data[index].checkPassCount}`, `${data.data.data[index].checkFailCount}`]);
      } else {
        const date = dayTime.split('-')
        dayTime = parseInt(date[1]) + '月' + parseInt(date[2]) + '日';
        areaOption.dataset.source.unshift([`${dayTime}`, '0', '0', '0']);
      }
    }
    areaOption.dataset.source.unshift(['product', '检测数量', '合格数', '不合数']);
    myChart1.setOption(areaOption);
  }).catch((err) => {
    console.log(err)
  })
}

function handleQuery() {
  checkAnalysisList({
    ...state.queryParams,
    ...state.queryForm
  }).then(({ data }) => {
    // console.log('basic');
    console.log('1111',data);
    state.queryParams.current = data.page;
    state.queryParams.pageSize = data.limit;
    state.total = data.total;
    state.tableData = data.data || [];
  });

  // 获取区域分析数据
  checkAnalysisRegion({
    ...state.queryParams,
    ...state.queryForm
  }).then(({ data }) => {
    // console.log('basic');
    // console.log(data);
    //Typescript有一个非null断言，以确保该值永远不会为空,!运算符添加到语句末尾
    const myChart2 = echarts.init(document.getElementById('area')!);
    const areaOption = {
      title: { text: '区域检测分析' },
      legend: {},
      tooltip: {},
      dataset: {
        // 提供一份数据。
        source: [
          ['product', '检测数量', '合格数', '不合数']
        ]
      },
      xAxis: { type: 'category' },
      yAxis: { minInterval: 1 },
      series: [
        {
          type: 'bar',
          itemStyle: { normal: { color: '#409EFF' } }
        },
        {
          type: 'bar',
          itemStyle: { normal: { color: '#67C23A' } }
        },
        {
          type: 'bar',
          itemStyle: { normal: { color: '#F56C6C' } }
        }
      ]
    }
    data.data.forEach((item) => {
      const arr = [];
      arr.push(item.region);
      arr.push(item.checkCount);
      arr.push(item.checkPassCount);
      arr.push(item.checkFailCount);
      areaOption.dataset.source.push(arr);
    })
    myChart2.setOption(areaOption);
  }).catch((err) => {
    console.log(err);
  })

  //获取档口数据
  checkAnalysisAnStall({
    ...state.queryParams,
    ...state.queryForm
  }).then(({ data }) => {
    // console.log('basic');
    console.log(data);
    //Typescript有一个非null断言，以确保该值永远不会为空,!运算符添加到语句末尾
    const myChart3 = echarts.init(document.getElementById('stall')!);
    const areaOption = {
      title: { text: '档口检测分析' },
      legend: {},
      tooltip: {},
      dataset: {
        // 提供一份数据。
        source: [
          ['product', '检测数量', '合格数', '不合数']
        ]
      },
      xAxis: { type: 'category' },
      yAxis: { minInterval: 1 },
      series: [
        {
          type: 'bar',
          itemStyle: { normal: { color: '#409EFF' } }
        },
        {
          type: 'bar',
          itemStyle: { normal: { color: '#67C23A' } }
        },
        {
          type: 'bar',
          itemStyle: { normal: { color: '#F56C6C' } }
        }
      ]
    }
    data.data.forEach((item:any) => {
      const arr = [];
      arr.push(item.stall);
      arr.push(item.checkCount);
      arr.push(item.checkPassCount);
      arr.push(item.checkFailCount);
      areaOption.dataset.source.push(arr);
    })
    myChart3.setOption(areaOption)
  }).catch((err) => {
    console.log(err)
  })

  //获取货品数据
  checkAnalysisAnSample({
    ...state.queryParams,
    ...state.queryForm
  }).then(({ data }) => {
    // console.log('basic');
    // console.log(data);
    //Typescript有一个非null断言，以确保该值永远不会为空,!运算符添加到语句末尾
    const myChart4 = echarts.init(document.getElementById('sample')!);
    const areaOption = {
      title: { text: '货品检测分析' },
      legend: {},
      tooltip: {},
      dataset: {
        // 提供一份数据。
        source: [
          ['product', '检测数量', '合格数', '不合数']
        ]
      },
      xAxis: { type: 'category' },
      yAxis: { minInterval: 1 },
      series: [
        {
          type: 'bar',
          itemStyle: { normal: { color: '#409EFF' } }
        },
        {
          type: 'bar',
          itemStyle: { normal: { color: '#67C23A' } }
        },
        {
          type: 'bar',
          itemStyle: { normal: { color: '#F56C6C' } }
        }
      ]
    }
    data.data.forEach((item:any) => {
      const arr = [];
      arr.push(item.sampleName);
      arr.push(item.checkCount);
      arr.push(item.checkPassCount);
      arr.push(item.checkFailCount);
      areaOption.dataset.source.push(arr);
    })
    myChart4.setOption(areaOption);
  }).catch((err) => {
    console.log(err);
  })

}

function resetQuery() {
  queryFormRef.value.resetFields();
  // console.log('queryForm.value', queryForm.value)
  handleQuery();
}

function outExcel() {
  // 对时间格式进行修改
  if (state.queryForm.createTime !== '') {
    state.queryForm.createTime = dayjs(state.queryForm.createTime).format('YYYY-MM-DDTHH:mm:ss');
  } else {
    state.queryForm.createTime = "''";
  }
  if (state.queryForm.endTime !== '') {
    state.queryForm.endTime = dayjs(state.queryForm.endTime).format('YYYY-MM-DDTHH:mm:ss');
  } else {
    state.queryForm.endTime = "''";
  }
  ElMessageBox.confirm(`是否确认导出当前查询结果所有数据项?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // this.$Api.excel.checkAnalysisExport({
    //   createTime: this.queryForm.createTime,
    //   endTime: this.queryForm.endTime
    // })
    //   .then(function (res) {
    //     excelDownload(res, '检测分析数据.xlsx')
    //   })
  })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消导出'
      })
    })

  // 初始化时间格式，防止导出后查询失败
  if (state.queryForm.createTime === "''") {
    state.queryForm.createTime = '';
  } else if (state.queryForm.createTime !== '') {
    state.queryForm.createTime = dayjs(state.queryForm.createTime).format('YYYY-MM-DD HH:mm:ss');
  }
  if (state.queryForm.endTime === "''") {
    state.queryForm.endTime = '';
  } else if (state.queryForm.endTime !== '') {
    state.queryForm.endTime = dayjs(state.queryForm.endTime).format('YYYY-MM-DD HH:mm:ss');
  }
}

function changeStartTime(val: any) {
  if (val === null) {
    state.queryForm.createTime = '';
  } else {
    state.queryForm.createTime = val;
  }
}

function changeEndTime(val: any) {
  if (val === null) {
    state.queryForm.endTime = '';
  } else {
    state.queryForm.endTime = val;
  }
}

</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
}

.card-container {
  position: relative;
}

.before {
  margin: 8px 13px;
  padding-left: 8px;
  background-color: #909399;
}

.titleBefore {
  display: block;
  width: 8px;
  height: 35px;
  position: absolute;
  background-color: #909399;
  left: -10px;
  top: -3px;
}

.titleBefore2 {
  left: 50%;
  transform: translateX(-125%);
  margin-right: 1px;
}
</style>