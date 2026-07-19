import { createRouter, createWebHashHistory } from "vue-router";

export const router = createRouter({
  history: createWebHashHistory("/trunk"),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/card",
      name: "card",
      component: () => import("@/views/Card.vue"),
    },
  ],
});
