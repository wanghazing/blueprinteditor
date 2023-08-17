import Page404 from "./views/404/index.vue";
import Blueprint from "./views/blueprint/index.vue";
const routes = [
  { path: "/", redirect: "/blueprint" },
  { path: "/blueprint", component: Blueprint },
  { path: "/404", component: Page404 },
  { path: "/:pathMatch(.*)", redirect: "/404" },
];

export default routes;
