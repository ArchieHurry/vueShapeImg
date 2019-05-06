import vueShapeImg from './components/index.vue'

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueShapeImg);
}
const obj = {
  install (Vue, options) {
    Vue.component('vueShapeImg', vueShapeImg)
  }
}

export default obj
