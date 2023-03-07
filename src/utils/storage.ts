/**
 * window.localStorage 浏览器永久缓存
 */
export const localStorage = {
    set(key: string, val: any) {
        window.localStorage.setItem(key, JSON.stringify(val))
    },
    get(key: string) {
        const json: any = window.localStorage.getItem(key)
        return JSON.parse(json)
    },
    remove(key: string) {
        window.localStorage.removeItem(key)
    },
    clear() {
        window.localStorage.clear()
    }
}

/**
 * window.sessionStorage 浏览器临时缓存
 */
export const sessionStorage = {
    set(key: string, val: any) {
        window.sessionStorage.setItem(key, JSON.stringify(val))
    },
    get(key: string) {
        const json: any = window.sessionStorage.getItem(key)
        return JSON.parse(json)
    },
    remove(key: string) {
        window.sessionStorage.removeItem(key)
    },
    clear() {
        window.sessionStorage.clear()
    }
}