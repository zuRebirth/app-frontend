<template>
    <el-select
      v-model="selectValue"
      filterable
      reserve-keyword
      :loading="loading"
      clearable
      @clear="onClear"
      value-key="id"
      :disabled="disable"
      :style="{ width: '100%' }"
  >
    <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.name">
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
// 基础检测设置选择框
import { getCurrentInstance, onMounted, reactive, toRefs , computed  } from 'vue';
import {
    getItemValues
} from '@/api/service/dashboard';

const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: null
    },
    disable: {
        type: Boolean,
        require: false,
        default: false
    },
    id: {
        type: Number,
        require: true
    }
});

const state = reactive({
    options: [] as any,
    loading: false
})

const { options, loading } = toRefs(state);

onMounted(() => {
    init();
    // console.log('id',props.id);
})

const emit = defineEmits(["update:modelValue"]);

const selectValue = computed({
    set(val: any) {
        emit('update:modelValue', val);
    },
    get() {
        return props.modelValue;
    }
})

function init() {
    getItemValues({
        id: props.id
    }).then(({data}) => {
        console.log('1211',data);
        state.loading = false;
        state.options = data.data;
    }).catch(() => {
        state.loading = false;
    })
}

function onClear() {
    state.loading = true;
    init();
}

</script>

<style>
</style>