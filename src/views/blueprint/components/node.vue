<template>
  <div
    class="node-wrap"
    :class="[
      `node-wrap__${props.schema.direction || 'ltr'}`,
      blueprintStore.activeNodeId === props.schema.id
        ? 'node-wrap__active'
        : '',
    ]"
    :style="{
      left: props.schema.x + 'px',
      top: props.schema.y + 'px',
      width: props.schema.w + 'px',
      minHeight: props.schema.h + 'px',
    }"
    @mousewheel.stop
  >
    <component
      :is="getComponent(props.schema.type)"
      :title="props.schema.title"
      @onTitleMouseDown="onNodeMouseDown"
      @onPointMouseDown="onPointMouseDown"
      :edit-flag="props.schema.editFlag"
      :rows="props.schema.rows"
      :host="props.schema.host"
      :node-id="props.schema.id"
      :is-active="props.schema.id === blueprintStore.activeNodeId"
      :remark="props.schema.remark || ''"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import NodeEmpty from "./custom/emtpy.vue";
import NodeClient from "./custom/client.vue";
import NodeServer from "./custom/server.vue";
import NodeRequest from "./custom/request.vue";
import NodeResponse from "./custom/response.vue";
import NodeRemark from "./custom/remark.vue";
import NodeSource from "./custom/source.vue";
import { useBlueprintStore, QdzNode, QdzNodeType } from "/@/store/blueprint";

const blueprintStore = useBlueprintStore();
const props = defineProps<{ schema: QdzNode }>();
const emit = defineEmits(["point-drag-start", "custom-drag"]);

// const points = computed<string[]>(() => {
//   return ;
// });
const dragStart = reactive({
  x: 0,
  y: 0,
});

const onNodeMouseUp = () => {
  document.removeEventListener("mousemove", dragListener);
  document.removeEventListener("mouseup", onNodeMouseUp);
};
const onNodeMouseDown = (e: MouseEvent) => {
  // dragStart.x =
  // console.log(e);
  blueprintStore.setActiveNode(props.schema.id);
  const { clientX, clientY } = e;
  dragStart.x = clientX * (1 / blueprintStore.scaleSize) - props.schema.x;
  dragStart.y = clientY * (1 / blueprintStore.scaleSize) - props.schema.y;
  document.addEventListener("mousemove", dragListener);
  document.addEventListener("mouseup", onNodeMouseUp);
};

const dragListener = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  let [x, y] = [
    clientX * (1 / blueprintStore.scaleSize) - dragStart.x,
    clientY * (1 / blueprintStore.scaleSize) - dragStart.y,
  ];
  const [xMin, xMax, yMin, yMax] = [
    0,
    blueprintStore.maxWidth - props.schema.w,
    0,
    blueprintStore.maxHeight - props.schema.h,
  ];
  if (x < xMin) {
    x = xMin;
  }
  if (x > xMax) {
    x = xMax;
  }
  if (y < yMin) {
    y = yMin;
  }
  if (y > yMax) {
    y = yMax;
  }
  // rect.x = x;
  // rect.y = y;
  blueprintStore.setNodeRect(props.schema.id, {
    x: x,
    y: y,
  });
  emit(
    "custom-drag",
    props.schema.rows.reduce(
      (pv: string[], cv) => pv.concat(cv.inputId || [], cv.outputId || []),
      []
    )
  );
  // console.log(activeNode.left, activeNode.top);
  // linePath.value = drawCurve([x + activeNode.width, y + 42], [600, 240]);
};
const onPointMouseDown = (detail: {
  event: MouseEvent;
  type: "input" | "output";
  id: string;
}) => {
  emit("point-drag-start", { ...detail, nodeId: props.schema.id });
};
const getComponent = (nodeType: QdzNodeType) => {
  if (nodeType === "client") {
    return NodeClient;
  }
  if (nodeType === "server") {
    return NodeServer;
  }
  if (nodeType === "request") {
    return NodeRequest;
  }
  if (nodeType === "response") {
    return NodeResponse;
  }
  if (nodeType === "remark") {
    return NodeRemark;
  }
  if (nodeType === "source") {
    return NodeSource;
  }
  return NodeEmpty;
};
</script>

<style lang="scss">
.node-wrap {
  position: absolute;
  user-select: none;
  background-color: rgba(48, 48, 48, 0.81);
  @apply tw-shadow-md;
  @apply tw-rounded-md;
  z-index: 100;
  color: #fff;
  &__active {
    border: 1px solid #fff;
  }
  .node-component {
    &--title {
      text-align: center;
      font-size: 13px;
      height: 26px;
      line-height: 26px;
      padding: 0 4px;
      background-color: rgba(43, 101, 43, 0.81);
      cursor: move;
      @apply tw-rounded-md;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      input {
        outline: none;
        background-color: transparent;
        text-align: center;
        width: 100%;
      }
      &--text {
        display: flex;
        align-items: center;
        span {
          flex-grow: 1;
          margin-right: 4px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        i {
          line-height: 26px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    &--rows {
      // height: calc(100% - 26px);
      margin-top: 5px;
      .row-item {
        text-align: right;
        @apply tw-rounded-md;
        @apply tw-px-2;
        background-color: rgba(48, 48, 48, 0.91);
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: 5px;
        cursor: pointer;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &__input {
          background-color: transparent;
        }
        .port-point-i {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgb(0, 207, 110);
          &:hover {
            transform: scale(1.5);
          }
        }
        .port-point-o {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgb(187, 207, 0);
          &:hover {
            transform: scale(1.5);
          }
        }
        &__add {
          text-align: center;
        }
        input {
          outline: none;
          background-color: transparent;
          text-align: center;
          width: 100%;
        }
      }
    }
  }
  &__rtl {
    .port-point-i {
      right: -3px !important;
    }
    .port-point-o {
      left: -3px !important;
    }
  }
  &__ltr {
    .row-item__input {
      text-align: left !important;
    }
    .port-point-i {
      left: -3px !important;
    }
    .port-point-o {
      right: -3px !important;
    }
  }
  &__rtr {
    .port-point-i {
      right: -3px !important;
    }
    .port-point-o {
      right: -3px !important;
    }
  }
  &__ltl {
    .row-item__input {
      text-align: left !important;
    }
    .port-point-i {
      left: -3px !important;
    }
    .port-point-o {
      left: -3px !important;
    }
  }
}
</style>
