<template>
  <div class="blueprint-page">
    <div id="blueprint-window">
      <div class="blueprint-toolbox tw-rounded-md tw-shadow-md tw-px-6">
        <i
          class="pi pi-search-minus tw-text-center"
          style="font-size: 1.25rem"
          @click="() => setScale('minus')"
        ></i>
        <span class="tw-ml-6 tw-text-center" style="font-size: 1.25rem"
          >{{ (blueprintStore.scaleSize * 100) >> 0 }}%</span
        >
        <i
          class="pi pi-search-plus tw-ml-6 tw-text-center"
          style="font-size: 1.25rem"
          @click="() => setScale('plus')"
        ></i>
        <!-- <i
          v-if="isFullscreen"
          class="pi pi-window-minimize tw-ml-6 tw-text-center"
          style="font-size: 1.25rem"
          @click="setFullscreen(false)"
        ></i>
        <i
          v-else
          class="pi pi-window-maximize tw-ml-6 tw-text-center"
          style="font-size: 1.25rem"
          @click="setFullscreen(true)"
        ></i> -->
        <i
          class="pi pi-arrows-alt tw-ml-6 tw-text-center"
          :class="{ 'ico-btn--active': isMoveMode }"
          style="font-size: 1.25rem"
          @click="() => (isMoveMode = !isMoveMode)"
        ></i>
        <i
          class="pi pi-replay tw-ml-6 tw-text-center"
          style="font-size: 1.25rem"
        ></i>
        <i
          class="pi pi-code tw-ml-6 tw-text-center"
          style="font-size: 1.25rem"
        ></i>
        <i
          class="pi pi-question-circle tw-ml-6 tw-text-center"
          style="font-size: 1.25rem"
        ></i>
      </div>
      <div
        id="blueprint-canvas"
        @mousewheel="onMousewheel"
        @contextmenu="onContextMenu"
        @click="onCanvasClick"
        :style="{
          width: `${blueprintStore.el && blueprintStore.el.offsetWidth * 10}px`,
          height: `${
            blueprintStore.el && blueprintStore.el.offsetHeight * 10
          }px`,
          transform: `translate(${blueprintStore.translateX}px, ${blueprintStore.translateY}px) scale(${blueprintStore.scaleSize})`,
          transformOrigin: `center center`,
        }"
      >
        <div
          v-if="isMoveMode"
          class="move-modal"
          @mousedown="onModalMouseDown"
          @mouseup="onModalMouseUp"
        ></div>
        <Node
          v-for="node in blueprintStore.nodeList"
          :key="node.id"
          :schema="node"
          @custom-drag="onNodeDrag"
          @point-drag-start="onPointMouseDown"
        />
        <svg
          id="svg-container"
          xmlns="http://www.w3.org/2000/svg"
          :style="{
            width: `${
              blueprintStore.el && blueprintStore.el.offsetWidth * 10
            }px`,
            height: `${
              blueprintStore.el && blueprintStore.el.offsetHeight * 10
            }px`,
          }"
        >
          <QdzLinearGradient v-for="link in linkList" :link="link" />
          <path
            v-for="link in linkList"
            :key="link.id"
            :d="link.path"
            @click="onClickPath"
            :stroke="`url(#linearGradient-${link.id})`"
            stroke-width="2"
            fill="transparent"
          ></path>
        </svg>
      </div>
    </div>
    <ContextMenu ref="contextmenu" :model="contextMenuList"></ContextMenu>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from "vue";
// import screenfull from "screenfull";
import ContextMenu from "primevue/contextmenu";
import { getRandomId } from "/@/utils";
import Node from "./components/node.vue";
import QdzLinearGradient from "./components/element/qdz-linear-gradient";

import { useBlueprintStore, QdzNode, QdzLink } from "/@/store/blueprint";
import { QdzNodeType } from "/@/store/blueprint";

