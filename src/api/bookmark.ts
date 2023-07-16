import request from "/@/utils/request";

export function useBookmarkApi() {
  return {
    getAllList() {
      return request({
        url: "/bookmark/getAllList",
        method: "get",
      });
    },
  };
}
