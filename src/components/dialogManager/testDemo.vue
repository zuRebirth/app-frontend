<template>
  <div>
    <el-button @click="openDialog">测试弹窗</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { Dialog } from '@/components/dialogManager/dialogModel';
import useStore from '@/store';
// import component from './demoDialog.vue'

const id = ref(1);
let dialog: any = ref();
const { dialogManager } = useStore();

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