const blueprintStore = useBlueprintStore();
const linkList = ref([
  {
    // 客户端-请求拦截
    id: "gw3wt3t56",
    startNodeId: "f23r23trtt",
    endNodeId: "ge988d8fg1g",
    startNode: null,
    endNode: null,
    startTmp: null,
    endTmp: null,
    start: "j89gs8hjer",
    end: "xc89s811",
    direction: "rtl", // 方向， ltr: 左出右进 rtl: 右出左进 rtr:右出右进  ltl:左出左进
    path: "",
    points: [0, 0, 0, 0],
  },
  {
    // 请求拦截-服务端
    id: "1x8fhg1d5d",
    startNodeId: "ge988d8fg1g",
    endNodeId: "1g781d9f88d",
    startNode: null,
    endNode: null,
    startTmp: null,
    endTmp: null,
    start: "gedx1d6f",
    end: "g718df1787",
    direction: "rtl", // 方向， ltr: 左出右进 rtl: 右出左进 rtr:右出右进  ltl:左出左进
    path: "",
    points: [0, 0, 0, 0],
  },
  {
    // 服务端-响应拦截
    id: "1g89s8e8d",
    startNodeId: "1g781d9f88d",
    endNodeId: "q8g1688d8d",
    startNode: null,
    endNode: null,
    startTmp: null,
    endTmp: null,
    start: "gjwe77989",
    end: "b1d8d5f1",
    direction: "rtl", // 方向， ltr: 左出右进 rtl: 右出左进 rtr:右出右进  ltl:左出左进
    path: "",
    points: [0, 0, 0, 0],
  },
  {
    // 响应拦截-客户端
    id: "g4d98df5r",
    startNodeId: "q8g1688d8d",
    endNodeId: "f23r23trtt",
    startNode: null,
    endNode: null,
    startTmp: null,
    endTmp: null,
    start: "ntf84f4g1g",
    end: "g18erg891d",
    direction: "rtl", // 方向， ltr: 左出右进 rtl: 右出左进 rtr:右出右进  ltl:左出左进
    path: "",
    points: [0, 0, 0, 0],
  },
] as QdzLink[]);
const contextMenuList = ref([
  {
    label: "刷新",
    icon: "pi pi-fw pi-refresh",
    command: () => {
      drawLinks();
    },
  },
  {
    label: "请求拦截",
    icon: "pi pi-fw pi-plus",
    command: () => {
      onConfirmAppendNode("request");
    },
  },
  {
    label: "响应拦截",
    icon: "pi pi-fw pi-plus",
    command: () => {
      onConfirmAppendNode("response");
    },
  },
  {
    label: "服务端",
    icon: "pi pi-fw pi-plus",
    command: () => {
      onConfirmAppendNode("server");
    },
  },
  { label: "报文", icon: "pi pi-fw pi-plus" },
  { label: "资源", icon: "pi pi-fw pi-plus" },
]);
const onConfirmAppendNode = (type: QdzNodeType) => {
  let baseName = {
    client: "客户端",
    server: "服务端",
    request: "请求拦截",
    response: "响应拦截",
    json: "json数据",
    source: "文件",
    empty: "空节点",
  }[type];
  let count = 1;
  while (
    blueprintStore.nodeList.find(
      ({ title }) => title === `${baseName}-${count}`
    )
  ) {
    count++;
  }

  blueprintStore.appendNode(
    {
      type,
      title: `${baseName}-${count}`,
      position: appendPoint.value,
    },
    (id: string) => {
      console.log(id);
      nextTick(() => {
        const input = document.getElementById(`node-title-input-${id}`);
        if (input) {
          console.log(input);
          (input as HTMLInputElement).value = `${baseName}-${count}`;
          input.focus();
        }
      });
    }
  );
};
const appendPoint = ref([0, 0] as [number, number]);
const contextmenu = ref();
const dragStart = reactive({
  x: 0,
  y: 0,
  linkIndex: 0,
  temPointId: "",
  temPointType: "",
  addLinkFlag: false,
});

// const temPointId = ref("");
const onClickPath = (e: MouseEvent) => {
  console.log(e);
};

