import {
  createRouter,
  createWebHashHistory,
  type LocationQueryRaw,
  type RouteParams,
} from "vue-router";

export type Route = "home" | "card" | "settings";

export const router = createRouter({
  history: createWebHashHistory("/trunk"),
  routes: [
    {
      path: "/",
      name: "home" satisfies Route,
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/card",
      name: "card" satisfies Route,
      component: () => import("@/views/Card.vue"),
    },
    {
      path: "/settings",
      name: "settings" satisfies Route,
      component: () => import("@/views/Settings.vue"),
    },
  ],
});

export interface RouteOptions {
  params?: Option<RouteParams>;
  query?: Option<LocationQueryRaw>;
}

export function go(route: Route, options?: RouteOptions) {
  return router.push({
    name: route,
    params: options?.params ?? {},
    query: options?.query ?? {},
  });
}
