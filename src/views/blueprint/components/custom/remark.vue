<template>
  <div class="node-component node-remark" @contextmenu="onNodeContextMenu">
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
    <div class="node-component--rows remark-row">
      <div class="row-item remark-textarea__add" v-if="editContentFlag">
        <!-- <input type="text" @blur="onAddRuleFinish" placeholder="支持正则" /> -->
        <textarea cols="30" rows="10" @blur="onEditContentFinish"></textarea>
      </div>
      <div
        class="row-item remark-textarea"
        @contextmenu="onShowContextmenu"
        v-else
      >
        <p>{{ props.remark }}</p>
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
const props = defineProps([
  "title",
  "remark",
  "nodeId",
  "isActive",
  "editFlag",
]);
const contextmenu = ref();
const editContentFlag = ref(false);
const editTitleFlag = ref(false);
const contextMenuList = ref([
  {
    label: "编辑",
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
      console.log(input);
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

// const onAddRule = () => {
//   addRuleFlag.value = true;
//   nextTick(() => {
//     let input = document.querySelector(".row-item__add input");
//     if (input) {
//       (input as HTMLInputElement).focus();
//     }
//   });
// };
// const onAddRuleFinish = (e: FocusEvent) => {
//   const value = (e.target as HTMLInputElement).value;
//   if (value) {
//     blueprintStore.addNodeRule(props.nodeId, value);
//   }
//   (e.target as HTMLInputElement).value = "";
//   addRuleFlag.value = false;
// };
const onEditContentFinish = (e: FocusEvent) => {
  const value = (e.target as HTMLInputElement).value;
  if (value) {
    blueprintStore.editRemak(props.nodeId, value);
  }
  (e.target as HTMLInputElement).value = "";
  editContentFlag.value = false;
};
const onShowContextmenu = (e: MouseEvent) => {
  contextMenuList.value = [
    {
      label: "编辑",
      disabled: false,
      icon: "pi pi-fw pi-pencil",
      command: () => {
        editContentFlag.value = true;
        // emit("delete-rule", rowData.rule);
        // blueprintStore.deleteNodeRule(props.nodeId, rowData.rule);
        nextTick(() => {
          let input = document.querySelector(".remark-textarea__add textarea");
          if (input) {
            if (props.remark) {
              (input as HTMLInputElement).value = props.remark;
            }
            (input as HTMLInputElement).focus();
          }
        });
      },
    },
  ];
  contextmenu.value.show(e);
};
</script>

<style lang="scss">
.node-remark {
  .node-component--title {
    background-color: rgb(207 73 30 / 81%) !important;
  }
  .remark-row {
    .remark-textarea,
    .remark-textarea__add {
      // height: 100%;
      min-height: 270px;
      text-align: left !important;
      white-space: break-spaces !important;
    }
    .remark-textarea__add {
      textarea {
        outline: none;
        background-color: transparent;
        width: 100%;
      }
    }
  }
}
</style>
