<template>
  <div>
    <!-- 表格-->
    <vxe-table
      :header-cell-style="headerCellStyle"
      align="center"
      class="table"
      header-align="center"
      show-header
      show-header-overflow
      highlight-current-row
      highlight-hover-row
      :row-config="{ isHover: true }"
      :scroll-y="{ enabled: false }"
      :data="tableData"
      :max-height="maxHeight"
      ref="table"
      @checkbox-change="selectionChange"
      @checkbox-all="selectionChange"
      :print-config="{}"
      border="none"
      stripe
      :checkbox-config="checkboxConfig"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
    >
      <template v-for="(col, index) in tableColumns">
        <vxe-column
          v-if="col.slot === undefined"
          :key="index"
          :type="col.type"
          :title="col.title"
          :field="col.field"
          :width="col.width"
          :min-width="col.minWidth"
          :fixed="col.fixed"
          :formatter="col.formatter"
        >
        </vxe-column>
        <slot v-else :name="col.slot"></slot>
      </template>
    </vxe-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed, PropType } from 'vue';

const props = defineProps({
  maxHeight: {
    type: Number,
    require: true
  },
  tableColumns: {
    type: Array as PropType<any>,
    require: true
  },
  tableData: {
    type: Array,
    require: true
  },
  checkboxConfig: {
    type: Object,
    require: false,
    default: () => {
      return {};
    }
  }
});

const headerCellStyle = ref({
  backgroundColor: '#EBEEF5',
  color: 'black'
});

const emit = defineEmits(["selectionChange"]);

function selectionChange(selection: any) {
  emit('selectionChange', selection.records)
}
// funcction printEvent1(data) {
//   this.$refs.table.print(data)
// }
// function printSelectEvent1(data) {
//   this.$refs.table.print(data)
// }
// function connect(xToolbar1) {
//   // 手动将表格和工具栏进行关联
//   console.log(xToolbar1)
//   const $table = this.$refs.table
//   $table.connect(xToolbar1)
// }
</script>
<style scoped lang="scss">
vxe-column {
  font-weight: bold;
}
</style>
