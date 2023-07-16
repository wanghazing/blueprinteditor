import request from "/@/utils/request";

export function useProxyApi() {
  return {
    getAllList() {
      return request({
        url: "/proxy/getAllList",
        method: "get",
      });
    },
    getLocalhost() {
      return request({
        url: "/proxy/getLocalhost",
        method: "get",
      });
    },
    getAvailablePort(params?: object) {
      return request({
        url: "/proxy/getAvailablePort",
        method: "get",
        params,
      });
    },
    createProxy(data?: object) {
      return request({
        url: "/proxy/add",
        method: "post",
        data,
      });
    },
    updateProxy(data?: object) {
      return request({
        url: "/proxy/update",
        method: "post",
        data,
      });
    },
    removeProxy(data?: object) {
      return request({
        url: "/proxy/remove",
        method: "post",
        data,
      });
    },
    startServer(data?: object) {
      return request({
        url: "/proxy/launch",
        method: "post",
        data,
      });
    },
    stopServer(data?: object) {
      return request({
        url: "/proxy/unLaunch",
        method: "post",
        data,
      });
    },
  };
}
