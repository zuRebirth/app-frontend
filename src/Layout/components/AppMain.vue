<template>
  <div>
    <section class="app-main">
      <router-view v-slot="{ Component, route }">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.fullPath"></component>
        </keep-alive>
      </router-view>
    </section>
  </div>
</template>

<script setup lang="ts">
import useStore from '@/store';
import { computed } from 'vue';

const { tagsView } = useStore()
const cachedViews = computed(() => tagsView.cachedViews)

</script>


<style scoped lang="scss">
.app-main {
  min-height: calc(100% - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}




</style>