const drawLinks = (idList?: string[]) => {
  linkList.value.forEach((link) => {
    if (idList) {
      if (
        idList.findIndex(
          (id: string) => id === link.start || id === link.end
        ) === -1
      ) {
        return;
      }
    }
    let startNode, endNode, startPoint, endPoint, rs, le, startIdx, endIdx;
    if (link.startTmp) {
      startPoint = link.startTmp;
    } else {
      if (link.startNode) {
        startNode = link.startNode;
      } else {
        link.startNode = startNode = blueprintStore.nodeList.find(
          ({ id }) => id === link.startNodeId
        ) as QdzNode;
      }
      startIdx = startNode.rows.findIndex(
        ({ outputId }) => outputId === link.start
      );
      rs = (startNode.direction || "ltr").split("")[2];
      startPoint = [
        rs === "l" ? startNode.x : startNode.x + startNode.w,
        startNode.y + 43 + 29 * startIdx,
      ] as [number, number];
    }
    if (link.startTmp) {
      startPoint = link.startTmp;
    }
    if (link.endTmp) {
      endPoint = link.endTmp;
    } else {
      if (link.endNode) {
        endNode = link.endNode;
      } else {
        link.endNode = endNode = blueprintStore.nodeList.find(
          ({ id }) => id === link.endNodeId
        ) as QdzNode;
      }
      endIdx = endNode.rows.findIndex(({ inputId }) => inputId === link.end);
      le = (endNode.direction || "ltr").split("")[0];
      endPoint = [
        le === "r" ? endNode.w + endNode.x : endNode.x,
        endNode.y + 43 + 29 * endIdx,
      ] as [number, number];
    }
    link.points = [...startPoint, ...endPoint];
    link.path = drawCurve(startPoint, endPoint);
  });
};
// const getScaledPoint = (point, scale, scaleCenterPoint) => {
//   const [x, y] = point;
//   const [xc, yc] = scaleCenterPoint;
//   return [xc - scale * (xc - x), yc - scale * (yc - y)];
// };
const onContextMenu = (e: MouseEvent) => {
  console.log(e);
  contextmenu.value.show(e);
  appendPoint.value = [
    e.clientX - (blueprintStore.rect?.x || 0),
    e.clientY - (blueprintStore.rect?.y || 0),
  ];
};
const onNodeDrag = (idList: string[]) => {
  // console.log(idList);
  drawLinks(idList);
};

const onPointMouseDown = (detail: {
  event: MouseEvent;
  type: "input" | "output";
  id: string;
  nodeId: string;
}) => {
  console.log(detail);
  const { event, type, id, nodeId } = detail;
  // linkList.value.
  const idx = linkList.value.findIndex(
    (link) =>
      link[{ input: "end", output: "start" }[type] as "start" | "end"] === id
  );
  console.log(idx);
  blueprintStore.setRect();
  if (idx !== -1) {
    // 端口上已存在连线
    if (type === "input") {
      // 拖动入口点，修改startTmp
      linkList.value.splice(idx, 1, {
        ...linkList.value[idx],
        endTmp: [event.clientX, event.clientY],
      });
    }
    if (type === "output") {
      // 拖动出口点，修改endTmp
      linkList.value.splice(idx, 1, {
        ...linkList.value[idx],
        startTmp: [event.clientX, event.clientY],
      });
    }
    dragStart.linkIndex = idx;
  } else {
    // 端口上没有连线，生成一条新的连线
    const newLink: QdzLink = {
      id: getRandomId(),
      direction: "rtl",
      path: "",
      startNodeId: "",
      endNodeId: "",
      startTmp: null as [number, number] | null,
      endTmp: null as [number, number] | null,
      start: "",
      end: "",
      startNode: null,
      endNode: null,
      points: [0, 0, 0, 0],
    };
    if (type === "input") {
      // 从入口拉出连线，endNode固定
      newLink.endNodeId = nodeId;
      newLink.endNode = blueprintStore.nodeList.find(
        (node) => node.id === nodeId
      ) as QdzNode;
      newLink.end = id;
      newLink.startTmp = [event.clientX, event.clientY];
    }
    if (type === "output") {
      // 从出口拉出连线，startNode固定
      newLink.startNodeId = nodeId;
      newLink.startNode = blueprintStore.nodeList.find(
        (node) => node.id === nodeId
      ) as QdzNode;
      newLink.start = id;
      newLink.endTmp = [event.clientX, event.clientY];
    }
    console.log(newLink);
    linkList.value.push(newLink);
    dragStart.linkIndex = linkList.value.length - 1;
    dragStart.addLinkFlag = true;
  }
  dragStart.temPointId = id;
  dragStart.temPointType = type;
  dragStart.x = event.clientX;
  dragStart.y = event.clientY;
  document.addEventListener("mousemove", dragListener);
  document.addEventListener("mouseup", onPointMouseUp);
};

