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
<script lang="ts" setup></script>

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
