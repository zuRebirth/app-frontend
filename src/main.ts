import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from "pinia"
import i18n from './lang'
// 自定义样式
import '@/styles/index.scss';
// 引入SVG ICON
import 'virtual:svg-icons-register';
import App from './App.vue'
import router from '@/router'
import '@/permission';
// 导入mock
import './mock/index.ts'
// 引入vxe-table
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import Pagination from '@/components/Pagination/index.vue';
import TablePanel from '@/components/TablePanel/index.vue';

const app = createApp(App)

app
  .component('Pagination', Pagination)
  .component('TablePanel', TablePanel)
  .use(createPinia())
  .use(ElementPlus)
  .use(router)
  .use(i18n)
  .use(VXETable)
  .mount('#app')