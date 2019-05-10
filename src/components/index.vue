<template>
  <div :id="`cropper${timeId}`">
    <div class="vueShapeImg" :id="`vueShapeImg${timeId}`" :style="{ height: height + 'px', width: width + 'px' }">
      <div class="borderDiv" v-show="mask" v-if="useFrame">
        <div class="center">
          <div class="top" ></div>
          <div class="right" ></div>
          <div class="bottom" ></div>
          <div class="left"></div>
          <div class="topLeft"></div>
          <div class="topRight"></div>
          <div class="bottomLeft"></div>
          <div class="bottomRight"></div>
        </div>
      </div>
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
      vueShapeImgDiv: null,
      x: 0, y: 0, w: 0, h: 0,
      center: null,
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
    },
    useFrame: {
      type: Boolean,
      default: false
    },
    canResizeFrame: {
      type: Boolean,
      default: true
    },
    initRange: {
      type: Array,
      default () {
        let s = this
        return [s.width * 0.25, s.height * 0.25, s.width * 0.5 ,s.height * 0.5]
      }
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
      if (this.useFrame) {
        this.setRange(this.initRange)
      } else {
        this.setRange([0,0,0,0])
      }
      this.mask = true;
    },
    closeMask () {
      this.mask = false;
    },
    setRange (arr = this.initRange) {
      this._drawMask(arr[0], arr[1], arr[2], arr[3])
    },
    getRange () {
      return { x: this.x, y: this.y, w: this.w, h: this.h }
    },
    setImgSrc (imgSrc) {
      this._main(imgSrc)
    },
    fileClick () {
      this.$refs.file.click()
    },
    // type 可以为base64，blob
    getImg (type = 'base64', imgType = 'image/jpeg', encoderOptions = 0.92) {
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
    init () {
      let s = this;
      s.vueShapeImgDiv = document.getElementById('vueShapeImg' + s.timeId)
      if (s.useFrame) {
        s.center = s.vueShapeImgDiv.getElementsByClassName('center')[0]
      }
      s.maskObj = document.getElementById('canvas1' + s.timeId);
      s.maskCtx = s.maskObj.getContext('2d');
      s.canvasObj = document.getElementById('canvas' + s.timeId);
      s.canvasObj.width = s.width;
      s.canvasObj.height = s.height;
      s.maskObj.width = s.width;
      s.maskObj.height = s.height;
      s.ctx = s.canvasObj.getContext('2d');
    },
    _main (imgSrc) {
      const s = this;
      let img = new Image();
      img.crossorigin = '';
      img.onload = function () {
        let h = s.canvasObj.width / img.width * img.height;
        let w = s.canvasObj.width;
        let left = 0;
        let top = (s.canvasObj.height - h) / 2;
        s.ctx.clearRect(0, 0, s.canvasObj.width, s.canvasObj.height);
        s.ctx.drawImage(img, left, top, w, h);
        let imgX = 0, imgY = top;
        // 如果使用的是框架模式
        if (s.useFrame) {
          s.showMask()
          s.center.onmousedown = function(e) {
            // 如果是边框触发，缩放效果
            if (e.target.className !== 'center') {
              s._zoomFrame(e)
              return
            }
            // 中间层触发,拖拽效果
            s.center.onmousemove = null
            let ox = e.offsetX || e.layerX;
            let oy = e.offsetY || e.offsetY;
            let ofx = s.x - ox + (e.offsetX || e.layerX)
            let ofy = s.y - oy + (e.offsetY || e.layerY)
            let timer = null;
            s.center.onmousemove = function (e) {
              if (!timer) {
                timer = setTimeout(function () {
                  ofx = ofx - ox + (e.offsetX || e.layerX)
                  ofy = ofy - oy + (e.offsetY || e.layerY)
                  if (ofx <= 0) ofx = 0
                  if (ofy <= 0) ofy = 0
                  if (ofx >= s.width - s.w) ofx = s.width - s.w
                  if (ofy >= s.height - s.h) ofy = s.height - s.h
                  s._drawMask(ofx, ofy, s.w, s.h)
                  timer = null;
                }, 10)
              }
            };
          }
        } else {
          // 一般模式，绘制框架
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
        }
        // 图片拖拽，2种模式都使用
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
        if (s.useFrame) {
          // 框架模式，遮罩层上移动图片
          s.maskObj.onmousedown = function (e) {
            let timer = null;
            let cx = e.clientX;
            let cy = e.clientY;
            s.vueShapeImgDiv.onmousemove = function (e) {
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
        }
        // 图片放大，2种模式都使用
        let zoom = function (e) {
          if(e.preventDefault){
            e.preventDefault();
          }else{
            window.event.returnValue == false;
          }
          if (s.mask && !s.useFrame) { // 出现遮罩层停止操作
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
        // 火狐
        s.vueShapeImgDiv.addEventListener('DOMMouseScroll',zoom,false);
        // 其他浏览器
        s.vueShapeImgDiv.onmousewheel = zoom
      }
      window.onmouseup = function () {
        s.canvasObj.onmousemove = null;
        s.maskObj.onmousemove = null;
        if (s.useFrame){
          s.center.onmousemove = null;
          s.vueShapeImgDiv.onmousemove = null;
        }
      }
      img.src = imgSrc;
    },
    // 绘制遮罩层
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
      if (!s.useFrame) {
        s.maskCtx.strokeStyle = 'rgba(255,255,255, 0.8)';
        s.maskCtx.strokeRect(x,y,w,h);
      }
      if (s.useFrame) {
        s.center.style.width = w + 'px';
        s.center.style.height = h + 'px';
        s.center.style.left = x + 'px';
        s.center.style.top = y + 'px';
      }
      s.x = x;s.y = y;s.h = h;s.w = w;
      if (s.timelyGetRange) s.$emit('rangeChange', { x: x, y: y, w: w, h: h });
      if (s.timelyImageData) {
        let timer = null;
        if (timer) return;
        timer = setTimeout(function () {
          try{ s.$emit('imageDataChange', s.ctx.getImageData(x, y, w, h)) }catch (e) {}
        }, 50)
      }
    },
    // 框架缩放
    _zoomFrame (e) {
      const s = this
      const CN = e.target.className
      let ox = e.screenX, oy = e.screenY, timer = null,x = 0, y = 0, w = 0, h = 0,px =0, py = 0;
      x = parseInt(s.center.style.left)
      y = parseInt(s.center.style.top)
      w = parseInt(s.center.style.width)
      h = parseInt(s.center.style.height)
      let  rx = x, ry = y, rw = w, rh = h;
      s.vueShapeImgDiv.onmousemove = function (e) {
        if (!timer) {
          px = e.screenX - ox
          py = e.screenY - oy
          if (rx + rw > s.width || ry + rh > s.height) {
            timer = null
            return
          }
          timer = setTimeout(function () {
            switch (CN) {
              case 'top': ry = y + py; rh = h - py; break;
              case 'bottom': rh = h + py; break;
              case 'left': rx = x + px; rw = w - px; break;
              case 'right': rw = w + px; break;
              case 'topLeft': rx = x + px; ry = y + py; rw = w - px; rh = h -py; break;
              case 'topRight': ry = y + py; rw = w + px; rh = h - py; break;
              case 'bottomLeft': rx = x + px; rw = w - px; rh = h + py;  break;
              case 'bottomRight': rw = w + px; rh = h + py;  break;
            }
            if (rx < 0) rx = 0
            if (ry < 0) rx = 0
            s._drawMask(rx, ry, rw, rh)
            timer = null
          }, 17)
        }
      }
      s.vueShapeImgDiv.onmouseup = function () {
        s.vueShapeImgDiv.onmouseup = null
        s.vueShapeImgDiv.onmousemove = null
      }
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
    },
    _Base64toBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
  }
}
</script>
<style lang="less">
  .vueShapeImg{
    position: relative;
    margin: 0 auto;
    background-image: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAAPAA8BAREA/8QAFwAAAwEAAAAAAAAAAAAAAAAABQcICf/EAB0QAAEDBQEAAAAAAAAAAAAAAAACBAUBFlWU0RL/2gAIAQEAAD8A1CuOJyjLYR0TNuyuKe66+A71Qog//9k=");
    .mask{
      position: absolute;
      border: 1px solid rgba(79, 72, 65, 0.35);
      top: 0;
      left: 0;
    }
    .canvas{
      border: 1px solid rgba(79, 72, 65, 0.35);
    }
    .borderDiv{
      z-index: 500;
      .center{
        position: absolute;
        z-index: 500;
        cursor: move;
        background-color: rgba(0,0,0,0);
      }
      .top, .left, .right, .bottom{
        z-index: 501;
        display: block;
        position: absolute;
        background: rgba(48, 135, 255, 0.64);
      }
      .top, .bottom{
        height: 3px;
        width: 100%;
        cursor: n-resize;
      }
      .bottom{
        bottom: -2px;
      }
      .left, .right{
        cursor: w-resize;
        height: 100%;
        width: 3px;
      }
      .right{
        right: -2px;
      }
      .topLeft, .topRight,.bottomLeft,.bottomRight{
        z-index: 502;
        display: block;
        position: absolute;
        width: 10px;
        height: 10px;
      }
      .topLeft{
        top: 0;
        left: 0;
        cursor: se-resize;
      }
      .topRight{
        top: 0;
        right: 0;
        cursor: ne-resize;
      }
      .bottomLeft{
        bottom: 0;
        left: 0;
        cursor: ne-resize;
      }
      .bottomRight{
        bottom: 0;
        right: 0;
        cursor: se-resize;
      }
    }
  }
</style>
