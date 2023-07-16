import axios, { AxiosInstance } from "axios";

// import { useFeedbackStore } from "/@/store/feedback";
// const feedback = useFeedbackStore();
// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: "api/",
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
  // paramsSerializer: {
  // 	serialize(params) {
  // 		return qs.stringify(params, { allowDots: true });
  // 	},
  // },
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    config.data = { ...config.data }
    config.params = { ...config.params };
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log(response.data)
    if (response.data && response.data.status === 1) {
      return response.data;
    }
    const message = response.data.message || response.data.data
    window.dispatchEvent(
      new CustomEvent("toast", {
        detail: {
          severity: 'warn',
          life: 3000,
          message
        },
      })
    );
    throw new Error(message)
  },
  (error) => {
    console.log('on error')
    // axios异常
    if (error.message.indexOf("timeout") != -1) {
      // ElMessage.error('网络超时');
    } else if (error.message == "Network Error") {
      // ElMessage.error('网络连接错误');
    } else {
      // `token` 过期或者账号已在别处登录
      if (error.response.data.code === 401) {
        // Session.clear(); // 清除浏览器全部临时缓存
        // window.location.href = '/'; // 去登录页
        // ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
        // .then(() => {})
        // .catch(() => {});
      } else if (error.response.data) {
        let msg = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message;
        // ElMessage.error(msg || error.response.statusText);
      } else {
      }
    }

    return Promise.reject(error);
  }
);

// 导出 axios 实例
export default service;
