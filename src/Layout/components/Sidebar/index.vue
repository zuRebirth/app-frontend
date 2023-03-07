<template>
  <div :class="{ 'has-logo': showLogo }">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar>
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
        :text-color="variables.menuText" :active-text-color="variables.menuActiveText" :unique-opened="false"
        :collapse-transition="false" mode="vertical">
        <SidebarItem v-for="route in routes" :item="route" :key="route.path" :base-path="route.path"
          :is-collapse="isCollapse" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import useStore from "@/store";
import Logo from './Logo.vue';
import variables from '@/styles/variables.module.scss';
import SidebarItem from "./SidebarItem.vue";

const { setting, app, permission } = useStore()

const route = useRoute()
const routes = computed(() => permission.routes)
const showLogo = computed(() => setting.sidebarLogo)
const isCollapse = computed(() => !app.sidebar.opened)

const activeMenu = computed(() => {
  const { meta, path } = route
  //如果设置了path，侧边栏将突出显示你设置的路径
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})

</script>