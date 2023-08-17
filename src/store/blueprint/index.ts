import { defineStore } from "pinia";
import { debounce, cloneDeep } from "lodash-es";
import { getRandomId } from "/@/utils";
import { HttpLogResolver } from "/@/utils/resolver/http-log-resolver";

export type QdzNodeType =
  | "client"
  | "server"
  | "request"
  | "response"
  | "json"
  | "source"
  | "delay"
  | "remark"
  | "error"
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
  initX: number;
  initY: number;
  direction: "ltr" | "rtl" | "rtr" | "ltl";
  host?: string;
  remark?: string;
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
      /**
       * 窗口div
       */
      el: null as HTMLDivElement | null,
      rect: null as DOMRect | null,
      /**
       * 画布最大宽度
       */
      maxWidth: window.innerWidth * 20,
      /**
       * 画布最大高度
       */
      maxHeight: window.innerHeight * 20,
      activeNodeId: "",
      scaleSize: 1,
      translateX: 0,
      translateY: 0,
      initTranslateX: 0,
      initTranslateY: 0,
      sizes: {
        client: [100, 80],
        empty: [100, 100],
        json: [120, 140],
        request: [100, 110],
        response: [100, 110],
        server: [100, 80],
        source: [100, 100],
        delay: [100, 50],
        error: [100, 50],
        remark: [200, 300],
      },
      directions: {
        client: "rtr",
        empty: "ltr",
        json: "rtl",
        request: "ltr",
        response: "rtl",
        server: "ltl",
        source: "rtl",
        delay: "ltr",
        error: "rtl",
        remark: "ltr",
      },
      nodeList: [
        {
          type: "client",
          id: "f23r23trtt",
          title: "客户端",
          // position: [100, 200],
          initX: 100,
          initY: 200,
          x: 0,
          y: 0,
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
          initX: 826,
          initY: 279,
          x: 0,
          y: 0,
          w: 100,
          h: 80,
          editFlag: false,
          host: "http://127.0.0.1:8333",
          transformOrigin: [0, 0],
          direction: "ltl", // 方向， ltr: 左出右进 rtl: 右出左进  rtr:右出右进  ltl:左出左进
          rows: [
            { rule: "*", name: "", editable: true, inputId: "g718df1787" },
            { rule: "*", name: "", editable: false, outputId: "gjwe77989" },
          ],
        },
        {
          type: "request",
          id: "ge988d8fg1g",
          title: "-<拦截器",
          initX: 444,
          initY: 85,
          x: 0,
          y: 0,
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
          title: ">-拦截器",
          initX: 365,
          initY: 488,
          x: 0,
          y: 0,
          w: 100,
          h: 110,
          editFlag: false,
          transformOrigin: [0, 0],
          direction: "rtl", // 方向， ltr: 左出右进 rtl: 右出左进  rtr:右出右进  ltl:左出左进
          rows: [
            { rule: "*", name: "", editable: false, outputId: "ntf84f4g1g" },
            { rule: "*", name: "", editable: false, inputId: "b1d8d5f1" },
          ],
        },
        {
          type: "response",
          id: "4u06uhwqoq",
          title: ">-拦截器-1",
          initX: 938,
          initY: 231,
          x: 0,
          y: 0,
          w: 100,
          h: 110,
          editFlag: false,
          transformOrigin: [0, 0],
          direction: "ltr",
          remark: undefined,
          rows: [
            {
              rule: "*",
              name: "",
              editable: false,
              outputId: "1qvk2z99o7r",
            },
            {
              rule: "*",
              name: "",
              editable: false,
              inputId: "nxa96plc9i",
            },
          ],
        },
        {
          type: "delay",
          id: "2modwqmv1rs",
          initX: 650.5654449462891,
          initY: 270,
          x: 0,
          y: 0,
          w: 100,
          h: 50,
          editFlag: false,
          transformOrigin: [0, 0],
          direction: "ltr",
          title: "延时-1",
          remark: "",
          rows: [
            {
              rule: "3000",
              name: "3000",
              editable: true,
              outputId: "2gvfe5szfrg",
              inputId: "1m92bcnafdc",
            },
          ],
        },
        {
          type: "source",
          id: "s7ahr6yrbr",
          title: "log.json",
          initX: 803.5654449462891,
          initY: 499,
          x: 0,
          y: 0,
          w: 100,
          h: 100,
          direction: "rtl",
          remark: "",
          editFlag: false,
          transformOrigin: [0, 0],
          rows: [
            {
              rule: "headers",
              name: "",
              editable: false,
              inputId: "epdg4u19vt",
              outputId: "z7q5j2hh7r",
              data: {
                a: 3,
              },
            },
            {
              rule: "body",
              name: "",
              editable: false,
              inputId: "19cpvfow8t3",
              outputId: "1ebpjakglub",
              data: {
                b: 4,
              },
            },
            {
              rule: "body-buffer",
              name: "",
              editable: false,
              inputId: "2l0k3yxbcd",
              outputId: "15r89orqkn7",
              data: "",
            },
          ],
        },
        {
          type: "error",
          title: "http异常-1",
          id: "25aftdmogco",
          initX: 523.5654449462891,
          initY: 601,
          x: 0,
          y: 0,
          w: 100,
          h: 50,
          direction: "rtl",
          remark: "",
          editFlag: false,
          transformOrigin: [0, 0],
          rows: [
            {
              rule: "504",
              name: "504",
              editable: true,
              outputId: "21x24nux8f",
            },
          ],
        },
        {
          type: "server",
          title: "服务端-2",
          id: "c87yavdfqe",
          initX: 607.5654449462891,
          initY: 378,
          x: 0,
          y: 0,
          w: 100,
          h: 80,
          direction: "ltl",
          remark: "",
          rows: [
            {
              rule: "*",
              name: "",
              editable: false,
              inputId: "1q8qmak0v7w",
            },
            {
              rule: "*",
              name: "",
              editable: false,
              outputId: "nm0wqi2pjf",
            },
          ],
        },
      ] as QdzNode[],
      linkList: [
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
        {
          id: "gj98gsyoee",
          startNode: null,
          endNode: null,
          startTmp: null,
          endTmp: null,
          path: "",
          points: [0, 0, 0, 0],
          startNodeId: "4u06uhwqoq",
          endNodeId: "1g781d9f88d",
          start: "1qvk2z99o7r",
          end: "g718df1787",
          direction: "rtl",
        },
        {
          id: "g89iejjeefg",
          startNode: null,
          endNode: null,
          startTmp: null,
          endTmp: null,
          path: "",
          points: [0, 0, 0, 0],
          startNodeId: "ge988d8fg1g",
          endNodeId: "2modwqmv1rs",
          start: "20lfpo4j630",
          end: "1m92bcnafdc",
          direction: "rtl",
        },
        {
          id: "w8hf7osdgg",
          startNode: null,
          endNode: null,
          startTmp: null,
          endTmp: null,
          path: "",
          points: [0, 0, 0, 0],
          startNodeId: "2modwqmv1rs",
          endNodeId: "4u06uhwqoq",
          start: "2gvfe5szfrg",
          end: "13i43q8171s",
          direction: "rtl",
        },
        {
          id: "bxj98skhfh",
          startNode: null,
          endNode: null,
          startTmp: null,
          endTmp: null,
          path: "",
          points: [0, 0, 0, 0],
          startNodeId: "s7ahr6yrbr",
          endNodeId: "q8g1688d8d",
          start: "1ebpjakglub",
          end: "47dcbpooxu",
          direction: "rtl",
        },
        {
          id: "mo9fspe87",
          startNode: null,
          endNode: null,
          startTmp: null,
          endTmp: null,
          path: "",
          points: [0, 0, 0, 0],
          startNodeId: "25aftdmogco",
          endNodeId: "q8g1688d8d",
          start: "21x24nux8f",
          end: "22jsxhh70zw",
          direction: "rtl",
        },
        {
          id: "2f9s8e9gh8wi",
          startNode: null,
          endNode: null,
          startTmp: null,
          endTmp: null,
          path: "",
          points: [0, 0, 0, 0],
          startNodeId: "ge988d8fg1g",
          endNodeId: "c87yavdfqe",
          start: "fdut7il6y",
          end: "1q8qmak0v7w",
          direction: "rtl",
        },
        {
          id: "23f9898shsdj",
          startNode: null,
          endNode: null,
          startTmp: null,
          endTmp: null,
          path: "",
          points: [0, 0, 0, 0],
          startNodeId: "c87yavdfqe",
          endNodeId: "q8g1688d8d",
          start: "nm0wqi2pjf",
          end: "1tgj42vb75e",
          direction: "rtl",
        },
      ] as QdzLink[],
      history: [] as { nodeList: QdzNode[]; linkList: QdzLink[] }[],
      maxHistoryLength: 10,
      resolverList: [new HttpLogResolver()],
    };
  },
  actions: {
    initCanvas(el: HTMLDivElement) {
      this.el = el;
    },
    setActiveNode(id: string) {
      this.activeNodeId = id;
    },
    removeActiveNode() {
      const idx = this.nodeList.findIndex(({ id }) => id === this.activeNodeId);
      if (idx !== -1) {
        this.nodeList.splice(idx, 1);
        // let
        this.linkList = this.linkList.filter(
          (l) =>
            l.startNodeId !== this.activeNodeId &&
            l.endNodeId !== this.activeNodeId
        );
        this.activeNodeId = "";
        this.saveHistory();
      }
    },
    setRect() {
      if (this.el) {
        this.rect = this.el.getBoundingClientRect();
      }
    },
    initTranslate(point: [number, number]) {
      this.setTranslate(point);
      this.initTranslateX = point[0];
      this.initTranslateY = point[1];
      this.nodeList = this.nodeList.map((node) => {
        return {
          ...node,
          x: node.initX - this.translateX,
          y: node.initY - this.translateY,
        };
      });
      this.linkList.forEach((link) => {
        link.startNode = null;
        link.endNode = null;
      });
      this.saveHistory();
    },
    setTranslate(point: [number, number]) {
      this.translateX = point[0];
      this.translateY = point[1];
      // (this.rect?.height || 0) / 2 - (this.el?.offsetHeight || 0) * 5;
    },
    setScale(scaleSize = 1) {
      if (scaleSize % 1 === 0) {
        this.scaleSize = scaleSize;
      } else {
        this.scaleSize = Math.round(scaleSize * 100) / 100;
      }
    },
    editRemak(id: string, value: string) {
      const node = this.nodeList.find((n) => n.id === id);
      if (node) {
        node.remark = value;
        this.saveHistory();
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
      this.saveHistory();
    },
    setNodeDirection(id: string, direction: "ltr" | "rtl" | "ltl" | "rtr") {
      const node = this.nodeList.find((n) => n.id === id);
      if (node) {
        node.direction = direction;
        this.saveHistory();
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
        this.saveHistory();
      }
    },
    addNodeRule(id: string, ruleName: string) {
      const node = this.nodeList.find((n) => n.id === id);
      if (node) {
        if (node.rows.findIndex(({ rule }) => rule === ruleName) === -1) {
          if (node.type === "response") {
            // 响应拦截添加输入端口，其余添加输出端口
            node.rows.push({
              rule: ruleName,
              name: ruleName,
              editable: true,
              inputId: getRandomId(),
            });
          } else if (node.type === "delay") {
            node.rows.push({
              rule: ruleName,
              name: ruleName,
              editable: true,
              outputId: getRandomId(),
              inputId: getRandomId(),
            });
          } else {
            node.rows.push({
              rule: ruleName,
              name: ruleName,
              editable: true,
              outputId: getRandomId(),
            });
          }
          this.saveHistory();
        }
      }
    },
    deleteNodeRule(id: string, ruleName: string) {
      const node = this.nodeList.find((n) => n.id === id);
      if (node) {
        const idx = node.rows.findIndex(({ rule }) => rule === ruleName);
        const ruleId = node.rows[idx].inputId || node.rows[idx].outputId;
        if (idx !== -1) {
          node.rows.splice(idx, 1);
          const linkIdx = this.linkList.findIndex(
            (l) => l.start === ruleId || l.end === ruleId
          );
          if (linkIdx !== -1) {
            this.linkList.splice(linkIdx, 1);
          }
          this.saveHistory();
        }
      }
    },
    setHost(id: string, host: string) {
      const node = this.nodeList.find((n) => n.id === id);
      if (node) {
        node.host = host;
        this.saveHistory();
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
      let [initX, initY] = node.position;
      const [w, h] = this.sizes[node.type];
      initX = Math.min(initX, offsetWidth - w - 20);
      initY = Math.min(initY, offsetHeight - h - 20);
      const newNode: QdzNode = {
        type: node.type,
        id,
        title: node.title,
        initX,
        initY,
        // position: [100, 200],
        x: initX - this.translateX,
        y: initY - this.translateY,
        w,
        h,
        transformOrigin: [0, 0],
        editFlag: true,
        rows: [],
        direction: this.directions[node.type] as "ltr" | "rtl" | "rtr" | "ltl",
      };
      if (node.type === "remark") {
        newNode.remark = "右键编辑标记内容～";
      } else if (node.type === "delay") {
        newNode.rows = [];
      } else if (node.type === "error") {
        newNode.rows = [];
      } else {
        newNode.rows = [
          { rule: "*", name: "", editable: false, inputId: getRandomId() },
          { rule: "*", name: "", editable: false, outputId: getRandomId() },
        ];
      }

      this.nodeList.push(newNode);
      this.saveHistory();
      callback(id);
    },
    appendSourceNode(
      node: {
        type: QdzNodeType;
        title: string;
        position: [number, number];
        rows: { rule: string; data: any }[];
      },
      callback: (id: string) => void
    ) {
      const id = getRandomId();
      const { offsetWidth, offsetHeight } = this.el as HTMLDivElement;
      let [initX, initY] = node.position;
      const [w, h] = this.sizes[node.type];
      initX = Math.min(initX, offsetWidth - w - 20);
      initY = Math.min(initY, offsetHeight - h - 20);
      this.nodeList.push({
        type: node.type,
        id,
        title: node.title,
        initX,
        initY,
        // position: [100, 200],
        x: initX - this.translateX,
        y: initY - this.translateY,
        w,
        h,
        transformOrigin: [0, 0],
        editFlag: true,
        direction: this.directions[node.type] as "ltr" | "rtl" | "rtr" | "ltl",
        rows: node.rows.map((row) => ({
          rule: row.rule,
          name: "",
          editable: false,
          inputId: getRandomId(),
          outputId: getRandomId(),
          data: row.data,
        })),
        remark: node.type === "remark" ? "右键编辑标记内容～" : undefined,
      });
      this.saveHistory();
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
    _saveHistory: debounce(function (that) {
      that.history.push({
        nodeList: cloneDeep(that.nodeList),
        linkList: cloneDeep(that.linkList),
      });
      if (that.history.length > that.maxHistoryLength) {
        that.history.shift();
      }
    }, 200),
    saveHistory() {
      this._saveHistory(this);
    },
    undo(callback: Function) {
      if (this.history.length < 2) {
        return void 0;
      }
      this.history.splice(this.history.length - 1);
      const his = this.history[this.history.length - 1];
      if (his) {
        this.nodeList = cloneDeep(his.nodeList);
        this.linkList = his.linkList.map((link: QdzLink) => ({
          ...link,
          startNode: null,
          endNode: null,
        }));
      }
      callback();
    },
    async resolve(file: File, point: [number, number]) {
      // const next = this.resolverList[0];
      let idx = 0,
        isOk = false;
      try {
        while (idx < this.resolverList.length) {
          const result = await this.resolverList[idx].resolve(file);
          idx++;
          if (result.title) {
            const { title, rows } = result;
            isOk = true;
            console.log("isOk");
            this.appendSourceNode(
              {
                type: "source",
                title: title,
                position: point,
                rows: rows,
              },
              () => {}
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
      if (!isOk) {
        throw new Error("不支持的文件格式");
      }
    },
  },
});
