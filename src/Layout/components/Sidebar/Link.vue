<template>
  <a v-if="isExternal(to)" :href="to" target="_blank">
    <slot />
  </a>
  <div v-else @click="push">
    <slot />
  </div>
</template>
<script setup lang='ts'>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { isExternal } from '@/utils/validate';
import useStore from "@/store";

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})
const { app } = useStore()
const sidebar = computed(() => app.sidebar)
const devicd = computed(() => app.device)

const router = useRouter()
const push = () => {
  router.push(props.to).catch(err => {
    console.log(err)
  })
}

</script>
<style lang='scss' scoped>
</style>