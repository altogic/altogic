import Vue from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import VueRouter from "vue-router";

Vue.config.productionTip = false;
Vue.use(VueRouter);

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
