<template>
  <div class="download-dialog">
    <TablePanel :table-columns="tableColumns" :table-data="tableData">
      <template #col_appointmentTime>
        <vxe-column title="送检时间" :width="150">
          <template #default="{ row }">
            <div>{{ countTime(row.appointmentTime) }}</div>
          </template>
        </vxe-column>
      </template>
      <!-- 操作 -->
      <template #col_action>
        <vxe-column title="" :width="150" fixed="right">
          <template #default="{ row }">
            <vxe-button status="primary" type="text" style="text-decoration: undelined" v-if="model === 'download'"
              @click="download(row)">下载报告</vxe-button>
            <vxe-button status="primary" type="text" style="text-decoration: undelined" v-else-if="model === 'view'"
              @click="view(row)">预览报告</vxe-button>
          </template>
        </vxe-column>
      </template>
    </TablePanel>
    <div class="cancle">
      <el-button type="primary" @click="cancel()">关闭</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TablePanel from '@/components/TablePanel/index.vue';
import Pagination from '@/components/Pagination/index.vue';
import VXETable from 'vxe-table';
import dayjs from 'dayjs';
import { getCurrentInstance, reactive, ref, toRefs, onMounted } from 'vue';
import {
  checkTaskDownloadReport,
  checkTaskDowloadReport
} from '@/api/service/check';
import { PageQueryParam } from '@/types/api/base';

const { proxy }: any = getCurrentInstance();

const props = defineProps({
  id: {
    type: Number,
    require: true
  },
  model: {
    type: String,
    require: true
  }
});

const state = reactive({
  model: props.model,
  id: props.id,
  curListStatus: [] as any,
  queryParams: {
    current: 1,
    pageSize: 10
  } as PageQueryParam,
  total: 0,
  tableData: [] as any,
  // 表格设置
  tableColumns: [
    { field: 'appointmentUserName', title: '送检人', minWidth: 150 },
    { field: 'mobile', title: '手机号码', minWidth: 150 },
    { field: 'email', title: '邮箱', minWidth: 150 },
    { slot: 'col_appointmentTime' },
    { slot: 'col_action' }
  ]
});

const { model, id, curListStatus, queryParams, tableData, tableColumns, total } = toRefs(state);

onMounted(() => {
  handleQuery();
});

