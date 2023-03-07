<!-- <template>

</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed, PropType, toRefs, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Number || String,
        default: null
    },
    // 区域ID
    gid: {
        type: Number || String,
        require: true,
        default: null
    }
});

const state = reactive({
    options: [] as any,
    loading: false
});

const { options, loading } = toRefs(state);

const emit = defineEmits(["update:modelValue"]);

const selectValue = computed({
    set(val: any) {
        emit('update:modelValue', val.incomTid);
    },
    get() {
        return props.modelValue;
    }
})

watch(
    () => props.gid,
    (newValue, oldValue) => {
        console.log('🚀 ~ val', newValue);
        state.options = [];
        // this.selectValue = null
        //this.getList()
    },
    { deep: true }
)

function handleQuery() {
  sampleListQuery({
    ...state.queryParams,
    ...state.queryForm
  }).then(({ data }) => {
    //console.log(data);
  });
}


</script>

<style>
</style> -->