import useUserStore from './modules/user'
import useAppStore from './modules/app'
import useSetting from './modules/setting'
import usePermissionStore from './modules/permission'
import useTagViewStore from './modules/tagsView'
import useDialogManager from './modules/dialogManager'
const useStore = () => ({
    user: useUserStore(),
    app: useAppStore(),
    permission: usePermissionStore(),
    setting: useSetting(),
    tagsView: useTagViewStore(),
    dialogManager: useDialogManager()
})
export default useStore