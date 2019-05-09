<template>
  <div id="app">
    <div style="margin: 20px auto; width: 500px">
      <button @click="$refs.cropper1.fileClick()" >本地图片</button>
      <button @click="$refs.cropper1._main('https://i.loli.net/2019/05/05/5cce957e23c2c.jpg')">设置网络图片</button>
      <button @click="$refs.cropper1.showMask()" >开始裁剪</button>
      <button @click="$refs.cropper1.closeMask()" >关闭裁剪</button>
      <button @click="ppp1" >获取图片</button>
      <vueShapeImg :useFrame="true" ref="cropper1"></vueShapeImg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  },
  methods: {
    rangeChange (obj) {
      console.log(obj)
    },
    imageDataChange (data) {
      console.log(data)
    },
    ppp1 () {
      console.log(this.$refs.cropper1.getImg('blob', 'image/jpeg',0.2))
    }
  }
}
</script>

<style>
</style>
