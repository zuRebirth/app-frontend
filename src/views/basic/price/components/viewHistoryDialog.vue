<template>
    <div class="">
        <TablePanel :table-columns="tableColumns" :table-data="tableData" :maxHeight="300">
            <!-- 自定义列-->
            <template #col_checkMethod>
                <vxe-column title="检验方式" :width="80" fixed="left">
                    <template #default="{ row }">
                        {{ row.checkMethod === 0 ? '送检' : '抽检' }}
                    </template>
                </vxe-column>
            </template>
        </TablePanel>

        <el-row align="middle">
            <el-col :span="12">
                <el-row justify="start">
                    <pagination v-if="total > 0" :total="total" v-model:page="queryParams.current"
                        v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import TablePanel from '@/components/TablePanel/index.vue';
import Pagination from '@/components/Pagination/index.vue';
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue';
import { basicPriceHistory } from '@/api/service/basic';
import { PageQueryParam } from '@/types/api/base';
import { basicPriceHistoryQuery } from '@/types/api/basicprice';

const { proxy }: any = getCurrentInstance();

const props = defineProps({
    id: {
        type: Number,
        require: true
    }
});

const state = reactive({
    id: props.id,
    total: 0,
    // 查询表单
    queryParams: {
        current: 1,
        pageSize: 10
    } as PageQueryParam,
    tableData: [] as any,
    queryForm: {
        current: undefined,
        id: undefined,
        pageSize: undefined,
        requestNo: undefined
    } as basicPriceHistoryQuery,
    // 表格设置
    tableColumns: [
        { slot: 'col_checkMethod' },
        { field: 'unitPriceOld', title: '修改前价格(元)', minWidth: 120 },
        { field: 'unitPriceNew', title: '修改后价格(元)', minWidth: 120 },
        { field: 'batchNumberOld', title: '修改前计费批次样品数', minWidth: 170 },
        { field: 'batchNumberNew', title: '修改后计费批次样品数', minWidth: 170 },
        { field: 'updateBy', title: '修改人', minWidth: 80 },
        { field: 'updateTime', title: '修改时间', minWidth: 170 }
    ]
})

const { queryParams, tableData, tableColumns, id, total } = toRefs(state);

onMounted(() => {
    handleQuery();
})

function handleQuery() {
    basicPriceHistory({
        ...state.queryParams,
        ...state.queryForm
    }).then(({ data }) => {
        console.log(data);
        state.queryParams.current = data.page;
        state.queryParams.pageSize = data.limit;
        state.total = data.total;
        state.tableData = data.data || [];
    });
};

</script>

<style>
</style>