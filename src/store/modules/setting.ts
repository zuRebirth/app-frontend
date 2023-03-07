import { defineStore } from "pinia";
import { SettingState } from "../../types/store/settings";
import defaultSettings from '../../settings';

const { showSettings, sidebarLogo, fixedHeader } = defaultSettings

const useSettingStore = defineStore({
  id: 'setting',
  state: (): SettingState => ({
    showSettings: showSettings,
    sidebarLogo: sidebarLogo,
    fixedHeader: fixedHeader
  })
})

export default useSettingStore