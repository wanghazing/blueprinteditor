<script setup lang="ts">
import { onMounted, ref } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

import { useFeedbackStore } from "/@/store/feedback";

import Layout from "./layout/index.vue";

const toast = useToast();
const feedback = useFeedbackStore();

const loadingSpinCount = ref(0);
onMounted(() => {
  window.addEventListener("toast", (e) => {
    console.log(e);
    const {
      severity = "info",
      summary = "温馨提示",
      message,
      life = 3000,
    } = (e as CustomEvent).detail;
    toast.add({
      severity,
      summary,
      detail: message,
      life,
    });
  });
  setInterval(() => {
    if (++loadingSpinCount.value > 100) {
      loadingSpinCount.value = 0;
    }
  }, 330);
});
</script>

<template>
  <Layout></Layout>
  <Toast />
  <div id="loadingOverlay" v-if="feedback.showLoading">
    <div class="loading-icon tw-h-16 tw-w-16 tw-leading-8 tw-text-center">
      <i class="pi pi-spin pi-spinner tw-text-sky-500 tw-text-xl"></i>
      <p class="tw-text-xs tw-text-gray-600">
        {{ feedback.loadingText }}
        <span
          :style="{
            visibility: loadingSpinCount % 3 > -1 ? 'visible' : 'hidden',
          }"
          >.</span
        >
        <span
          :style="{
            visibility: loadingSpinCount % 3 > 0 ? 'visible' : 'hidden',
          }"
          >.</span
        >
        <span
          :style="{
            visibility: loadingSpinCount % 3 > 1 ? 'visible' : 'hidden',
          }"
          >.</span
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
#loadingOverlay {
  @apply tw-bg-gray-400/50;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
