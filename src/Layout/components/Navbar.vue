<template>
  <div class="navbar">
    <Hamburger
      :is-active="sidebar.opened"
      @toggleClick="toggleSidebar"
      class="hamburger-container"
    />
    <Breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <Screenfull id="screenfull" class="right-menu-item hover-effect" />
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <SizeSelect class="right-menu-item hover-effect" />
        </el-tooltip>
        <LangSelect class="right-menu-item hover-effect" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <CaretBottom style="width: 0.6em; height: 0.6em; margin-left: 5px" />
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="logout">
              {{ $t('navbar.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import Screenfull from "@/components/Screenfull/index.vue";
import SizeSelect from "@/components/SizeSelect/index.vue";
import LangSelect from "@/components/LangSelect/index.vue";
// 图标依赖
import { CaretBottom } from '@element-plus/icons-vue';

import useStore from "@/store";
import { ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
const { app, user } = useStore();

const route = useRoute()
const router = useRouter()

const sidebar = computed(() => app.sidebar);
const device = computed(() => app.device);
const avatar = computed(() => user.avatar)

const toggleSidebar = () => {
  app.toggleSidebar();
}

const logout = () => {
  ElMessageBox.confirm('确认注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    user.logout().then(() => {
      router.push(`/login?redirct=${route.fullPath}`)
    })
  })
}
</script>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  overflow: hidden;

  .breadcrumb-container {
    float: left;
  }
  .hamburger-container {
    line-height: 46px;
    float: left;
    height: 100%;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
