<template>
  <div class="_404-page">
    <img :src="svg404" alt="" :style="calcStyle" srcset="" />
    <p>页面施工中...</p>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from "vue";
import svg404 from "/@/assets/images/404.svg";

// const state = reactive({});
const { innerWidth, innerHeight } = window;
const imgHeight = window.innerHeight * 0.7;
const imgWidth = (imgHeight * 1080) / 933;
const calcStyle = ref({});
const translateX = ref(0);
const translateY = ref(0);
const readMousePos = (e: MouseEvent) => {
  // console.log(e);
  translateX.value = (innerWidth / 2 - e.x) / 45;
  translateY.value = (innerHeight / 2 - e.y) / 75;
  calcStyle.value = {
    height: imgHeight + "px",
    width: imgWidth + "px",
    transform: `translate(${~~translateX.value}px, ${~~translateY.value}px)`,
  };
};
onMounted(() => {
  calcStyle.value = {
    height: imgHeight + "px",
    width: imgWidth + "px",
  };
  document.body.addEventListener("mousemove", readMousePos);
});
onUnmounted(() => {
  document.body.removeEventListener("mousemove", readMousePos);
});
</script>

<style lang="scss">
._404-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @apply tw-text-gray-700;
  @apply tw-text-xl;
}
</style>
