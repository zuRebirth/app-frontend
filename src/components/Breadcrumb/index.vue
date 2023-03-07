<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1" class="no-redirect">
          {{ generateTitle(item.meta.title) }}
        </span>
        <a v-else @click.prevent="handleLink(item)">
          {{ generateTitle(item.meta.title) }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { RouteLocationMatched, useRoute } from 'vue-router';
import { generateTitle } from '@/utils/i18n';
import { compile } from 'path-to-regexp';
import { ref, onBeforeMount, watch } from 'vue';
import router from '@/router';

const currentRoute = useRoute()
const breadcrumbs = ref([] as Array<RouteLocationMatched>)
const pathCompile = (path: string) => {
  const { params } = currentRoute;
  const toPath = compile(path);
  return toPath(params);
};


const getBreadcrumb = () => {
  let matched = currentRoute.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]
  // 是否是首页，不是则拼接dashoboard
  if (!isDashboard(first)) {
    matched = [
      { path: '/dashboard', meta: { title: 'dashboard' } } as any
    ].concat(matched);
  }
  breadcrumbs.value = matched.filter(item => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false
  })
}

const isDashboard = (route: RouteLocationMatched) => {
  const name = route && route.name
  if (!name) {
    return false
  }
  return (
    name.toString().trim().toLocaleLowerCase() ===
    'Dashboard'.toLocaleLowerCase()
  )
}

const handleLink = (item: any) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect).catch(err => {
      console.log(err)
    })
    return
  }
  router.push(pathCompile(path)).catch(err => {
    console.log(err)
  })
}

watch(
  () => currentRoute.path,
  path => {
    if (path.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  }
)

onBeforeMount(() => {
  getBreadcrumb()
});

</script>

<style scoped lang="scss">
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>