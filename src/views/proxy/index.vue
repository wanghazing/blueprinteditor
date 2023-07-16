<template>
  <div>
    <div class="action-line">
      <div class="search-box">
        <div class="tw-w-24 tw-mr-4">
          <Button
            v-if="state.isShowBottomAction"
            label="取消多选"
            link
            @click="onCancelSelect"
          />
          <Button v-else label="多选" link @click="showAllAction" />
        </div>
        <div class="p-inputgroup" v-if="state.isSearch">
          <InputText v-model="state.searchText" placeholder="请输入关键字" />
          <Button
            icon="pi pi-search"
            severity="success"
            @click="handleSearch"
          />
        </div>
        <Button
          v-else
          label="搜索"
          link
          @click="state.isSearch = !state.isSearch"
        />
      </div>
      <Button
        label="创建代理服务"
        class="tw-w-64"
        outlined
        @click="showDialog"
      />
    </div>
    <div
      class="tw-mb-4 card-wrap"
      v-for="server in visibleServerList"
      :key="server.id"
    >
      <div class="check-box-wrap" v-if="state.isShowBottomAction">
        <Checkbox
          :modelValue="
            state.selectedList.findIndex((id) => id === server.id) !== -1
          "
          :binary="true"
          @input="(val) => onCheck(val, server.id)"
        ></Checkbox>
      </div>
      <Card :class="{ 'card-in': state.isShowBottomAction }">
        <template #title>{{ server.name }}</template>
        <template #content>
          <div class="server-view">
            <div class="icon-view tw-mr-6">
              <div
                class="
                  tw-rounded-full
                  tw-m-2
                  tw-w-8
                  tw-h-8
                  tw-text-orange-50
                  tw-text-center
                  tw-leading-8
                "
                :class="[
                  [
                    'tw-bg-amber-400',
                    'tw-bg-red-400',
                    'tw-bg-orange-400',
                    'tw-bg-lime-400',
                    'tw-bg-green-400',
                    'tw-bg-emerald-400',
                    'tw-bg-teal-400',
                    'tw-bg-cyan-400',
                    'tw-bg-indigo-400',
                    'tw-bg-violet-400',
                    'tw-bg-gray-400',
                  ][server.isRunning ? server.colorIndex : 10],
                ]"
              >
                <i v-if="server.platform === 'mobile'" class="pi pi-mobile"></i>
                <i
                  v-else-if="server.platform === 'pc'"
                  class="pi pi-desktop"
                ></i>
                <i
                  v-else-if="server.platform === 'file'"
                  class="pi pi-file-export"
                ></i>
                <i v-else class="pi pi-server"></i>
              </div>
            </div>
            <div class="info-view tw-mr-12">
              <p class="tw-text-lg">映射地址：{{ server.target }}</p>
              <p class="tw-text-lg">占用端口：{{ server.port }}</p>
              <p class="tw-text-sm tw-mt-2 tw-text-neutral-400">
                {{ server.isSave ? "启用报文录制" : "关闭报文录制" }}
              </p>
            </div>
            <div class="remark-view">
              <!-- <p v-if="server.isRunning" class="tw-text-base text-lime-500">
              运行中
            </p> -->

              <!-- <Button v-if="server.isRunning" severity="danger" link>关闭</Button>
            <Button v-else link>启动</Button> -->
              <SplitButton
                label="操作"
                @click="() => {}"
                :model="getAction(server)"
              ></SplitButton>
              <p class="tw-text-sm tw-mt-2 tw-text-neutral-400">
                {{ server.remark }}
              </p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <div class="action-panel" :class="{ 'action-in': state.isShowBottomAction }">
    <div class="action-box">
      <div class="tw-mr-4">已选择:{{ state.selectedList.length }}</div>
      <Button label="启动" text severity="success" @click="showDialog" />
      <Button label="关闭" text @click="showDialog" />
    </div>
    <div class="action-box">
      <Button label="删除" severity="danger" text @click="showDialog" />
    </div>
  </div>
  <Dialog
    v-model:visible="state.visible"
    modal
    :header="{ add: '创建代理服务', edit: '编辑代理服务' }[state.dialogTarget]"
    :style="{ minWidth: '50rem' }"
  >
    <div>
      <transition name="p-message" tag="div">
        <Message v-if="state.validMsg" :closable="false" severity="warn">{{
          state.validMsg
        }}</Message>
      </transition>
      <div>
        <label for="name" class="tw-mr-2 tw-w-28 tw-inline-block"
          >服务器名称</label
        >
        <InputText
          id="name"
          size="small"
          v-model="state.dataForm.name"
          placeholder="请输入服务器名称"
        />
      </div>
      <div class="tw-mt-2">
        <label for="platform" class="tw-mr-2 tw-w-28 tw-inline-block"
          >类型</label
        >
        <Dropdown
          size="small"
          v-model="state.dataForm.platform"
          placeholder="请选择"
          :options="platformList"
          option-label="name"
          option-value="value"
          style="width: 250px"
          showClear
        />
        <div class="color-picker tw-inline-block">
          <div
            class="color-picker-item tw-bg-amber-400"
            :class="{ 'color-picker__active': state.dataForm.colorIndex === 0 }"
            @click="state.dataForm.colorIndex = 0"
          ></div>
          <div
            class="color-picker-item tw-bg-red-400"
            :class="{ 'color-picker__active': state.dataForm.colorIndex === 1 }"
            @click="state.dataForm.colorIndex = 1"
          ></div>
          <div
            class="color-picker-item tw-bg-orange-400"
            :class="{ 'color-picker__active': state.dataForm.colorIndex === 2 }"
            @click="state.dataForm.colorIndex = 2"
          ></div>
          <div
            class="color-picker-item tw-bg-lime-400"
            :class="{ 'color-picker__active': state.dataForm.colorIndex === 3 }"
            @click="state.dataForm.colorIndex = 3"
          ></div>
          <div
            class="color-picker-item tw-bg-green-400"
            :class="{ 'color-picker__active': state.dataForm.colorIndex === 4 }"
            @click="state.dataForm.colorIndex = 4"
          ></div>
          <div
            class="color-picker-item tw-bg-emerald-400"
            :class="{ 'color-picker__active': state.dataForm.colorIndex === 5 }"
            @click="state.dataForm.colorIndex = 5"
          ></div>
          <div
            class="color-picker-item tw-bg-teal-400"
            :class="{ 'color-picker__active': state.dataForm.colorIndex === 6 }"
            @click="state.dataForm.colorIndex = 6"
          ></div>
          <div
            class="color-picker-item tw-bg-cyan-400"
            :class="{ 'color-picker__active': state.dataForm.colorIndex === 7 }"
            @click="state.dataForm.colorIndex = 7"
          ></div>
          <div
            class="color-picker-item tw-bg-indigo-400"
            :class="{ 'color-picker__active': state.dataForm.colorIndex === 8 }"
            @click="state.dataForm.colorIndex = 8"
          ></div>
          <div
            class="color-picker-item tw-bg-violet-400"
            :class="{ 'color-picker__active': state.dataForm.colorIndex === 9 }"
            @click="state.dataForm.colorIndex = 9"
          ></div>
        </div>
      </div>
      <div class="tw-mt-2">
        <label for="addr" class="tw-mr-2 tw-w-28 tw-inline-block"
          >服务器地址</label
        >
        <InputText
          id="addr"
          size="small"
          disabled
          v-model="state.dataForm.addr"
        />
        <label for="port" class="tw-mx-2">端口</label>
        <InputText
          id="port"
          size="small"
          class="tw-w-24"
          v-model="state.dataForm.port"
        />
        <Button
          class="tw-ml-2"
          v-tooltip="'获取一个可用的端口'"
          icon="pi pi-search"
          text
          rounded
          @click="getAPort"
        />
      </div>
      <div class="tw-mt-2">
        <label for="target" class="tw-mr-2 tw-w-28 tw-inline-block"
          >映射地址</label
        >
        <InputText
          id="target"
          size="small"
          placeholder="请输入映射地址"
          v-model="state.dataForm.target"
        />
      </div>
      <div class="tw-mt-2">
        <label for="pathRewrite" class="tw-mr-2 tw-w-28 tw-inline-block"
          >重写路径(可选)</label
        >
        <div class="tw-inline-block">
          <div
            v-for="(pathRewrite, index) in state.dataForm.pathRewrite"
            :key="index"
            class="tw-mb-2"
          >
            <InputText
              id="pathRewrite"
              size="small"
              v-model="pathRewrite.from"
              placeholder="/"
            />
            :
            <InputText
              id="pathRewrite"
              size="small"
              v-model="pathRewrite.to"
              placeholder="/redirect/to/something"
            />
            <Button
              class="tw-ml-2"
              v-tooltip="'新增规则'"
              icon="pi pi-plus"
              text
              rounded
              @click="addPathRewriteRule"
              v-if="index === state.dataForm.pathRewrite.length - 1"
            />
            <Button
              class="tw-ml-2"
              v-tooltip="'删除规则'"
              icon="pi pi-minus"
              v-if="index !== 0"
              text
              rounded
              @click="deletePathRewriteRule(index)"
            />
          </div>
        </div>
      </div>
      <div class="tw-mt-2 tw-flex tw-h-12 tw-flex-grow tw-items-center">
        <label for="isSave" class="tw-mr-2 tw-w-28 tw-inline-block"
          >保存报文</label
        >
        <InputSwitch v-model="state.dataForm.isSave" />
      </div>
    </div>
    <template #footer>
      <Button label="确定" icon="pi pi-check" @click="onSubmit" />
    </template>
  </Dialog>
  <Toast />
  <ConfirmDialog />
