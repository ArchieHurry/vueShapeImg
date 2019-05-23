import Vue from "vue";
import App from "./App.vue";
import vueshapeimg from "./index";
Vue.use(vueshapeimg);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App)
});
