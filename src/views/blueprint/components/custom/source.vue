<template>
  <div class="node-component node-source" @contextmenu="onNodeContextMenu">
    <h1
      class="node-component--title"
      @mousedown="(e) => $emit('onTitleMouseDown', e)"
    >
      {{ props.title }}
    </h1>
    <div class="node-component--rows">
      <div class="row-item" v-for="(row, idx) in props.rows" :key="idx">
        <span
          class="row-item--title"
          v-tooltip.bottom="JSON.stringify(row.data)"
          >{{ row.rule }}</span
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
.node-source {
  .node-component--title {
    background-color: rgba(38, 226, 13, 0.81) !important;
  }
}
</style>