const dragListener = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  let [x, y] = [
    clientX - blueprintStore.translateX - (blueprintStore.rect?.left || 0),
    clientY - blueprintStore.translateY - (blueprintStore.rect?.top || 0),
  ];
  let center = [
    (blueprintStore.el?.offsetWidth || 0) * 5,
    (blueprintStore.el?.offsetHeight || 0) * 5,
  ];
  x = center[0] + (x - center[0]) / blueprintStore.scaleSize;
  y = center[1] + (y - center[1]) / blueprintStore.scaleSize;
  console.log(x, y);
  if (x < 0) {
    x = 0;
  }
  if (y < 0) {
    y = 0;
  }
  if (x > (blueprintStore.el as HTMLDivElement).offsetWidth * 10) {
    x = (blueprintStore.el as HTMLDivElement).offsetWidth * 10;
  }
  if (y > (blueprintStore.el as HTMLDivElement).offsetHeight * 10) {
    y = (blueprintStore.el as HTMLDivElement).offsetHeight * 10;
  }
  // linkList.value[dragStart.linkIndex].
  const activeLink = linkList.value[dragStart.linkIndex];
  if (activeLink.startTmp) {
    activeLink.startTmp = [x, y];
  }
  if (activeLink.endTmp) {
    activeLink.endTmp = [x, y];
  }
  drawLinks([dragStart.temPointId]);
};
const onPointMouseUp = (e: MouseEvent) => {
  // 连接其他端口
  // if ()
  const points = document.querySelectorAll("[data-pointid]");
  // console.log([points]);
  // ;
  let isBind = false,
    offsetX = e.clientX,
    offsetY = e.clientY;
  points.forEach((point) => {
    if (isBind) {
      return;
    }
    // console.log(point.getBoundingClientRect());
    const { x, y } = point.getBoundingClientRect();

    if (
      offsetX < x + 16 &&
      offsetX > x - 9 &&
      offsetY < y + 16 &&
      offsetY > y - 9
    ) {
      const pointId = point.getAttribute("data-pointid");
      // console.log(pointId, dragStart.temPointId);
      if (pointId === dragStart.temPointId) {
        // 连接原来的端口
        linkList.value[dragStart.linkIndex].startTmp = null;
        linkList.value[dragStart.linkIndex].endTmp = null;

        drawLinks();
        isBind = true;
      } else {
        const idx = linkList.value.findIndex(
          (link) => link.start === pointId || link.end === pointId
        );
        // console.log(idx);
        if (idx === -1) {
          // 未使用的端口
          const pointType = point.getAttribute("data-pointType");
          // console.log(dragStart.temPointType, pointType);
          if (dragStart.temPointType === pointType || dragStart.addLinkFlag) {
            // 只能连接与原类型相同的端口
            // linkList.value[idx]
            const nodeId = point.getAttribute("data-nodeid");
            // console.log(linkList.value[dragStart.linkIndex]);
            if (linkList.value[dragStart.linkIndex].startTmp) {
              linkList.value[dragStart.linkIndex].startTmp = null;
              linkList.value[dragStart.linkIndex].start = pointId as string;
              linkList.value[dragStart.linkIndex].startNodeId =
                nodeId as string;
              linkList.value[dragStart.linkIndex].startNode =
                blueprintStore.nodeList.find(
                  (node) => node.id === nodeId
                ) as QdzNode;
            }
            if (linkList.value[dragStart.linkIndex].endTmp) {
              linkList.value[dragStart.linkIndex].endTmp = null;
              linkList.value[dragStart.linkIndex].end = pointId as string;
              linkList.value[dragStart.linkIndex].endNodeId = nodeId as string;
              linkList.value[dragStart.linkIndex].endNode =
                blueprintStore.nodeList.find(
                  (node) => node.id === nodeId
                ) as QdzNode;
            }
            isBind = true;
            drawLinks();
          }
        }
      }
    }
  });
  // console.log(isBind);
  if (!isBind) {
    // 没有可连接的端口,删除连线
    linkList.value.splice(dragStart.linkIndex, 1);
    drawLinks();
    dragStart.x = dragStart.y = dragStart.linkIndex = 0;
    dragStart.temPointId = dragStart.temPointType = "";
  }
  // console.log(linkList.value);
  document.removeEventListener("mousemove", dragListener);
  document.removeEventListener("mouseup", onPointMouseUp);
};

const onCanvasClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement)?.tagName === "svg") {
    blueprintStore.setActiveNode("");
  }
};

// const getNodeTransformOrigin = (node: QdzNode) => {
//   if (!blueprintStore.rect) {
//     return "0 0";
//   }
//   return `${blueprintStore.rect.width / 2 - node.x}px ${
//     blueprintStore.rect.height / 2 - node.y
//   }px`;
// };

