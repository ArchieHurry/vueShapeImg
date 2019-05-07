import vueShapeImg from './components/index.vue'
const obj = {
  install (Vue, options) {
    Vue.component('vueShapeImg', vueShapeImg)
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueShapeImg);
}
export default obj
