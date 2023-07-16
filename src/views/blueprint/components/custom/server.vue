<template>
  <div class="node-component node-server" @contextmenu="onNodeContextMenu">
    <h1
      class="node-component--title"
      @mousedown="(e) => $emit('onTitleMouseDown', e)"
    >
      <input
        v-if="props.editFlag"
        :id="`node-title-input-${props.nodeId}`"
        type="text"
        @blur="onInputTitle"
        placeholder="请输入"
      />
      <div class="node-component--title--text" v-else>
        <span v-tooltip.bottom="{ value: props.title, showDelay: 1500 }">{{
          props.title
        }}</span>
        <i v-if="props.isActive" @click="onEditTitle" class="pi pi-pencil"></i>
      </div>
    </h1>
    <div class="node-component--rows">
      <div
        class="row-item"
        :class="{
          'row-item__input': row.inputId,
          'row-item__output': row.outputId,
        }"
        v-for="(row, idx) in props.rows"
        :key="idx"
      >
        <input
          v-if="editHostFlag"
          type="text"
          @blur="onEditHostFinish"
          placeholder="服务地址"
        />
        <span
          v-else
          class="row-item--title"
          v-tooltip.bottom="row.inputId ? props.host : row.rule"
          >{{ row.inputId ? props.host : row.rule }}</span
        >
        <div
          v-if="row.inputId"
          class="port-point-i"
          :data-pointid="row.inputId"
          :data-nodeid="props.nodeId"
          data-pointType="input"
          :style="{ top: 40 + 29 * idx + 'px' }"
          @mousedown="
            (e) =>
              $emit('onPointMouseDown', {
                event: e,
                type: 'input',
                id: row.inputId,
              })
          "
        ></div>
        <div
          v-if="row.outputId"
          class="port-point-o"
          :data-pointid="row.outputId"
          :data-nodeid="props.nodeId"
          data-pointType="output"
          :style="{ top: 40 + 29 * idx + 'px' }"
          @mousedown="
            (e) =>
              $emit('onPointMouseDown', {
                event: e,
                type: 'output',
                id: row.outputId,
              })
          "
        ></div>
      </div>
    </div>
    <ContextMenu ref="contextmenu" :model="contextMenuList"></ContextMenu>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { useBlueprintStore } from "/@/store/blueprint";
const blueprintStore = useBlueprintStore();
const props = defineProps([
  "title",
  "rows",
  "nodeId",
  "editFlag",
  "isActive",
  "host",
]);
const editTitleFlag = ref(false);
const editHostFlag = ref(false);
const contextMenuList = ref([
  {
    label: "编辑地址",
    icon: "pi pi-fw pi-pencil",
    command: () => {
      editHostFlag.value = true;
    },
  },
]);
const onNodeContextMenu = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
};
const onEditHostFinish = (e: FocusEvent) => {
  const value = (e.target as HTMLInputElement).value;
  if (value) {
    blueprintStore.setHost(props.nodeId, value);
  }
};
const onEditTitle = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  editTitleFlag.value = true;
  blueprintStore.setNodeEditFlag(props.nodeId, true);
  nextTick(() => {
    const input = document.getElementById(`node-title-input-${props.nodeId}`);
    if (input) {
      console.log(input);
      input.focus();
    }
  });
};
const onInputTitle = (e: FocusEvent) => {
  blueprintStore.setNodeTitle(
    props.nodeId,
    (e.target as HTMLInputElement).value || "未命名"
  );
};
</script>

<style lang="scss">
.node-server {
  .node-component--title {
    background-color: rgba(175, 22, 206, 0.81) !important;
  }
}
</style>
