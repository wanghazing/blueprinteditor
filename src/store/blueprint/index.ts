import { defineStore } from "pinia";

import { getRandomId } from "/@/utils";

export type QdzNodeType =
  | "client"
  | "server"
  | "request"
  | "response"
  | "json"
  | "source"
  | "empty";
export type QdzNodeRow = {
  rule: string;
  name: string;
  editable: boolean;
  inputId?: string;
  outputId?: string;
};
export type QdzNode = {
  type: QdzNodeType;
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  direction: "ltr" | "rtl" | "rtr" | "ltl";
  host?: string;
  editFlag: boolean;
  transformOrigin: [number, number];
  rows: Array<QdzNodeRow>;
};
export type QdzLink = {
  id: string;
  startNodeId: string;
  endNodeId: string;
  startNode: QdzNode | null;
  endNode: QdzNode | null;
  startTmp: [number, number] | null;
  endTmp: [number, number] | null;
  start: string;
  end: string;
  direction: "rtl" | "rtr" | "ltl" | "ltr";
  path: string;
  points: [number, number, number, number];
};
export const useBlueprintStore = defineStore("blueprint", {
  state: () => {
    return {
      el: null as HTMLDivElement | null,
      rect: null as DOMRect | null,
      activeNodeId: "",
      scaleSize: 1,
      translateX: 0,
      translateY: 0,
      sizes: {
        client: [100, 80],
        empty: [100, 100],
        json: [120, 140],
        request: [100, 110],
        response: [100, 110],
        server: [100, 80],
        source: [100, 100],
      },
      directions: {
        client: "rtr",
        empty: "ltr",
        json: "rtl",
        request: "ltr",
        response: "rtl",
        server: "ltl",
        source: "rtl",
      },
      nodeList: [
        {
          type: "client",
          id: "f23r23trtt",
          title: "客户端",
          // position: [100, 200],
          x: 100,
          y: 200,
          w: 100,
          h: 80,
          editFlag: false,
          transformOrigin: [0, 0],
          direction: "rtr", // 方向， ltr: 左出右进 rtl: 右出左进 rtr:右出右进  ltl:左出左进
          rows: [
            { rule: "*", name: "", editable: false, outputId: "j89gs8hjer" },
            { rule: "*", name: "", editable: false, inputId: "g18erg891d" },
          ],
        },
        {
          type: "server",
          id: "1g781d9f88d",
          title: "服务端",
          x: 826,
          y: 279,
          w: 100,
          h: 80,
          editFlag: false,
          host: "http://127.0.0.1:8333",
          transformOrigin: [0, 0],
          direction: "ltl", // 方向， ltr: 左出右进 rtl: 右出左进  rtr:右出右进  ltl:左出左进
          rows: [
            { rule: "*", name: "", editable: false, inputId: "g718df1787" },
            { rule: "*", name: "", editable: false, outputId: "gjwe77989" },
          ],
        },
        {
          type: "request",
          id: "ge988d8fg1g",
          title: "请求拦截",
          x: 444,
          y: 85,
          w: 100,
          h: 110,
          editFlag: false,
          transformOrigin: [0, 0],
          direction: "ltr", // 方向， ltr: 左出右进 rtl: 右出左进  rtr:右出右进  ltl:左出左进
          rows: [
            { rule: "*", name: "", editable: false, inputId: "xc89s811" },
            { rule: "*", name: "", editable: false, outputId: "gedx1d6f" },
          ],
        },
        {
          type: "response",
          id: "q8g1688d8d",
          title: "响应拦截",
          x: 365,
          y: 488,
          w: 100,
          h: 110,
          editFlag: false,
          transformOrigin: [0, 0],
          direction: "rtl", // 方向， ltr: 左出右进 rtl: 右出左进  rtr:右出右进  ltl:左出左进
          rows: [
            { rule: "*", name: "", editable: false, inputId: "b1d8d5f1" },
            { rule: "*", name: "", editable: false, outputId: "ntf84f4g1g" },
          ],
        },
      ] as QdzNode[],
    };
  },
  actions: {
    initCanvas(el: HTMLDivElement) {
      this.el = el;
    },
    setActiveNode(id: string) {
      this.activeNodeId = id;
    },
    setRect() {
      if (this.el) {
        this.rect = this.el.getBoundingClientRect();
      }
    },
    setScale(scaleSize = 1) {
      if (scaleSize % 1 === 0) {
        this.scaleSize = scaleSize;
      } else {
        this.scaleSize = Math.round(scaleSize * 100) / 100;
      }
    },
    setNodeRect(
      id: string,
      rect: { x?: number; y?: number; w?: number; h?: number }
    ) {
      const node = this.nodeList.find((n) => n.id === id);
      for (let key in rect) {
        if (
          ["x", "y", "w", "h"].indexOf(key) !== -1 &&
          typeof rect[key as "x" | "y" | "w" | "h"] === "number"
        ) {
          node &&
            (node[key as "x" | "y" | "w" | "h"] = rect[
              key as "x" | "y" | "w" | "h"
            ] as number);
        }
      }
    },
    setNodeEditFlag(id: string, editFlag: boolean) {
      const node = this.nodeList.find((n) => n.id === id);
      if (node) {
        node.editFlag = editFlag;
      }
    },
    setNodeTitle(id: string, title: string) {
      const node = this.nodeList.find((n) => n.id === id);
      if (node) {
        node.editFlag = false;
        node.title = title;
      }
    },
    addNodeRule(id: string, ruleName: string) {
      const node = this.nodeList.find((n) => n.id === id);
      if (node) {
        if (node.rows.findIndex(({ rule }) => rule === ruleName) === -1) {
          node.rows.push({
            rule: ruleName,
            name: ruleName,
            editable: true,
            outputId: getRandomId(),
          });
        }
      }
    },
    deleteNodeRule(id: string, ruleName: string) {
      const node = this.nodeList.find((n) => n.id === id);
      if (node) {
        const idx = node.rows.findIndex(({ rule }) => rule === ruleName);
        if (idx !== -1) {
          node.rows.splice(idx, 1);
        }
      }
    },
    setHost(id: string, host: string) {
      const node = this.nodeList.find((n) => n.id === id);
      if (node) {
        node.host = host;
      }
    },
    appendNode(
      node: {
        type: QdzNodeType;
        title: string;
        position: [number, number];
      },
      callback: (id: string) => void
    ) {
      const id = getRandomId();
      const { offsetWidth, offsetHeight } = this.el as HTMLDivElement;
      let [x, y] = node.position;
      const [w, h] = this.sizes[node.type];
      x = Math.min(x, offsetWidth - w - 20);
      y = Math.min(y, offsetHeight - h - 20);
      this.nodeList.push({
        type: node.type,
        id,
        title: node.title,
        // position: [100, 200],
        x,
        y,
        w,
        h,
        transformOrigin: [0, 0],
        editFlag: true,
        direction: this.directions[node.type] as "ltr" | "rtl" | "rtr" | "ltl",
        rows: [
          { rule: "*", name: "", editable: false, inputId: getRandomId() },
          { rule: "*", name: "", editable: false, outputId: getRandomId() },
        ],
      });
      callback(id);
    },
    initNodeTransformOrigin() {
      this.nodeList.forEach((node) => {
        // blueprintStore.el ? blueprintStore.el.offsetHeight / 2 - node.y : 0
        this.el &&
          (node.transformOrigin = [
            this.el.offsetWidth / 2 - node.x,
            this.el.offsetHeight / 2 - node.y,
          ]);
      });
    },
  },
});
