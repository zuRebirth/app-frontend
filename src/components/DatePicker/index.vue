<template>
  <el-date-picker
    v-model="selectValue"
    type="datetimerange"
    value-format="YYYY-MM-DD HH:mm:ss"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, toRefs } from 'vue';

const props = defineProps({
  startTime: {
    type: [Number, String],
    default: null
  },
  endTime: {
    type: [Number, String],
    default: null
  }
});

// 用于当前组件保存时间
const pickerArrValue: any = ref([]);
const { startTime, endTime } = toRefs(props);

const emit = defineEmits(['change']);

const selectValue = computed({
  get: () => pickerArrValue.value,
  set: value => {
    if (value) {
      emit('change', value);
    }
    pickerArrValue.value = value;
  }
});

watch(
  // 这里的监听是为了在父组件点击重置的时候可以清除当前组件旧的时间
  startTime,
  () => {
    if (!props.startTime) {
      pickerArrValue.value = [];
    }
  }
);
onMounted(() => {
  // TODO: 如果需要显示默认值的时候再放开
  init();
});
function init() {
  // TIP：不反写逻辑
  if (startTime && endTime) {
    // 默认时间
    pickerArrValue.value = [startTime, endTime];
  } else {
    // 这里好像不用重新赋值空也可以的
    pickerArrValue.value = [];
  }
}
</script>
