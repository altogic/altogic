import VueRouter from "vue-router";

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "index",
      component: () => import("@/components/BlogList.vue"),
    },
    {
      path: "/blog/:id",
      name: "blog",
      component: () => import("@/components/SingleBlog.vue"),
    },
  ],
  mode: "history",
});

export default router;
