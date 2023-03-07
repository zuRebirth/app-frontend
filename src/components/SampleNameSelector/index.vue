<template>
    <el-cascader placeholder="请选择货品名称" v-model="selectValue" :options="options" :props="props_1"
        :remote-method="remoteMethod" :style="{ width: '100%' }" clearable :show-all-levels="false" @clear="onClear"
        no-data-text="请先选择档口">
    </el-cascader>
</template>

<script setup lang="ts">
import { reactive, toRefs, getCurrentInstance, onMounted, computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String || Number,
        default: null
    },
    disable: {
        type: Boolean,
        require: false,
        default: false
    },
    gid: {
        type: Number,
        require: true,
        default: null
    }
});

const state = reactive({
    options: [] as any,
    loading: false,
    props_1: {
        value: 'categoryName',
        label: 'categoryName',
        children: 'childrens',
        expandTrigger: 'hover'
    } as any
})

const { options, loading, props_1 } = toRefs(state);

onMounted(() => {
    init();
})

const emit = defineEmits(["update:modelValue"]);

const selectValue = computed({
    set(val: any) {
        emit('update:modelValue', val[val.length - 1]);
    },
    get() {
        return props.modelValue;
    }
})

function init() {
    // this.$Api.third.getAllGoods({ gid: this.gid }).then((res) => {
    //     this.loading = false
    //     this.options = res.data
    //     console.log(this.options)
    // }).catch(() => {
    //     this.loading = false
    // })
}

function remoteMethod(query: any) {
    if (query !== '') {
        state.loading = true;
        init();
    } else {
        // this.options = []
    }
}

function onClear() {
    state.loading = true;
    init();
}

</script>

<style>
</style>