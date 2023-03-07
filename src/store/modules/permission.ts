import { defineStore } from "pinia";
import { RouteRecordRaw } from "vue-router";
import { PermissionState } from '@/types/store/permission'
import { constantRoutes } from "@/router";

const modules = import.meta.glob('../../views/**/**.vue')
export const Layout = () => import('@/layout/index.vue')
import fetchApi from "@/api";
export const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if(route.meta && route.meta.roles) {
    if(roles.includes('ROOT')){
      return true
    }
    return roles.some((role) => {
      if(route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role)
      }
    })
  }
  return false
}

export const filterAsyncRoutes = (
  routes: RouteRecordRaw[],
  roles: string[]
) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tmp = { ...route } as any
    if(hasPermission(roles, tmp)) {
      if(tmp.component === 'Layout') {
        tmp.component = Layout
      } else {
        const component = modules[`../../views/${tmp.component}.vue`] as any
        if(component) {
          tmp.component = modules[`../../views/${tmp.component}.vue`]
        } else {
          tmp.component = modules[`../../views/error-page/404.vue`]
        }
      }
      res.push(tmp)
      if(tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
    }
  })
  return res
}

const usePermissionStore = defineStore({
  id: 'permission',
  state: ():PermissionState => ({
    routes: [],
    addRoutes: []
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    generateRoutes(roles: string[]) {
      return new Promise((resolve, reject) => {
        const listRoutes = () => fetchApi({
          url: '/getRoute',
          method: 'post',
        })
        listRoutes()
          .then((res) => {
            const asyncRoutes = res.data
            const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            this.setRoutes(accessedRoutes)
            resolve(accessedRoutes)
        })
        .catch((err) => {
          reject(err)
        })
      })
    }
  }
})

export default usePermissionStore