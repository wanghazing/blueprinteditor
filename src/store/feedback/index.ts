import { defineStore } from "pinia";

export const useFeedbackStore = defineStore("feedback", {
  state: () => {
    return {
      showLoading: false,
      loadingText: '加载中'
    };
  },
  actions: {
    toast({ message, severity = 'info', title = '温馨提示', duration = 3000 }: { message: string; severity?: 'success' | 'info' | 'warn' | 'error'; title?: string; duration?: number }) {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            message,
            severity,
            summary: title,
            duration
          }
        })
      );
    },
    startLoading(text?: string) {
      text && (this.loadingText = text);
      this.showLoading = true
    },
    stopLoading() {
      this.showLoading = false
    }
  },
});