onMounted(() => {
  initBlueprint();
});
const initBlueprint = () => {
  blueprintStore.initCanvas(
    document.getElementById("blueprint-window") as HTMLDivElement
  );
  setTimeout(() => {
    // 等待vue-transition动画结束
    blueprintStore.setRect();
    blueprintStore.initNodeTransformOrigin();
    blueprintStore.initTranslate([
      (blueprintStore.rect?.width || 0) / 2 -
        (blueprintStore.el?.offsetWidth || 0) * 5,
      (blueprintStore.rect?.height || 0) / 2 -
        (blueprintStore.el?.offsetHeight || 0) * 5,
    ]);
    drawLinks();
  }, 300);
};
const drawCurve = (start: [number, number], end: [number, number]) => {
  // console.log(start, end);
  const [x1, y1] = start;
  // 取中点作为结束点，另一半曲线通过svg自动镜像
  const [x2, y2] = [(end[0] + start[0]) / 2, (end[1] + start[1]) / 2];
  let dire = Math.abs(Math.log2(y1 / y2) / Math.log2(x1 / x2));
  dire = Math.min(dire, 3);
  dire = Math.max(dire, 0.01);
  if (y1 > y2) {
    dire *= -1;
  }
  // console.log(dire);
  // 角度，起点45°，终点20°
  const start_angle = (dire * Math.PI) / 32,
    end_angle = (dire * Math.PI) / 32;
  if (x2 >= x1) {
    // 控制点
    const xt: number =
      (x1 / Math.tan(end_angle) + x2 / Math.tan(start_angle) + y2 - y1) /
      (1 / Math.tan(start_angle) + 1 / Math.tan(end_angle));
    const yt: number =
      (y1 / Math.tan(end_angle) + y2 / Math.tan(start_angle) + x1 - x2) /
      (1 / Math.tan(start_angle) + 1 / Math.tan(end_angle));
    // console.log(`M ${x1} ${y1} Q ${xt} ${yt}, ${x2} ${y2} T ${end[0]} ${end[1]}`);
    return `M ${x1} ${y1} Q ${xt} ${yt}, ${x2} ${y2} T ${end[0]} ${end[1]}`;
  } else {
    const xt: number =
      (x2 / Math.tan(start_angle) + x1 / Math.tan(end_angle) + y1 - y2) /
      (1 / Math.tan(end_angle) + 1 / Math.tan(start_angle));
    const yt: number =
      (y2 / Math.tan(start_angle) + y1 / Math.tan(end_angle) + x2 - x1) /
      (1 / Math.tan(end_angle) + 1 / Math.tan(start_angle));
    // console.log(`M ${x1} ${y1} Q ${xt} ${yt}, ${x2} ${y2} T ${end[0]} ${end[1]}`);
    return `M ${x1} ${y1} Q ${xt} ${yt}, ${x2} ${y2} T ${end[0]} ${end[1]}`;
  }
};

// const isFullscreen = ref(false);
// const setFullscreen = (flag: boolean) => {
//   isFullscreen.value = flag;
//   if (flag) {
//     screenfull.exit();
//   }
//   screenfull.request();
// };
// 平移相关
const isMoveMode = ref(false);
const moveStart = reactive({
  x: 0,
  y: 0,
});
const onModalMouseUp = () => {
  document.removeEventListener("mousemove", moveListener);
  document.removeEventListener("mouseup", onModalMouseUp);
};
const onModalMouseDown = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const { translateX, translateY } = blueprintStore;
  moveStart.x = clientX - translateX;
  moveStart.y = clientY - translateY;
  document.addEventListener("mousemove", moveListener);
  document.addEventListener("mouseup", onModalMouseUp);
};
const moveListener = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  let [x, y] = [clientX - moveStart.x, clientY - moveStart.y];
  let [xMin, xMax, yMin, yMax] = [
    (blueprintStore.initTranslateX * (1 - blueprintStore.scaleSize)) / 0.9,
    -1 *
      (4 + 5 * blueprintStore.scaleSize) *
      (blueprintStore.el?.offsetWidth || 0),
    (blueprintStore.initTranslateY * (1 - blueprintStore.scaleSize)) / 0.9,
    -1 *
      (4 + 5 * blueprintStore.scaleSize) *
      (blueprintStore.el?.offsetHeight || 0),
  ];
  if (x > xMin) {
    x = xMin;
  }
  if (y > yMin) {
    y = yMin;
  }
  if (x < xMax) {
    x = xMax;
  }
  if (y < yMax) {
    y = yMax;
  }
  blueprintStore.setTranslate([x, y]);
};

