<template>
  <div :id="`cropper${timeId}`">
    <div class="cropper" :style="{ height: height + 'px', width: width + 'px' }">
      <canvas :id="`canvas${timeId}`" class="canvas"></canvas>
      <canvas :id="`canvas1${timeId}`" class="mask" v-show="mask"></canvas>
      <input type="file" ref="file" @change="_fileChange" v-show="false">
    </div>
  </div>
</template>

<script>
export default {
  name: 'cropper',
  data () {
    return {
      timeId: '',
      ctx: null,
      canvasObj: null,
      maskObj: null,
      mask: false,
      maskCtx: null,
      x: 0, y: 0, w: 0, h: 0
    }
  },
  props: {
    height: {
      type: Number,
      default: 500
    },
    width: {
      type: Number,
      default: 500
    },
    timelyGetRange: {
      type: Boolean,
      default: false
    },
    timelyImageData: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.timeId = new Date().valueOf()
  },
  mounted () {
    this.init()
  },
  methods: {
    showMask () {
      this.mask = true;
    },
    setImgSrc (imgSrc) {
      this._main(imgSrc)
    },
    closeMask () {
      this.mask = false;
    },
    getRange () {
      return { x: this.x, y: this.y, w: this.w, h: this.h }
    },
    fileClick () {
      this.$refs.file.click()
    },
    // type 可以为base64，blob
    getImg (type = 'base64', imgType = 'image/png', encoderOptions = 0.92) {
      const s = this;
      let imgData = s.ctx.getImageData(s.x, s.y, s.w, s.h);
      s.closeMask()
      s.maskObj.width = s.w
      s.maskObj.height = s.h
      s.maskCtx.clearRect(0, 0, s.maskObj.width, s.maskObj.height);
      s.maskCtx.putImageData(imgData, 0, 0);
      let res = s.maskObj.toDataURL(imgType, encoderOptions)
      if (type === 'blob') {
        res = s._Base64toBlob(res)
      }
      s.maskObj.width = s.width
      s.maskObj.height = s.height
      return res
    },
    _Base64toBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    init () {
      let s = this;
      s.maskObj = document.getElementById('canvas1' + s.timeId);
      s.maskCtx = s.maskObj.getContext('2d');
      s.canvasObj = document.getElementById('canvas' + s.timeId);
      s.canvasObj.width = s.width;
      s.canvasObj.height = s.height;
      s.maskObj.width = s.width;
      s.maskObj.height = s.height;
      s.ctx = s.canvasObj.getContext('2d');
    },
    _drawMask (x, y, w, h) {
      let s = this;
      s.maskCtx.clearRect(0, 0, s.maskObj.width, s.maskObj.height);
      s.maskCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      if (w < 0){ x = x + w; w = -w }
      if (h < 0) { y = y + h; h = -h }
      s.maskCtx.fillRect(0,0,s.canvasObj.width, y);
      s.maskCtx.fillRect(0,y,x, s.canvasObj.height - y);
      s.maskCtx.fillRect(x + w, y, s.canvasObj.width -x - w, s.canvasObj.height - y);
      s.maskCtx.fillRect(x, y + h, w, s.canvasObj.height - h - y);
      s.x = x;s.y = y;s.h = h;s.w = w;
      if (s.timelyGetRange) s.$emit('rangeChange', { x: x, y: y, w: w, h: h })
      if (s.timelyImageData) {
        let timer = null
        if (timer) return
        timer = setTimeout(function () {
          try{ s.$emit('imageDataChange', s.ctx.getImageData(x, y, w, h)) }catch (e) {}
        }, 50)
      }
    },
    _main (imgSrc) {
      const s = this
      let img = new Image();
      img.crossorigin = '';
      img.onload = function () {
        let h = s.canvasObj.width / img.width * img.height;
        let w = s.canvasObj.width;
        h *= 1;
        w *= 1;
        let left = 0;
        let top = (s.canvasObj.height - h) / 2;
        s.ctx.clearRect(0, 0, s.canvasObj.width, s.canvasObj.height);
        s.ctx.drawImage(img, left, top, w, h);
        let imgX = 0, imgY = top;
        // 遮罩层绘制
        s.maskObj.onmousedown = function(e) {
          let timer = null;
          if (s.mask) { // 出现遮罩层停止操作
            let ox = e.offsetX || e.layerX;
            let oy = e.offsetY || e.offsetY;
            s.maskObj.onmousemove = function (e) {
              if (!timer) {
                timer = setTimeout(function () {
                  s._drawMask(ox, oy, (e.offsetX || e.layerX) - ox, (e.offsetY || e.layerY) - oy)
                  timer = null;
                }, 17)
              }
            };
          }
        }
        // 图片拖拽
        s.canvasObj.onmousedown = function (e) {
          let timer = null;
          let cx = e.clientX;
          let cy = e.clientY;
          s.canvasObj.onmousemove = function (e) {
            if (!timer) {
              timer = setTimeout(function () {
                s.ctx.clearRect(0,0, s.canvasObj.width, s.canvasObj.height);
                imgX += (e.clientX - cx);
                imgY += (e.clientY - cy);
                s.ctx.drawImage(img, imgX, imgY, w, h);
                timer = null;
                cx = e.clientX;
                cy = e.clientY;
              }, 17)
            }
          }
        };

        // 图片放大
        // 火狐
        s.canvasObj.addEventListener('DOMMouseScroll',function (e) {
          if(e.preventDefault){
            e.preventDefault();
          }else{
            window.event.returnValue == false;
          }
          if (s.mask) { // 出现遮罩层停止操作
            return;
          }
          var delta = 0;
          if (!event) event = window.event;
          if (event.wheelDelta) {
            delta = event.wheelDelta/120;
            if (window.opera) delta = -delta;
          } else if (event.detail) {
            delta = -event.detail/3;
          }
          if (delta > 0) {
            s.ctx.clearRect(0,0, s.canvasObj.width, s.canvasObj.height);
            w += 10;
            h += 10 * img.height / img.width;
            s.ctx.drawImage(img,imgX, imgY, w, h);
          }
          if (delta < 0) {
            s.ctx.clearRect(0,0, s.canvasObj.width, s.canvasObj.height);
            w -= 10;
            h -= 10 * img.height / img.width;
            s.ctx.drawImage(img,imgX, imgY, w, h);
          }
        },false);
        // 其他浏览器
        s.canvasObj.onmousewheel = function (e) {
          if(e.preventDefault){
            e.preventDefault();
          }else{
            window.event.returnValue == false;
          }
          if (s.mask) { // 出现遮罩层停止操作
            return;
          }
          var delta = 0;
          if (!event) event = window.event;
          if (event.wheelDelta) {
            delta = event.wheelDelta/120;
            if (window.opera) delta = -delta;
          } else if (event.detail) {
            delta = -event.detail/3;
          }
          if (delta > 0) {
            s.ctx.clearRect(0,0, s.canvasObj.width, s.canvasObj.height);
            w += 10;
            h += 10 * img.height / img.width;
            s.ctx.drawImage(img,imgX, imgY, w, h);
          }
          if (delta < 0) {
            s.ctx.clearRect(0,0, s.canvasObj.width, s.canvasObj.height);
            w -= 10;
            h -= 10 * img.height / img.width;
            s.ctx.drawImage(img,imgX, imgY, w, h);
          }
        }
      }
      document.onmouseup = function () {
        s.canvasObj.onmousemove = null;
        s.maskObj.onmousemove = null;
      }
      img.src = imgSrc;
    },
    _fileChange (e) {
      let s = this;
      let file =  e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        s.setImgSrc(reader.result)
        reader.onload = null
        s.$refs.file.value = ''
      }
    }
  }
}
</script>
<style>
  .cropper{
    position: relative;
    margin: 0 auto;
    background-image: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAAPAA8BAREA/8QAFwAAAwEAAAAAAAAAAAAAAAAABQcICf/EAB0QAAEDBQEAAAAAAAAAAAAAAAACBAUBFlWU0RL/2gAIAQEAAD8A1CuOJyjLYR0TNuyuKe66+A71Qog//9k=");
  }
  .cropper .mask{
    position: absolute;
    border: 1px solid rgba(79, 72, 65, 0.35);
    top: 0;
    left: 0;
  }
  .cropper .canvas{
    border: 1px solid rgba(79, 72, 65, 0.35);
  }
</style>
