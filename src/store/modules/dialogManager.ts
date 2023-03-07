import { defineStore } from "pinia";
import { DialogManagerState } from "../../types/store/dialogManager";
import defaultSettings from '../../settings';

const { showSettings, sidebarLogo, fixedHeader } = defaultSettings

const useDialogManager = defineStore({
  id: 'dialogManager',
  state: (): DialogManagerState => ({
    // 全局弹窗列表
    dialogList: []
  }),
  actions: {
    addDialog(dialog: any) {
      this.dialogList.push(dialog)
      // console.log(this.dialogList)
    },
    openDialog(key: any) {
      this.dialogList.forEach((dialog: any) => {
        if(dialog.key === key) {
          if (dialog.meta.isDestroyByClose) {
            dialog.render = true
          }
          dialog.show = true
          return false
        }
      })  
    },
    updateDialog(dialog: any) {
      let findIndex = null
      this.dialogList.forEach((item: any, index) => {
        if(item.key === dialog.key) {
          findIndex = index
          return false
        }
      })
      if(findIndex !== null) {
        this.dialogList[findIndex] = dialog
      }
    },
    closeDialog(key: any) {
      this.dialogList.forEach((dialog:any) => {
        if(dialog.key === key) {
          dialog.show = false
          if(dialog.meta.isDestroyByClose) {
            dialog.render = false
          }
          return false
        }
      })
    },
    removeDialog(key: any) {
      let findIndex = null
      this.dialogList.forEach((dialog: any, index) => {
        if (dialog.key === key) {
          findIndex = index
          return false
        }
      })
      if (findIndex !== null) {
        this.dialogList.splice(findIndex, 1)
      }
    },
    setDialogButtonLoading(data: any) {
      if (data) {
        this.dialogList.forEach((dialog: any, index) => {
          if (dialog.key === data.key) {
            if (data.btnId === 'confirm') {
              dialog.confirmBtnLoading = data.value
            } else if (data.btnId === 'cancel') {
              dialog.cancelBtnLoading = data.value
            }
            return false
          }
        })
      }
    }
  }
})

export default useDialogManager