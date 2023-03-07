<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
   <slot /> 
  </el-scrollbar>
</template>

<script setup lang="ts">
import useStore from '@/store';
import { TagView } from '@/types/store/tagsview';
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';

const { tagsView } = useStore()

const { proxy } = getCurrentInstance() as any

const scrollWrapper = computed(() => proxy?.$refs.scrollContainer.$refs.wrap$)

const visitedViews = computed(() => tagsView.visitedViews)

const tagAndTagSpacing = ref(4);

// 声明emit
const emit = defineEmits(['handleScroll'])

// 声明子传父事件
const emitScroll = () => {
  emit('handleScroll')
}

onMounted(() => {
  scrollWrapper.value.addEventListener('scroll', emitScroll, true)
});

onBeforeUnmount(() => {
  scrollWrapper.value.removeEventListener('scroll', emitScroll);
});

function handleScroll(e: WheelEvent) {
  const eventDelta = (e as any).wheelDelta || -e.deltaY * 40;
  scrollWrapper.value.scrollLeft =
    scrollWrapper.value.scrollLeft + eventDelta / 4;
}

function moveToTarget(currentTag: TagView) {
  const $container = proxy.$refs.scrollContainer.$el;
  const $containerWidth = $container.offsetWidth;
  const $scrollWrapper = scrollWrapper.value;

  let firstTag = null;
  let lastTag = null;

  // find first tag and last tag
  if (visitedViews.value.length > 0) {
    firstTag = visitedViews.value[0];
    lastTag = visitedViews.value[visitedViews.value.length - 1];
  }

  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0;
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
  } else {
    const tagListDom = document.getElementsByClassName('tags-view-item');
    const currentIndex = visitedViews.value.findIndex(
      (item: any) => item === currentTag
    );
    let prevTag = null;
    let nextTag = null;
    for (const k in tagListDom) {
      if (k !== 'length' && Object.hasOwnProperty.call(tagListDom, k)) {
        if (
          (tagListDom[k] as any).dataset.path ===
          visitedViews.value[currentIndex - 1].path
        ) {
          prevTag = tagListDom[k];
        }
        if (
          (tagListDom[k] as any).dataset.path ===
          visitedViews.value[currentIndex + 1].path
        ) {
          nextTag = tagListDom[k];
        }
      }
    }

    // the tag's offsetLeft after of nextTag
    console.log(nextTag);
    const afterNextTagOffsetLeft =
      (nextTag as any).offsetLeft +
      (nextTag as any).offsetWidth +
      tagAndTagSpacing.value;
    
    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft =
      (prevTag as any).offsetLeft - tagAndTagSpacing.value;
    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
    }
  }
}

defineExpose({
  moveToTarget,
});

</script>