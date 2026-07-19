import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory("/trunk"),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/card/:id",
      name: "card",
      component: () => import("@/views/Card.vue"),
    },
  ],
});
