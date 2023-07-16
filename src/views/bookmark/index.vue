<template>
  <div class="bookmark-page">
    <Card
      v-for="(folder, index) in folderList"
      :key="index"
      :class="{ 'tw-mt-4': index > 0 }"
    >
      <template #content>
        <Fieldset>
          <template #legend>
            <div class="flex align-items-center text-primary">
              <span class="pi pi-box tw-mr-2"></span>
              <span class="font-bold text-lg">{{ folder.name }}</span>
            </div>
          </template>
          <div class="files-panel">
            <div
              class="files-item"
              v-for="(file, idx) in folder.fileList"
              :key="idx"
            >
              <Button link :label="file.name" @click="goLink(file.link)" />
            </div>
          </div>
        </Fieldset>
      </template>
    </Card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Fieldset from "primevue/fieldset";
import Button from "primevue/button";

import { useBookmarkApi } from "/@/api/bookmark";

const { getAllList } = useBookmarkApi();

const folderList = ref([]);
const goLink = (link: string) => {
  window.open(link);
};
const getList = async () => {
  const res = await getAllList();
  folderList.value = res.data;
};
onMounted(() => {
  getList();
});
</script>

<style lang="scss">
.bookmark-page {
  .p-fieldset-legend {
    @apply tw-ml-4;
  }
  .files-panel {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .files-item {
    width: 20%;
    text-align: center;
  }
}
</style>
