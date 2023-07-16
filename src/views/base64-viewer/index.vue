<template>
  <div class="base64-page">
    <div class="line-1 tw-mb-4">
      <div class="uploader-wrap tw-mr-4 tw-shadow-sm tw-rounded-md tw-p-4">
        <FileUpload
          customUpload
          :multiple="false"
          :maxFileSize="10 * 1024 * 1024"
          @select="onSelect"
          :showUploadButton="false"
        >
          <template #empty>
            <p>点击按钮上传或将文件拖拽到这里，文件可以是任意格式的文本文件</p>
          </template>
        </FileUpload>
      </div>
      <div class="viewer-wrap tw-shadow-sm tw-rounded-md tw-p-4">
        <Image
          v-if="imgSrc"
          :src="imgSrc"
          imageStyle="height:100%;width:100%"
          class="image-object"
          preview
        />
        <div v-else class="no-img tw-rounded-md">
          <p>选择文件或输入base64后，点击按钮</p>
        </div>
        <div class="trans-btn">
          <p class="p-buttonset">
            <Button :disabled="!base64Str" @click="genImg" label="生成图片" />
            <Button :disabled="!base64Str" @click="genPdf" label="生成PDF" />
          </p>
        </div>
      </div>
    </div>
    <div class="line-2 tw-shadow-sm tw-rounded-md tw-p-4">
      <div class="input-wrap">
        <Textarea
          v-model="base64Str"
          style="width: 100%"
          placeholder="请输入bse64"
        />
      </div>
    </div>
    <Dialog
      v-model:visible="pdfViewerVisible"
      modal
      header="PDF预览"
      :style="{ minWidth: '50rem' }"
      position="top"
    >
      <div class="iframe-wrap">
        <iframe :src="pdfSrc" frameborder="0"></iframe>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Image from "primevue/image";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Dialog from "primevue/dialog";

const pdfViewerVisible = ref(false);
const imgSrc = ref("");
const pdfSrc = ref("");
const base64Str = ref("");

const onSelect = (e) => {
  console.log(e);
  const file = e.files[0];
  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = (e2) => {
    base64Str.value = e2?.target?.result;
  };
  reader.onerror = (err) => {
    console.log(err);
  };
};
const genImg = () => {
  imgSrc.value = `data:image/png;base64,${base64Str.value}`;
};
const genPdf = () => {
  pdfSrc.value = `data:application/pdf;base64,${base64Str.value}`;
  pdfViewerVisible.value = true;
};
</script>

<style lang="scss">
.base64-page {
  .line-1 {
    height: 300px;
    display: flex;
    flex-direction: row;
    // margin-bottom: ;
    .uploader-wrap {
      height: 100%;
      background-color: #fff;
      flex-grow: 1;
      .p-fileupload-file-thumbnail {
        visibility: hidden;
      }
    }
    .viewer-wrap {
      width: 240px;
      height: 100%;
      background-color: #fff;
      .no-img,
      .image-object {
        width: 200px;
        height: 200px;
        margin: 0 auto;
      }
      .no-img {
        background-color: #eee;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        @apply tw-text-gray-400;
      }
      .trans-btn {
        @apply tw-mt-4;
        text-align: center;
      }
    }
  }
  .line-2 {
    background-color: #fff;
    min-height: 100px;
  }
}
.iframe-wrap {
  @apply tw-p-4;
  height: calc(100vh - 180px);
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