</template>
<script lang="ts" setup>
import { reactive, onMounted, ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Card from "primevue/card";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputSwitch from "primevue/inputswitch";
import Dropdown from "primevue/dropdown";
import Message from "primevue/message";
import SplitButton from "primevue/splitbutton";
import Checkbox from "primevue/checkbox";

import { useFeedbackStore } from "/@/store/feedback";
import { useProxyApi } from "/@/api/proxy";

type ServerConfig = {
  name: string;
  target: string;
  addr?: string;
  port: number;
  pathRewrite?: Record<string, string>;
  platform?: "mobile" | "pc" | "file" | "others";
  remark?: string;
  isSave: boolean;
  isRunning?: boolean;
  colorIndex?: number;
};
const toast = useToast();
const confirm = useConfirm();
const feedback = useFeedbackStore();
const {
  getLocalhost,
  getAvailablePort,
  getAllList,
  createProxy,
  updateProxy,
  removeProxy,
  startServer,
  stopServer,
} = useProxyApi();
const platformList = ref([
  { name: "手机服务", value: "mobile" },
  { name: "PC服务", value: "pc" },
  { name: "文件服务", value: "file" },
  { name: "其他", value: "others" },
]);
const serverList = ref([]);
const visibleServerList = computed(() => {
  // return state.isSearch
  if (state.isSearch) {
    return serverList.value.filter(
      (item) => item.name.indexOf(state.searchText) !== -1
    );
  }
  return serverList.value;
});
const state = reactive({
  visible: false,
  isShowBottomAction: false,
  isSearch: false,
  searchText: "",
  validMsg: "",
  selectedList: [],
  localhost: "",
  dialogTarget: "add",
  dataForm: {
    name: "",
    addr: "",
    port: "",
    target: "",
    platform: "",
    pathRewrite: [{ from: "", to: "" }],
    remark: "",
    isSave: false,
    colorIndex: 0,
    id: "",
  },
});
const showDialog = async () => {
  // 获取初始化数据
  state.dialogTarget = "add";
  state.dataForm = {
    name: "",
    addr: state.localhost,
    port: "",
    target: "",
    platform: "",
    pathRewrite: [{ from: "", to: "" }],
    remark: "",
    isSave: false,
    colorIndex: 0,
  };
  state.visible = true;
};
const getAPort = async () => {
  const res = await getAvailablePort();
  state.dataForm.port = res.data;
};
const onSubmit = async () => {
  if (!state.dataForm.name) {
    return (state.validMsg = "请输入服务器名称");
  }
  if (!state.dataForm.port) {
    return (state.validMsg = "请输入端口");
  }
  if (!state.dataForm.target) {
    return (state.validMsg = "请输入映射地址");
  }
  const data = {
    ...state.dataForm,
    pathRewrite: state.dataForm.pathRewrite.reduce(
      (pv: Record<string, string>, cv: { from: string; to: string }) => {
        pv[cv.from] = cv.to;
        return pv;
      },
      {}
    ),
  };
  try {
    feedback.startLoading();
    if (state.dialogTarget === "add") {
      await createProxy({
        ...data,
        id: undefined,
      });
    } else {
      await updateProxy(data);
    }
    toast.add({
      severity: "success",
      summary: "温馨提示",
      detail: "操作成功",
      life: 3000,
    });
    // feedback.toast({ message: "操作成功", severity: "success" });
    state.visible = false;
    getList();
  } catch (error) {
    console.log(error);
  } finally {
    feedback.stopLoading();
  }
};

const addPathRewriteRule = () => {
  state.dataForm.pathRewrite.push({ from: "", to: "" });
};
const deletePathRewriteRule = (index: number) => {
  state.dataForm.pathRewrite.splice(index, 1);
};
const showAllAction = () => {
  state.isShowBottomAction = true;
};
const onCancelSelect = () => {
  state.isShowBottomAction = false;
  state.selectedList = [];
};
const getAction = (server: ServerConfig & { id: string }) => {
  // if (!)
  // const list = [];
  // if (!server.isRunning) {}
  const list = [
    {
      label: "编辑",
      icon: "pi pi-pencil",
      command: () => {
        if (server.isRunning) {
          toast.add({
            severity: "warn",
            summary: "温馨提示",
            detail: "请先关闭服务器",
            life: 3000,
          });
        } else {
          // Object.assign(state.dataForm, server);
          const {
            name,
            port,
            target,
            platform,
            pathRewrite = {},
            remark,
            isSave,
          } = server;
          let list = [];
          for (let key in pathRewrite) {
            list.push({ from: key, to: pathRewrite[key] });
          }
          if (list.length === 0) {
            list = [{ from: "", to: "" }];
          }
          state.dataForm = {
            name,
            addr: state.localhost,
            port,
            target: target,
            platform,
            pathRewrite: list,
            remark,
            isSave,
            colorIndex: server.colorIndex,
            id: server.id,
          };
          console.log(state.dataForm);
          state.dialogTarget = "edit";
          state.visible = true;
        }
      },
    },
    {
      label: "克隆",
      icon: "pi pi-clone",
      command: () => {
        const {
          name,
          port,
          target,
          platform,
          pathRewrite = {},
          remark,
          isSave,
        } = server;
        let list = [];
        for (let key in pathRewrite) {
          list.push({ from: key, to: pathRewrite[key] });
        }
        if (list.length === 0) {
          list = [{ from: "", to: "" }];
        }
        state.dataForm = {
          name,
          addr: state.localhost,
          port,
          target: target,
          platform,
          pathRewrite: list,
          remark,
          isSave,
          colorIndex: 0,
        };
        state.dialogTarget = "add";
        state.visible = true;
      },
    },
    {
      label: "删除",
      icon: "pi pi-trash",
      command: () => {
        if (server.isRunning) {
          toast.add({
            severity: "warn",
            summary: "温馨提示",
            detail: "请先关闭服务器",
            life: 3000,
          });
        } else {
          confirm.require({
            message: "确定删除此代理服务吗？",
            header: "温馨提示",
            acceptClass: "p-button-danger",
            accept: async () => {
              try {
                feedback.startLoading();
                await removeProxy({ id: server.id });
                toast.add({
                  severity: "success",
                  summary: "温馨提示",
                  detail: "操作成功",
                  life: 3000,
                });
                getList();
              } catch (error) {
                console.log(error);
              } finally {
                feedback.stopLoading();
              }
            },
          });
        }
      },
    },
  ];
  if (server.isRunning) {
    list.unshift({
      label: "关闭",
      icon: "pi pi-power-off",
      command: () => {
        confirm.require({
          message: "确定关闭此代理服务吗？",
          header: "温馨提示",
          acceptClass: "p-button-danger",
          accept: async () => {
            try {
              feedback.startLoading();
              await stopServer({ id: server.id });
              toast.add({
                severity: "success",
                summary: "温馨提示",
                detail: "服务已开启",
                life: 3000,
              });
              getList();
            } catch (error) {
              console.log(error);
            } finally {
              feedback.stopLoading();
            }
          },
        });
      },
    });
  } else {
    list.unshift({
      label: "启动",
      icon: "pi pi-play",
      command: () => {
        try {
          const action = async () => {
            try {
              await startServer({ id: server.id });
              toast.add({
                severity: "success",
                summary: "温馨提示",
                detail: "服务已开启",
                life: 3000,
              });
              getList();
            } catch (error) {
              // console.log(error)
              throw error;
            }
          };
          console.log(serverList.value, server.port);
          const idx = serverList.value.findIndex(
            (s) => Number(s.port) === Number(server.port) && s.isRunning
          );
          if (idx !== -1) {
            confirm.require({
              message: `端口${server.port}已被服务【${serverList.value[idx].name}】占用,是否关闭服务【${serverList.value[idx].name}】并启动【${server.name}】？`,
              header: "温馨提示",
              acceptClass: "p-button-danger",
              accept: async () => {
                try {
                  feedback.startLoading();
                  await stopServer({ id: serverList.value[idx].id });
                  action();
                } catch (error) {
                  console.log(error);
                } finally {
                  feedback.stopLoading();
                }
              },
            });
          } else {
            feedback.startLoading();
            action();
          }
        } catch (error) {
          console.log(error);
        } finally {
          feedback.stopLoading();
        }
      },
    });
  }
  return list;
};
const onCheck = (value: boolean, id: string) => {
  // console.log(value);
  if (value) {
    state.selectedList.push(id);
  } else {
    let idx = state.selectedList.findIndex((s: string) => s === id);
    state.selectedList.splice(idx, 1);
  }
};
const getList = async () => {
  const res2 = await getAllList();
  // console.log(res);
  serverList.value = res2.data.sort(
    (a, b) => Number(b.isRunning) - Number(a.isRunning)
  );
};
onMounted(async () => {
  const res1 = await getLocalhost();
  state.localhost = res1.data;
  getList();
});
</script>
<style lang="scss">
.action-line {
  margin: 1rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .search-box {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
.server-view {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.info-view {
  flex-grow: 1;
}
.remark-view {
  width: 240px;
  text-align: right;
}
.color-picker {
  width: 240px;
  height: 50px;
  vertical-align: -webkit-baseline-middle;
  margin-left: 0.5rem;
  &-item {
    width: 24px;
    height: 36px;
    display: inline-block;
  }
  &__active {
    border: 3px solid #333;
  }
}
.action-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: -170px;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: #ffffff;
  transition: all 0.3s ease;
  .action-box {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
.action-in {
  transform: translateY(-170px);
  @apply tw-shadow-2xl;
  @apply tw-shadow-neutral-700;
}
.card-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .check-box-wrap {
    width: 40px;
    text-align: right;
  }
  .p-card {
    flex-grow: 1;
    transition: all 0.3s ease;
  }
}
.card-in {
  transform: translateX(40px);
}
</style>
