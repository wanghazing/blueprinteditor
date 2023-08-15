<template>
  <div class="node-component node-client" @contextmenu="onNodeContextMenu">
    <h1
      class="node-component--title"
      @mousedown="(e) => $emit('onTitleMouseDown', e)"
    >
      {{ props.title }}
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
        <span class="row-item--title">{{
          row.inputId ? "输入" : row.rule
        }}</span>
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
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["title", "rows", "nodeId"]);

const onNodeContextMenu = (e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
};
</script>

<style lang="scss">
.node-client {
  .node-component--title {
    background-color: rgba(14, 106, 211, 0.81) !important;
  }
}
</style>
