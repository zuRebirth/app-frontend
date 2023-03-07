<template>
  <div>
    <el-dialog
      v-for="dialog in dialogList"
      :ref="dialog.key"
      :key="dialog.key"
      v-model="dialog.show"
      :title="dialog.meta.title"
      :width="getDialogWidth(dialog)"
      :fullscreen="dialog.meta.fullscreen"
      :close-on-click-modal="dialog.meta.closeOnClickModal === true"
      :close-on-press-escape="false"
      :show-close="dialog.meta.showClose !== false"
      :custom-class="dialog.meta.customClass"
      :center="dialog.meta.center"
      @close="close(dialog)"
    >
      <div :style="getDialogStyle(dialog)">
        <dialog-render
          v-if="dialog.render"
          :ref="`dialogBody_${dialog.key}`"
          :key="dialog.key"
        />
      </div>
      <template #footer>
        <div
          v-if="dialog.meta.isShowFooter !== false"
          :class="footeralign(dialog.meta.footerAlign)"
          class="dialog-footer"
        >
          <el-button
            v-if="dialog.meta.isShowCancelBtn !== false"
            size=""
            plain
            :loading="dialog.cancelBtnLoading"
            @click="cancel(dialog)"
          >
            {{ dialog.meta.cancelBtnTxt || '取消' }}
          </el-button>
          <el-button
            v-if="dialog.meta.isShowConfirmBtn !== false"
            type="primary"
            size=""
            style="margin-left: 10px"
            :disabled="dialog.confirmBtnLoading"
            :loading="dialog.confirmBtnLoading"
            @click="confirm(dialog)"
          >
            {{ dialog.meta.confirmBtnTxt || '确定' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import useStore from '@/store';
import { ComponentInternalInstance, computed, createApp, getCurrentInstance, h, onBeforeMount, onMounted, ref, markRaw } from 'vue';
const { dialogManager } = useStore();

const dialogList: any = computed(() => dialogManager.dialogList);
const dialogBodySize = ref('');
// 是否由取消按钮触发close事件
let closeByCancel: any = ref(false);
const emit = defineEmits(['close']);

function getDialogStyle(dialog: any) {
  if (dialog.meta.bodyHeight < 150) {
    dialog.meta.bodyHeight = 150;
  } else if (dialog.meta.bodyHeight > 570) {
    dialog.meta.bodyHeight = 570;
  }
  if (dialog.meta.minHeightStatus) {
    return {
      minHeight: dialog.meta.bodyHeight + 'px',
      maxHeight: '570px'
    };
  } else {
    return {
      height: dialog.meta.bodyHeight + 'px'
    };
  }
}

function getDialogWidth(dialog: any) {
  if (dialog.meta.width) {
    if (typeof dialog.meta.width === 'number') {
      return dialog.meta.width + 'px';
    }
    return dialog.meta.width;
  } else {
    switch (dialog.meta.size) {
      case 'small':
        return '500px';
      case 'normal':
        return '700px';
      case 'large':
        return '900px';
      default:
        return '700px';
    }
  }
}

function footeralign(type: any) {
  if (type) {
    switch (type) {
      case 'center':
        return 'dialog-footer-center';
      case 'left':
        return 'dialog-footer-left';
      case 'right':
        return 'dialog-footer-right';
      default:
        return '';
    }
  }
  return '';
}

function confirm(dialog: any) {
  let dialogRef: any = `dialogBody_${dialog.key}`;
  dialogRef = ref(null);
  if (
    dialogRef &&
    dialogRef.$children &&
    dialogRef.$children.confirm &&
    dialogRef.$children.confirm instanceof Function
  ) {
    dialogRef.$children.confirm();
  }
}
function cancel(dialog: any) {
  closeByCancel = true;
  // const dialogRef = this.$refs[`dialogBody_${dialog.key}`]
  let dialogRef: any = `dialogBody_${dialog.key}`;
  dialogRef = ref(null);
  console.log('dialogRef', dialogRef)
  if (
    dialogRef &&
    dialogRef.$children &&
    dialogRef.$children.cancel &&
    dialogRef.$children.cancel instanceof Function
  ) {
    dialogRef.$children.cancel();
  }
}

function close(dialog: any) {
  emit('close');
  if (closeByCancel) {
    closeByCancel = false;
    return;
  }
  const { dialogManager } = useStore();
  dialogManager.closeDialog(dialog.key);
  cancel(dialog);
}

onMounted(() => {
  const { proxy, appContext }:any = getCurrentInstance() as ComponentInternalInstance
  let currentDialog:any = markRaw({});
  const key = proxy.$.vnode.key;
  const attrs = {
    'data-dialogkey': key
  };
  dialogList.value.forEach((dialog: any) => {
    if (dialog.key === key) {
      currentDialog.value = dialog;
      return false;
    }
  });
  appContext.app.component('dialog-render', {
    props: {
      //
    },
    render() {
      const { proxy }:any = getCurrentInstance() as ComponentInternalInstance
      let currentDialog: any = markRaw({});
      const key = proxy.$.vnode.key;
      const attrs = {
        'data-dialogkey': key
      };
      dialogList.value.forEach((dialog:any) => {
        if (dialog.key === key) {
          // console.log('===currentDialog.value', currentDialog.value)
          currentDialog.value = dialog;
          return false;
        }
      });
      if (currentDialog.value) {
        // console.log('return currentDialog.value', currentDialog.value)
        return h(currentDialog.value.component, {
          ...attrs,
          ...currentDialog.value.props,
          events: currentDialog.value.events
        });
      }
      return h('div');
    }
  });
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__title) {
  font-weight: bold;
}
</style>
