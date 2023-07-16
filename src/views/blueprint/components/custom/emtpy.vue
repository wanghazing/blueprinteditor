<template>
  <div class="node-component node-empty">
    <h1
      class="blueprint-node--title"
      @mousedown="(e) => $emit('onTitleMouseDown', e)"
    >
      空组件
    </h1>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
</script>

<style lang="scss">
.page-node-empty {
}
</style>
