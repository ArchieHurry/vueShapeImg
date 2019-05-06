import Vue from 'vue'
import App from './App.vue'
import vueshapeimg from './index.js'
Vue.use(vueshapeimg)
new Vue({
  el: '#app',
  render: h => h(App)
})
