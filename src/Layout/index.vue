<template>
    <div :class="classObj" class="app-wrapper">
        <!-- <div v-if="device === 'mobile'" && sidebar.opened
            class="drawer-bg"
            @click="handleClickOutside"
        /> -->
        <Sidebar class="sidebar-container" />
        <div :class="{}" class="main-container">
            <div :class="{ 'fixed-header': fixedHeader }">
                <Navbar />
                <TagsView />
            </div>
            <!-- 主页面 -->
            <AppMain />

            <!-- 设置面板 暂时不做-->
            <div></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useStore from '../store';
import Sidebar from './components/Sidebar/index.vue'
import { Navbar, AppMain, TagsView } from './components/index';

const { app, setting, permission } = useStore();

const sidebar = computed(() => app.sidebar)
const fixedHeader = computed(() => setting.fixedHeader)

const classObj = computed(() => ({
    hideSidebar: !sidebar.value.opened,
    openSidebar: sidebar.value.opened,
    withoutAnimation: sidebar.value.withoutAnimation,
}))

const handleClickOutside = () => {
    app.closeSideBar(false);
}

</script>

<style lang="scss" scoped>
@import '@/styles/variables.module.scss';

.app-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.fix-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}


.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
</style>