<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <template
      v-if="  
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        (!item.meta || !item.meta.alwaysShow)
      "
    >
      <Applink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <SvgIcon v-if="onlyOneChild.meta && onlyOneChild.meta.icon" :icon-class="onlyOneChild.meta.icon" />
          <template #title>
            {{ generateTitle(onlyOneChild.meta.title) }}
          </template>
        </el-menu-item>
      </Applink>
    </template>
    <el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <!-- popper-append-to-body -->
      <template #title>
        <svg-icon
          v-if="item.meta && item.meta.icon"
          :icon-class="item.meta.icon"
        ></svg-icon>
        <span v-if="item.meta && item.meta.title">{{
          generateTitle(item.meta.title)
        }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :is-nest="true"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>
<script setup lang='ts'>
import path from 'path-browserify'
import { isExternal } from '@/utils/validate'
import { generateTitle } from '@/utils/i18n';
import { ref } from 'vue'
import Applink from './Link.vue'
import SvgIcon from '@/components/SvgIcon/index.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    required: false
  },
  basePath: {
    type: String,
    required: true
  }
})

const onlyOneChild = ref()

const hasOneShowingChild = (children = [] as any, parent: any) => {
  if (!children) {
    children = []
  }
  const showingChildren = children.filter((item: any) => {
    if (item.meta && item.meta.hidden) {
      return false
    } else {
      // 如果只有一个显示子对象，则使用item设置
      onlyOneChild.value = item;
      return true
    }
  })
  // console.log('showingChildren', showingChildren)

  // 当只有一个子路由器时，默认显示该子路由器
  if (showingChildren.length === 1) {
    return true
  }

  // 如果没有子路由器显示，则显示父路由器 
  if (!showingChildren.length) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}
const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  return path.resolve(props.basePath, routePath);
}
</script>
<style lang='scss' scoped>
</style>