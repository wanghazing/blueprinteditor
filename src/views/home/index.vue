<template>
  <div class="home-page">
    <Card>
      <template #content>
        <Fieldset>
          <template #legend>
            <div class="flex align-items-center text-primary">
              <span class="pi pi-box tw-mr-2"></span>
              <span class="font-bold text-lg">常用功能</span>
            </div>
          </template>
          <div class="tools-panel">
            <div class="tools-item" v-for="tool in toolList" :key="tool.id">
              <Button link :label="tool.label" @click="tool.action" />
            </div>
          </div>
        </Fieldset>
      </template>
    </Card>
    <Card class="tw-mt-4">
      <template #content>
        <Fieldset>
          <template #legend>
            <div class="flex align-items-center text-primary">
              <span class="pi pi-th-large tw-mr-2"></span>
              <span class="font-bold text-lg">特色功能</span>
            </div>
          </template>
          <div class="tools-panel">
            <div class="tools-item" v-for="tool in tsToolList" :key="tool.id">
              <Button link :label="tool.label" @click="tool.action" />
            </div>
          </div>
        </Fieldset>
      </template>
    </Card>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Card from "primevue/card";
import Fieldset from "primevue/fieldset";
import Button from "primevue/button";
const router = useRouter();

const toolList = ref([
  {
    id: 0,
    label: "导航书签",
    action: () => {
      router.push("/bookmark");
    },
  },
  {
    id: 1,
    label: "表单代码生成",
    action: () => {
      router.push("/table-code-gen");
    },
  },
  {
    id: 2,
    label: "日期时间转换",
    action: () => {
      router.push("/date-change");
    },
  },
  {
    id: 3,
    label: "常用正则",
    action: () => {
      router.push("/regexp-instance");
    },
  },
  {
    id: 4,
    label: "随机生成",
    action: () => {
      router.push("/random-gen");
    },
  },
  {
    id: 5,
    label: "url解码/编码",
    action: () => {
      router.push("/decode-encode");
    },
  },
  {
    id: 6,
    label: "base64查看",
    action: () => {
      router.push("/base64-viewer");
    },
  },
  {
    id: 7,
    label: "颜色转换",
    action: () => {
      router.push("/color-transform");
    },
  },
  {
    id: 8,
    label: "二维码生成",
    action: () => {
      router.push("/qrcode-gen");
    },
  },
]);
const tsToolList = ref([
  {
    id: 1,
    label: "电子书",
    action: () => {
      router.push("/mdbook");
    },
  },
  {
    id: 2,
    label: "文件同步",
    action: () => {
      router.push("/chokidar");
    },
  },
  {
    id: 3,
    label: "weex-animator",
    action: () => {
      router.push("/weex-animator");
    },
  },
]);
</script>

<style lang="scss">
.home-page {
  .p-fieldset-legend {
    @apply tw-ml-4;
  }
  .tools-panel {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .tools-item {
    width: 20%;
    text-align: center;
  }
}
</style>
