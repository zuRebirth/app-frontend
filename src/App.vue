<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view></router-view>
    <DialogManager />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import DialogManager from '@/components/dialogManager/dialogManager.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';
import useStore from '@/store';

const { app } = useStore()

const size: any = ref('default')
const language = computed(() => app.language)
// 翻译文本对象
const locale = ref()

watch(
  language,
  value => {
    locale.value = value === 'en' ? en : zhCn
  },
  {
    // 初始化后立即执行
    immediate: true
  }
)

</script>