// 缩放相关
const onMousewheel = (e: any) => {
  console.log(isMoveMode.value);
  if (e.wheelDelta > 0) {
    // blueprintStore.setScale(Math.min(blueprintStore.scaleSize + 0.15, 4));
    setScale("plus");
  } else {
    // blueprintStore.setScale(Math.max(blueprintStore.scaleSize - 0.15, 0.1));
    setScale("minus");
  }
};
const setScale = (flag: "plus" | "minus") => {
  if (flag === "plus") {
    blueprintStore.setScale(Math.min(blueprintStore.scaleSize + 0.15, 4));
  } else {
    blueprintStore.setScale(Math.max(blueprintStore.scaleSize - 0.15, 0.1));
  }
  let { translateX, translateY } = blueprintStore;
  console.log(blueprintStore.scaleSize);
  let [xMin, xMax, yMin, yMax] = [
    (blueprintStore.initTranslateX * (1 - blueprintStore.scaleSize)) / 0.9,
    -1 *
      (4 + 5 * blueprintStore.scaleSize) *
      (blueprintStore.el?.offsetWidth || 0),
    (blueprintStore.initTranslateY * (1 - blueprintStore.scaleSize)) / 0.9,
    -1 *
      (4 + 5 * blueprintStore.scaleSize) *
      (blueprintStore.el?.offsetHeight || 0),
  ];
  console.log(translateX, translateY);
  console.log(xMin, xMax, yMin, yMax);
  if (translateX > xMin) {
    console.log("1");
    translateX = xMin;
  }
  if (translateY > yMin) {
    console.log("2");
    translateY = yMin;
  }
  if (translateX < xMax) {
    console.log("3");
    translateX = xMax;
  }
  if (translateY < yMax) {
    console.log("4");
    translateY = yMax;
  }
  console.log(translateX, translateY);
  blueprintStore.setTranslate([translateX, translateY]);
};
</script>

<style lang="scss">
.blueprint-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 1rem;
  background-color: rgba(99, 99, 99, 0.73);
  #blueprint-window {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    .blueprint-toolbox {
      position: absolute;
      top: 30px;
      left: 30px;
      height: 60px;
      z-index: 999;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #fff;
      width: 22rem;
      i {
        cursor: pointer;
        &:hover {
          color: rgb(129, 37, 242);
        }
      }
      .ico-btn--active {
        color: rgb(129, 37, 242);
      }
      span {
        min-width: 2.5rem;
      }
    }
  }
  #blueprint-canvas {
    background-image: linear-gradient(
        90deg,
        rgb(181 187 189 / 12%) 10%,
        rgba(131, 2, 2, 0) 10%
      ),
      linear-gradient(rgba(181 187 189 / 12%) 10%, rgba(131, 2, 2, 0) 10%);
    background-size: 20px 20px;
    position: absolute;
    .move-modal {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background-color: rgb(134 185 210 / 40%);
      z-index: 999;
      cursor: grab;
    }
    .blueprint-inner {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 51;
    }
    #svg-container {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 50;
    }
  }
}
.blueprint-node {
  position: absolute;
  user-select: none;
  background-color: rgba(48, 48, 48, 0.81);
  @apply tw-shadow-md;
  @apply tw-rounded-md;
  z-index: 100;
  color: #fff;
  &__active {
    // box-shadow: inset 1px 1px #fff;
    border: 1px solid #fff;
  }
  &--title {
    text-align: center;
    font-size: 13px;
    height: 26px;
    line-height: 26px;
    background-color: rgba(43, 101, 43, 0.81);
    cursor: move;
    @apply tw-rounded-md;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .output-table {
    // height: calc(100% - 26px);
    .output-item {
      text-align: right;
      @apply tw-rounded-md;
      @apply tw-px-2;
      background-color: rgba(48, 48, 48, 0.91);
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      margin-left: 5px;
      margin-right: 5px;
      position: relative;
      .output-point {
        position: absolute;
        right: -9px;
        width: 6px;
        height: 6px;
        top: 9px;
        border-radius: 50%;
        background-color: rgb(187, 207, 0);
      }
    }
    .output-item-add {
      text-align: center;
    }
  }
}
</style>
