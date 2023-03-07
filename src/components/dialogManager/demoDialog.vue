<script lang="ts">
export default {
  name: 'demoDialog',
  // created() {
  //   console.log(this);
  // },
  // methods: {
  //   confirm() {
  //     const e:any =  this.$attrs.events
  //     console.log(e)
  //     e.confirm()
  //   },
  //   cancel() {
  //     const e:any =  this.$attrs.events
  //     console.log(e)
  //     e.cancel()
  //   }
  // }
};
</script>
<template>
  <el-button @click="confirm()">confirm{{ props.id }}</el-button>
  <el-button @click="cancel()">cancel{{ props.id }}</el-button>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  toRefs
} from 'vue';
onMounted(() => {
  console.log(123)
})
console.log(getCurrentInstance())
const { proxy }:any = getCurrentInstance()
function confirm() {
  proxy.$attrs.events.confirm()
}
function cancel() {
  proxy.$attrs.events.cancel()
}
const props = defineProps({
  id: {
    type: Number,
    defalut: 4
  }
});
</script>
