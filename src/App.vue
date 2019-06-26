<template>
  <div id="app">
    <div style="width: 500px;margin-right: 20px;display: inline-block;float: left">
      <button @click="$refs.vueShapeImg1.fileClick()">localImg</button>
      <button @click="$refs.vueShapeImg1.setImgSrc('http://www.bqmyweb.cn/vueshapeimg/demo.png')">networkImg</button>
      <button @click="$refs.vueShapeImg1.showMask()">startCrop</button>
      <button @click="$refs.vueShapeImg1.closeMask()">endCrop</button>
      <button @click="$refs.vueShapeImg1.rotate(10)">rotate10</button>
      <button @click="$refs.vueShapeImg1.rotate(-10)">rotate-10</button>
      <button @click="getImg1">getImg</button>
      <p style="font-size: 18px;font-weight: bold;">useFrame:false</p>
      <vueShapeImg @error="imgError"  :height="400" :width="400" :useFrame="false" :timelyImageData="true" @imageDataChange="putImg1" ref="vueShapeImg1"></vueShapeImg>
      <canvas id="canvas1"></canvas>
    </div>
    <div style="width: 500px;display: inline-block;float: left">
      <button @click="$refs.vueShapeImg2.fileClick()">localImg</button>
      <button @click="$refs.vueShapeImg2.setImgSrc('http://www.bqmyweb.cn/vueshapeimg/demo.png')">networkImg</button>
      <button @click="$refs.vueShapeImg2.showMask()">startCrop</button>
      <button @click="$refs.vueShapeImg2.closeMask()">endCrop</button>
      <button @click="getImg2">getImg</button>
      <button @click="$refs.vueShapeImg2.setRange([100,100,200,100])">setRange</button>
      <button @click="$refs.vueShapeImg2.rotate(10)">rotate10</button>
      <button @click="$refs.vueShapeImg2.rotate(-10)">rotate-10</button>
      <p style="font-size: 18px;font-weight: bold;">useFrame:true</p>
      <vueShapeImg @error="imgError" :height="400" :width="400" :useFrame="true" :timelyImageData="true" :aspectRatio="true"
                   @imageDataChange="putImg2" :disableResize="false" ref="vueShapeImg2"></vueShapeImg>
      <canvas style="margin-left: 50px" id="canvas2"></canvas>
    </div>
    <div style="clear: both"></div>
  </div>
</template>

<script>
export default {
  name: "app",
  data () {
    return {
      canvas1: null,
      canvas1Ctx: null,
      canvas2: null,
      canvas2Ctx: null
    };
  },
  mounted () {
    this.canvas1 = document.getElementById("canvas1");
    this.canvas1Ctx = this.canvas1.getContext("2d");
    this.canvas2 = document.getElementById("canvas2");
    this.canvas2Ctx = this.canvas2.getContext("2d");
  },
  methods: {
    putImg1 (imgData) {
      this.canvas1Ctx.clearRect(0, 0, 500, 500);
      let obj = this.$refs.vueShapeImg1.getRange();
      this.canvas1.width = obj.w;
      this.canvas1.height = obj.h;
      this.canvas1Ctx.putImageData(imgData, 0, 0);
    },
    putImg2 (imgData) {
      this.canvas2Ctx.clearRect(0, 0, 500, 500);
      let obj = this.$refs.vueShapeImg2.getRange();
      this.canvas2.width = obj.w;
      this.canvas2.height = obj.h;
      this.canvas2Ctx.putImageData(imgData, 0, 0);
    },
    getImg1 () {
      this.$refs.vueShapeImg1.getImg("base64", "image/jpeg", 0.7);
    },
    getImg2 () {
      this.$refs.vueShapeImg2.getImg("base64", "image/jpeg", 0.7);
    },
    imgError (error) {
    },
  }
};
</script>

<style>
</style>
