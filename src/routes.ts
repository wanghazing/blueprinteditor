import Home from "./views/home/index.vue";
import Proxy from "./views/proxy/index.vue";
import Page404 from "./views/404/index.vue"
import Bookmark from "./views/bookmark/index.vue"
import Blueprint from "./views/blueprint/index.vue"
import ApiHistory from "./views/history/index.vue"
import Base64Viewer from "./views/base64-viewer/index.vue"
const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
  { path: "/proxy", component: Proxy },
  { path: "/bookmark", component: Bookmark },
  { path: "/blueprint", component: Blueprint },
  { path: "/api-history", component: ApiHistory },
  { path: "/base64-viewer", component: Base64Viewer },
  { path: "/404", component: Page404 },
  { path: '/:pathMatch(.*)', redirect: '/404' }
];

export default routes;
