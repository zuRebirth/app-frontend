<template>
    <el-select v-model="selectValue" filterable reserve-keyword placeholder="请选择检测项目" :remote-method="remoteMethod"
        :loading="loading" clearable @change="onChange" @clear="onClear" value-key="id" :disabled="disable"
        :style="{ width: '100%' }">
        <el-option v-for="item in options" :key="item.id" :label="item.itemName" :value="item">
        </el-option>
    </el-select>
</template>

<script setup lang="ts">
//form表单中，如果ref和model同名 会导致下拉框选中的值选不中
import { ref, reactive, nextTick, computed, PropType, toRefs, watch, onMounted } from 'vue';
import { basicItemList } from '@/api/service/basic';

const props = defineProps({
    modelValue: {
        type: String || Number,
        default: null
    },
    disable: {
        type: Boolean,
        require: false,
        default: false
    }
});

const state = reactive({
    options: [] as any,
    loading: false
});

const { options, loading } = toRefs(state);

onMounted(() => {
    init();
})

const emit = defineEmits(["update:modelValue", "selectChange"]);

const selectValue = computed({
    set(val: any) {
        emit('update:modelValue', val.id);
    },
    get() {
        return props.modelValue;
    }
})


function init(basicName?: any) {
    basicItemList({
        current: 1,
        pageSize: 100,
        itemName: basicName,
        isEnabled: 1
    }).then(({data}) => {
        //console.log(data);
        state.loading = false;
        state.options = data.data;
    }).catch((error) => {
        state.loading = false;
        console.log(error);
    })
}

function remoteMethod(query: any) {
    if (query !== '') {
        state.loading = true;
        console.log(query,'11111')
        init(query);
    } else {
        // this.options = []
    }
}

function onChange(value: any) {
    //console.log(value,'111111111');
    emit('selectChange', value);
}

function onClear() {
    state.loading = true;
    init();
}

</script>
<style>
</style>