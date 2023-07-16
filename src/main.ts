import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice"

import "./style.css";
import "primevue/resources/themes/tailwind-light/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import App from "./App.vue";
import routes from "./routes";

const pinia = createPinia();
createApp(App)
  .use(PrimeVue)
  .use(pinia)
  .use(
    createRouter({
      history: createWebHashHistory(),
      routes,
    })
  )
  .use(ToastService)
  .use(ConfirmationService)
  .directive("tooltip", Tooltip)
  .mount("#app");
