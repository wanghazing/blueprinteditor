<template>
  <div class="page-history">
    <div class="server-list tw-mr-4 tw-shadow-sm tw-rounded-md tw-p-4"></div>
    <div class="log-list">
      <div class="search-panel tw-shadow-sm tw-rounded-md tw-p-4 tw-mb-4"></div>
      <div class="data-panel tw-shadow-sm tw-rounded-md tw-p-4 tw-mb-4"></div>
      <div class="pagination-panel tw-shadow-sm tw-rounded-md tw-p-4"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
</script>

<style lang="scss">
.page-history {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 1rem;
  display: flex;
  flex-direction: row;
  .server-list {
    background-color: #fff;
    width: 200px;
  }
  .log-list {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .search-panel {
      background-color: #fff;
      min-height: 80px;
    }
    .data-panel {
      background-color: #fff;
      min-height: 80px;
      flex-grow: 1;
    }
    .pagination-panel {
      background-color: #fff;
      min-height: 80px;
    }
  }
}
</style>
