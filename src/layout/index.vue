<template>
  <!-- <header class="layout-top">
    <Menubar :model="state.items" />
  </header> -->
  <section class="layout-main">
    <div class="client-full layout-main--body">
      <router-view v-slot="{ Component }">
        <transition name="smove">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </section>
</template>
<script lang="ts" setup>
import Menubar from "primevue/menubar";
import { reactive } from "vue";
const state = reactive({
  items: [
    {
      label: "常用",
      icon: "pi pi-fw pi-th-large",
      to: "/home",
    },
    {
      label: "代理",
      icon: "pi pi-fw pi-send",
      to: "/proxy",
    },
    {
      label: "Api Log",
      icon: "pi pi-fw pi-file-clock",
      to: "/api-history",
    },
    {
      label: "蓝图",
      icon: "pi pi-fw pi-hash-tag",
      to: "/blueprint",
    },
    {
      label: "文件下载",
      icon: "pi pi-fw pi-download",
      to: "/download",
    },
  ],
});
</script>

<style lang="scss">
.layout-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
}
.layout-main {
  background-color: #ecf3f4;
  // margin-top: 70px;
  padding-top: 20px;
  &--body {
    // background-color: #fff;
    margin: 0 auto;
    min-height: calc(100vh - 20px);
    position: relative;
  }
}
.smove-enter-active,
.smove-leave-active {
  transition: all 0.3s ease;
}
.smove-enter-from,
.smove-leave-to {
  opacity: 0.4;
  transform: translateX(-100px);
}
</style>