async function view(row: any) {
  let totalData: any = '';
  // await this.$Api.checkManagement.view({
  //     appointmentTime: this.countTime(row.appointmentTime, true),
  //     appointmentUserName: row.appointmentUserName,
  //     id: row.id,
  //     mobile: row.mobile
  // }).then((res) => {
  //     console.log(res)
  //     totalData = res.data
  // }).catch((err) => {
  //     console.log(err)
  // })
  // 检测样品名字
  let sampleDataName: any = [];
  // 检测样品总件数
  let quantity: any = 0;
  // 检测样品总重量
  let weight: any = 0;
  // 检测总结果
  let totalResult: any = 1;
  // 检测项目
  let totalItemName: any = [];
  totalData.forEach((ele: any) => {
    sampleDataName.push(ele.sampleName)
    totalItemName.push(ele.checkItemName)
    const nowResult = ele.recheckResult === 2 ? ele.checkResult : ele.recheckResult
    console.log(nowResult)
    totalResult = (totalResult & nowResult)
    quantity += ele.quantity
    weight += ele.weight
  });
  totalResult = totalResult === 0 ? '不合格' : '合格';
  sampleDataName = sampleDataName.join('、');
  totalItemName = totalItemName.join('、');
  // 图片显示
  let idCardImg = 'idCardImg';
  let sampleImg = 'sampleImg';
  if (totalData[0].idCardImg === null || totalData[0].idCardImg === '') {
    idCardImg = 'null'
  }
  if (totalData[0].sampleImg === null || totalData[0].sampleImg === '') {
    sampleImg = 'null'
  }
  // 打印样式
  const printStyle = `
    .page {
      height: 1040px;
      padding: 40px;
      position: relative;
    }
    .page1 {
      height: 270px;
    }
    .page1 p {
      margin: 0;
    }
    .nav {
      font-size: 18px;
      text-indent: 42pt; 
      line-height: 150%
    } 
    .idCardImg {
      width: 403px;
      height: 226px;
    }
    .sampleImg {
      width: 412px;
      height: 232px;
    }
    .null {
      width: 0;
      height: 0;
    }
    .right {
      margin: 10px;
      position: absolute;
      right: 80px;
      bottom: 140px;
      font-size: 14px;
    }
    .checkBy {
      margin-right: 80px;
    }
    .institutions {
      bottom: 105px;
    }
    .time {
      bottom: 70px;
    }
    .checkData {
      font-size: 11pt; 
      font-family: 'PMingLiU', serif
    }
    .bold {
      font-weight: bold;
    }
              `
  let printTmpl = ``
  // 普通送检打印模板
  if (totalData[0].checkMode === 0) {
    printTmpl = `
      <div class="page">
      <h2 style="text-align: center">
        <span>检测合格记录单</span>
      </h2>

      <p class="nav"
      >
        <span>送检人：</span><u><span>${totalData[0].appointmentUserName}</span></u
        ><span>，身份证号码：</span><u><span>${totalData[0].idCard}</span></u
        ><span>，电话：</span><u><span>${totalData[0].mobile}</span></u
        ><span>。</span>
      </p>

      <p class="nav"
        style="
          margin-top: -12px
        "
      >
        <b><span>情况介绍</span></b
        ><span>：</span><span>${totalData[0].appointmentTime}</span><span>星期${totalData[0].day}</span><span> </span
        ><span><span>${totalData[0].market}<u>${totalData[0].region}</u>${totalData[0].stall}</span></span
        ><span>档主：</span><u><span>${totalData[0].merchantName}</span></u
        ><span>送检：</span><span>${sampleDataName}</span><span>，共</span><span>${totalData.length}</span
        ><span>个样。现送到我单位进行<u>${totalItemName}</u>快速检测，经过我司检测员</span
        ><span
          ><u><span>${totalData[0].checkBy}</span></u></span
        ><span>检测后${totalResult}。</span>
      </p>

      <p
        style="text-indent: 48pt; font-size: 18px"
      >
        <b><span>注：检测结果只对抽检样品负责。</span></b>
      </p>

      <p
        style="text-indent: 48.05pt;"
      >
        <b 
          ><span
            ><img
              class="${idCardImg}"
              src="${totalData[0].idCardImg}"
          ></b>
      </p>

      <p
        style="text-indent: 48.05pt;"
      >
        <b 
          ><span
            ><img
              class="${sampleImg}"
              src="${totalData[0].sampleImg}"
          ></b>
      </p>

      <p class="right">
        <span class="checkBy bold"
          >检测员：</span
        >
      </p>

      <p class="right institutions">
        <span class="bold">${totalData[0].lab}</span>
      </p>

      <p class="right time">
        <span class="bold">${totalData[0].appointmentTime}</span>
      </p>
    </div>
    <div class="page">
    ${totalData.map((items: any, i: any) => {
      return `
        <div class="page1">
        <p>
        <span style="margin-left:28px; font-size: 17pt; font-family: 'PMingLiU', serif"
          >${items.checkItemName}</span
        >
        </p>
      <p style="margin-top: 7px;"><span class="checkData">检测时间：</span>
      <span style="font-size: 11pt">${items.recheckResult === 2 ? dayjs(items.checkTime).format('YYYY-MM-DD HH:mm:ss') : dayjs(items.recheckTime).format('YYYY-MM-DD HH:mm:ss')}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >检测通道：</span
        ><span style="font-size: 11pt">${items.recheckResult === 2 ? items.checkChannel : items.recheckChannel}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >样品名称：</span
        ><span style="font-size: 11pt">${items.sampleName === null ? '' : items.sampleName}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >样品编码：</span
        ><span style="font-size: 11pt">${items.sampleCode === null ? '' : items.sampleCode}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >抽检单位：</span
        ><span style="font-size: 11pt"><o:p></o:p></span>
      </p>

      <p>
        <span class="checkData">样品来源：${items.checkMode === 0 ? '普通送检' : '过海送检'}</span>
      </p>

      <p>
        <span class="checkData"
          >检测人员：</span
        ><span class="SpellE"><span style="font-size: 11pt">${items.appointmentUserName}</span></span>
      </p>

      <p>
        <span class="checkData"
          >对照△A：${items.valueStandard}</span
        ><span style="font-size: 11pt"><o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >样品△A：</span
        ><span style="font-size: 11pt">${items.recheckResult === 2 ? items.checkData : items.recheckData}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >抑制率：</span
        ><span style="font-size: 11pt">${items.recheckResult === 2 ? items.checkInhibitionRatio : items.recheckInhibitionRatio}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >结果判定：${(items.recheckResult === 2 ? items.checkResult : items.recheckResult) === 0 ? '不合格' : '合格'}</span>
      </p>
    </div>
        `
    }).join('')}
      
      </div>`
  } else {
    printTmpl = `
      <div class="page">
      <h2 style="text-align: center">
        <span>检测合格记录单</span>
      </h2>

      <p class="nav"
      >
        <span>送检人：</span><u><span>${totalData[0].appointmentUserName}</span></u
        ><span>，身份证号码：</span><u><span>${totalData[0].idCard}</span></u
        ><span>，电话：</span><u><span>${totalData[0].mobile}</span></u
        ><span>。</span>
      </p>

      <p class="nav"
        style="
          margin-top: -12px
        "
      >
        <b><span>情况介绍</span></b
        ><span>：</span><span>${totalData[0].appointmentTime}</span><span>星期${totalData[0].day}</span><span> </span
        ><span><span>${totalData[0].market}<u>${totalData[0].region}</u>${totalData[0].stall}</span></span
        ><span>档主：</span><u><span>${totalData[0].merchantName}</span></u
        ><span>送检：</span><span>${sampleDataName}</span><span>，共</span
        ><span>${totalData.length}个样。</span><span>有${quantity}件，约${weight}吨。</span
        ><span
          >原产地为：${totalData[0].originFrom}，现将其运送到<u>${totalData[0].sendTo}</u>，车主：<u>${totalData[0].driverName}</u
          >，车牌号码为：<u>${totalData[0].numberPlate}</u></span
        >现送到我单位进行<u>${totalItemName}</u>快速检测，经过我司检测员<span
          ><u><span>${totalData[0].checkBy}</span></u></span
        ><span>检测后${totalResult}。</span>
      </p>

      <p
        style="text-indent: 48pt; font-size: 18px"
      >
        <b><span>注：检测结果只对抽检样品负责。</span></b>
      </p>

      <p
        style="text-indent: 48.05pt;"
      >
        <b 
          ><span
            ><img
              class="${idCardImg}"
              src="${totalData[0].idCardImg}"
          ></b>
      </p>

      <p
        style="text-indent: 48.05pt;"
      >
        <b 
          ><span
            ><img
              class="${sampleImg}"
              src="${totalData[0].sampleImg}"
          ></b>
      </p>

      <p class="right">
        <span class="checkBy bold"
          >检测员：</span
        >
      </p>

      <p class="right institutions">
        <span class="bold">${totalData[0].lab}</span>
      </p>

      <p class="right time">
        <span class="bold">${totalData[0].appointmentTime}</span>
      </p>
    </div>
    <div class="page">
    ${totalData.map((items: any, i: any) => {
      return `
        <div class="page1">
      <p>
        <span style="margin-left:28px; font-size: 17pt; font-family: 'PMingLiU', serif"
          >${items.checkItemName}</span
        >
      </p>
      <p style="margin-top: 7px;"><span class="checkData">检测时间：</span>
      <span style="font-size: 11pt">${items.recheckResult === 2 ? dayjs(items.checkTime).format('YYYY-MM-DD HH:mm:ss') : dayjs(items.recheckTime).format('YYYY-MM-DD HH:mm:ss')}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >检测通道：</span
        ><span style="font-size: 11pt">${items.recheckResult === 2 ? items.checkChannel : items.recheckChannel}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >样品名称：</span
        ><span style="font-size: 11pt">${items.sampleName === null ? '' : items.sampleName}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >样品编码：</span
        ><span style="font-size: 11pt">${items.sampleCode === null ? '' : items.sampleCode}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >抽检单位：</span
        ><span style="font-size: 11pt"><o:p></o:p></span>
      </p>

      <p>
        <span class="checkData">样品来源：${items.checkMode === 0 ? '普通送检' : '过海送检'}</span>
      </p>

      <p>
        <span class="checkData"
          >检测人员：</span
        ><span class="SpellE"><span style="font-size: 11pt">${items.appointmentUserName}</span></span>
      </p>

      <p>
        <span class="checkData"
          >对照△A：${items.valueStandard}</span
        ><span style="font-size: 11pt"><o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >样品△A：</span
        ><span style="font-size: 11pt">${items.recheckResult === 2 ? items.checkData : items.recheckData}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >抑制率：</span
        ><span style="font-size: 11pt">${items.recheckResult === 2 ? items.checkInhibitionRatio : items.recheckInhibitionRatio}<o:p></o:p></span>
      </p>

      <p>
        <span class="checkData"
          >结果判定：${(items.recheckResult === 2 ? items.checkResult : items.recheckResult) === 0 ? '不合格' : '合格'}</span>
      </p>
    </div>
        `
    }).join('')}
      
      </div>`
  }
  VXETable.print({
    style: printStyle,
    content: printTmpl
  })
};

function cancel() {
  proxy.$attrs.events.cancel();
};

function download(row: any) {
  const times = countTime(row.appointmentTime, true);
  checkTaskDowloadReport({
    ...state.queryParams,
    appointmentTime: times,
    appointmentUserName: row.appointmentUserName,
    id: row.id,
    mobile: row.mobile
  })
    .then(({ data }) => {
      console.log(data)
      const url = data.data;
      const elink = document.createElement('a');
      elink.style.display = 'none';
      elink.href = url;
      console.log(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    })
};

function handleQuery() {
  // 下载报告查询
  checkTaskDownloadReport({
    ...state.queryParams,
    id: state.id
  })
    .then(({ data }) => {
      state.tableData = data || [];
      console.log('11111', data)
    })
};

// download：是否是下载报告的时间格式
function countTime(This?: any, download?: any) {
  const time = `${This.year}-${This.monthValue}-${This.dayOfMonth} ${This.hour}:${This.minute}:${This.second}`;
  if (download === true) {
    return dayjs(time).format('YYYY-MM-DDTHH:mm:ss')
  }
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}


</script>

<style lang="scss" scoped>
.download-dialog {
  position: relative;
}

.cancle {
  line-height: 80px;
  margin-left: 90%;
}
</style>
