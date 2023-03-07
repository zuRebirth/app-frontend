<template>
  <el-select
    style="width: 100%"
    v-model="valueSelect"
    :multiple="multiple"
    :size="size"
    :style="styles"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
  >
    <el-option
      v-for="item in Enumeration[en]"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import Enumeration from '@/utils/enumeration';
import { computed, PropType } from 'vue';

const props = defineProps({
  // v-model值
  modelValue: {
    type: [Number, String, Array],
    default: null
  },
  // Enumeration 里的枚举值
  en: {
    type: String as PropType<"FREE_TYPE" | "DATA_TYPE" | "OPEN_TYPE" | "CHECK_TYPE" | "CHECK_END">,
    require: true,
    default: ''
  },
  size: {
    type: String as PropType<"" | "default" | "small" | "large" | undefined>,
    default: 'default'
  },
  styles: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  clearable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue"]);

const valueSelect = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});


</script>

<style scoped lang="scss">
// :deep(.el-input__inner) {
//   height: 32px;
//   line - height: 32px;
// }
</style>
