<template>
  <div class="node-component node-response" @contextmenu="onNodeContextMenu">
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
        @contextmenu="(e) => onShowContextmenu(row, e)"
      >
        <span
          class="row-item--title"
          v-tooltip.bottom="row.inputId ? '输入' : row.rule"
          >{{ row.inputId ? "输入" : row.rule }}</span
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
      <div class="row-item row-item__add" v-if="addRuleFlag">
        <input type="text" @blur="onAddRuleFinish" placeholder="支持正则" />
      </div>
      <div class="row-item row-item__add" v-else @click="onAddRule">
        <span> + 添加规则</span>
      </div>
    </div>
    <ContextMenu ref="contextmenu" :model="contextMenuList"></ContextMenu>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import ContextMenu from "primevue/contextmenu";
import { useBlueprintStore } from "/@/store/blueprint";
const blueprintStore = useBlueprintStore();
const props = defineProps(["title", "rows", "nodeId", "editFlag", "isActive"]);
const contextmenu = ref();
const addRuleFlag = ref(false);
const editTitleFlag = ref(false);
const contextMenuList = ref([
  {
    label: "删除",
    disabled: false,
    icon: "pi pi-fw pi-trash",
    command: () => {},
  },
]);
const onNodeContextMenu = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
};
const onEditTitle = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  editTitleFlag.value = true;
  blueprintStore.setNodeEditFlag(props.nodeId, true);
  nextTick(() => {
    const input = document.getElementById(`node-title-input-${props.nodeId}`);
    if (input) {
      if (props.title) {
        (input as HTMLInputElement).value = props.title;
      }
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

const onAddRule = () => {
  addRuleFlag.value = true;
  nextTick(() => {
    let input = document.querySelector(".row-item__add input");
    if (input) {
      (input as HTMLInputElement).focus();
    }
  });
};
const onAddRuleFinish = (e: FocusEvent) => {
  const value = (e.target as HTMLInputElement).value;
  if (value) {
    blueprintStore.addNodeRule(props.nodeId, value);
  }
  (e.target as HTMLInputElement).value = "";
  addRuleFlag.value = false;
};
const onShowContextmenu = (rowData: any, e: MouseEvent) => {
  contextMenuList.value = [
    {
      label: "删除",
      disabled: !rowData.editable,
      icon: "pi pi-fw pi-trash",
      command: () => {
        // emit("delete-rule", rowData.rule);

        blueprintStore.deleteNodeRule(props.nodeId, rowData.rule);
      },
    },
  ];
  contextmenu.value.show(e);
};
</script>

<style lang="scss">
.node-response {
  .node-component--title {
    background-color: rgba(235, 150, 39, 0.81) !important;
  }
}
</style>
