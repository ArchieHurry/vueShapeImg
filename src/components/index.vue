<template>
  <div :id="`cropper${timeId}`">
    <div class="vueShapeImg" :id="`vueShapeImg${timeId}`" :style="{ height: height + 'px', width: width + 'px' }">
      <div  v-show="mask" v-if="useFrame" class="center">
        <div class="top" ></div>
        <div class="right" ></div>
        <div class="bottom" ></div>
        <div class="left"></div>
        <div class="topLeft"></div>
        <div class="topRight"></div>
        <div class="bottomLeft"></div>
        <div class="bottomRight"></div>
      </div>
      <canvas v-if="canvasIf" :id="`canvas${timeId}`" class="canvas"></canvas>
      <canvas :id="`canvas1${timeId}`" class="mask" v-show="mask"></canvas>
      <input type="file" ref="file" @change="_fileChange" v-show="false">
    </div>
  </div>
</template>

<script>
export default {
  name: "cropper",
  data () {
    return {
      perPI: Math.PI / 180,
      crossOriginError: 0,
      deg: 0,
      canvasIf: true,
      timeId: "",
      ctx: null,
      canvasObj: null,
      maskObj: null,
      mask: false,
      maskCtx: null,
      vueShapeImgDiv: null,
      x: 0, y: 0, w: 0, h: 0,
      center: null,
      zoom: {
        img: null,
        x: 0, y: 0, w: 0, h: 0
      }
    };
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
        const s = this;
        return [s.width * 0.25, s.height * 0.25, s.width * 0.5 ,s.height * 0.5];
      }
    },
    aspectRatio: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.timeId = new Date().valueOf();
  },
  mounted () {
    this.init();
  },
  methods: {
    rotate (deg = 45) {
      const s = this;
      deg = deg % 360;
      if (deg === 0 || !s.zoom.img) {
        return;
      }
      s.deg += deg;
      if (s.deg < 0) {
        s.deg = 360 + s.deg;
      }
      if (s.deg > 360) {
        s.deg = s.deg - 360;
      }
      s.ctx.clearRect(-(s.width * 5),-(s.height * 5),s.width * 10,s.height * 10);
      s.ctx.translate(s.zoom.x + s.zoom.w / 2,s.zoom.y + s.zoom.h / 2);
      if (s.deg) {
        s.ctx.rotate(deg * Math.PI/180);
      }
      s.ctx.drawImage(s.zoom.img, -s.zoom.w/2, -s.zoom.h/2, s.zoom.w, s.zoom.h);
      s.ctx.translate(-(s.zoom.x + s.zoom.w / 2),-(s.zoom.y + s.zoom.h / 2));
      s._drawMask(s.x,s.y,s.w,s.h);
    },
    showMask () {
      const s = this;
      if (s.useFrame) {
        s.setRange(s.initRange);
      }
      else {
        s.setRange([0,0,0,0]);
      }
      s.mask = true;
    },
    closeMask () {
      this.mask = false;
    },
    setRange (arr = this.initRange) {
      const s = this;
      if (arr[2] < 0){ arr[0] = arr[0] + arr[2]; arr[2] = -arr[2]; }
      if (arr[3] < 0) { arr[1] = arr[1] + arr[3]; arr[3] = -arr[3]; }
      if (arr[0] < 0) { arr[0] = 0; }
      if (arr[1] < 0) { arr[1] = 0; }
      if (arr[0] + arr[2] > s.width) { arr[2] = s.width - arr[0]; }
      if (arr[1] + arr[3] > s.height) { arr[3] = s.height - arr[1]; }
      s._drawMask(arr[0], arr[1], arr[2], arr[3]);
    },
    getRange () {
      const s = this;
      return { x: s.x, y: s.y, w: s.w, h: s.h };
    },
    setImgSrc (imgSrc) {
      const s = this;
      let imgLoad = function () {
        let img = new Image();
        s.zoom.img = img;
        img.crossorigin = "";
        img.src = imgSrc;
        img.onload = function () {
          s._main(img);
        };
        img.onerror = function () {
          s.$emit("error", { code: -2, message: "Picture loading failed"});
        };
      };
      s.canvasIf = false;
      s.deg = 0;
      setTimeout(function () { // edge, ie 下需要延迟销毁元素;每次新图片重置画布
        s.canvasIf = true;
        s.$nextTick(function () { s.init(); imgLoad(); });
      });
      s.crossOriginError = 0;
    },
    fileClick () {
      this.$refs.file.click();
    },
    // type 可以为base64，blob
    getImg (type = "base64", imgType = "image/jpeg", encoderOptions = 0.92) {
      const s = this;
      let imgData = s.ctx.getImageData(s.x, s.y, s.w, s.h);
      s.closeMask();
      s.maskObj.width = s.w;
      s.maskObj.height = s.h;
      s.maskCtx.clearRect(0, 0, s.maskObj.width, s.maskObj.height);
      s.maskCtx.putImageData(imgData, 0, 0);
      let res = s.maskObj.toDataURL(imgType, encoderOptions);
      if (type === "blob") {
        res = s._Base64toBlob(res);
      }
      s.maskObj.width = s.width;
      s.maskObj.height = s.height;
      return res;
    },
    init () {
      const s = this;
      s.vueShapeImgDiv = document.getElementById("vueShapeImg" + s.timeId);
      if (s.useFrame) {
        s.center = s.vueShapeImgDiv.getElementsByClassName("center")[0];
      }
      s.maskObj = document.getElementById("canvas1" + s.timeId);
      s.maskCtx = s.maskObj.getContext("2d");
      s.canvasObj = document.getElementById("canvas" + s.timeId);
      s.canvasObj.width = s.width;
      s.canvasObj.height = s.height;
      s.maskObj.width = s.width;
      s.maskObj.height = s.height;
      s.ctx = s.canvasObj.getContext("2d");
    },
    _main (img) {
      const s = this;
      let h = s.canvasObj.width / img.width * img.height,w = s.canvasObj.width,left = 0, top = (s.canvasObj.height - h) / 2,imgX = 0, imgY = top;
      const w5 = s.width * 5, w10 = s.width * 10, h5 = s.height * 5, h10 = s.height * 10;
      s.zoom.x = left;s.zoom.y = top;s.zoom.w = w; s.zoom.h = h;
      s.ctx.clearRect(-w5,-h5,w10,h10);
      s.ctx.drawImage(img, left, top, w, h);
      // 如果使用的是框架模式
      if (s.useFrame) {
        s.showMask();
        s.center.onmousedown = function(e) {
          // 如果是边框触发，缩放效果
          if (e.target.className !== "center") {
            s._zoomFrame(e);
            return;
          }
          // 中间层触发,拖拽效果
          let ox = e.offsetX || e.layerX;
          let oy = e.offsetY || e.offsetY;
          let ofx = s.x - ox + (e.offsetX || e.layerX);
          let ofy = s.y - oy + (e.offsetY || e.layerY);
          let timer = null;
          s.center.onmousemove = function (e) {
            if (!timer) {
              timer = setTimeout(function () {
                ofx = ofx - ox + (e.offsetX || e.layerX);
                ofy = ofy - oy + (e.offsetY || e.layerY);
                if (ofx <= 0) {
                  ofx = 0;
                }
                if (ofy <= 0) {
                  ofy = 0;
                }
                if (ofx >= s.width - s.w) {
                  ofx = s.width - s.w;
                }
                if (ofy >= s.height - s.h) {
                  ofy = s.height - s.h;
                }
                s._drawMask(ofx, ofy, s.w, s.h);
                timer = null;
              }, 10);
            }
          };
        };
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
                  s._drawMask(ox, oy, (e.offsetX || e.layerX) - ox, (e.offsetY || e.layerY) - oy);
                  timer = null;
                }, 17);
              }
            };
          }
        };
      }
      // 图片拖拽，2种模式都使用
      s.canvasObj.onmousedown = function (e) {
        let timer = null, cx = e.screenX,cy = e.screenY,lx = 0,ly = 0;
        s.canvasObj.onmousemove = function (e) {
          if (!timer) {
            timer = setTimeout(function () {
              s.ctx.clearRect(-w5,-h5,w10,h10);
              lx = e.screenX - cx;
              ly = e.screenY - cy;
              imgX += Math.cos(s.deg * s.perPI) * lx + Math.sin(s.deg * s.perPI) * ly;
              imgY += Math.cos(s.deg * s.perPI) * ly + Math.sin(-s.deg * s.perPI) * lx;
              s.ctx.drawImage(img, imgX, imgY, w, h);
              s.zoom.x = imgX;s.zoom.y = imgY;
              timer = null;
              cx = e.screenX;
              cy = e.screenY;
            }, 17);
          }
        };
      };
      if (s.useFrame) { // 框架模式，遮罩层上移动图片
        s.center.ondragstart = function() { // 解决裁剪框缩放时存在拖拽的问题
          return false;
        };
        s.maskObj.onmousedown = function (e) {
          let timer = null,cx = e.screenX,cy = e.screenY, lx = 0, ly = 0;
          s.vueShapeImgDiv.onmousemove = function (e) {
            if (!timer) {
              timer = setTimeout(function () {
                s.ctx.clearRect(-w5,-h5,w10,h10);
                lx = e.screenX - cx;
                ly = e.screenY - cy;
                imgX += Math.cos(s.deg * s.perPI) * lx + Math.sin(s.deg * s.perPI) * ly;
                imgY += Math.cos(s.deg * s.perPI) * ly + Math.sin(-s.deg * s.perPI) * lx;
                s.ctx.drawImage(img, imgX, imgY, w, h);
                s._drawMask(s.x,s.y,s.w,s.h);
                s.zoom.x = imgX;s.zoom.y = imgY;
                timer = null;
                cx = e.screenX;
                cy = e.screenY;
              }, 17);
            }
          };
        };
      }
      // 图片放大，2种模式都使用
      let zoom = function (e) {
        if(e.preventDefault) {
          e.preventDefault();
        } else {
          window.event.returnValue = false;
        }
        if (s.mask && !s.useFrame) {
          return; // 出现遮罩层停止操作
        }
        let delta = 0;
        if (!e) { e = window.event; }
        if (e.wheelDelta) {
          delta = e.wheelDelta / 120;
          if (window.opera) {
            delta = -delta;
          }
        } else if (e.detail) {
          delta = -e.detail / 3;
        }
        s.ctx.clearRect(-w5,-h5,w10,h10);
        let op = delta > 0 ? 1 : -1;
        w +=  10 * op;
        h += 10 * img.height / img.width * op;
        s.ctx.drawImage(img,imgX, imgY, w, h);
        s.zoom.x = imgX;s.zoom.y = imgY;s.zoom.w = w; s.zoom.h = h;
        s._drawMask(s.x,s.y,s.w,s.h);
      };
      if ("onmousewheel" in document) {
        s.vueShapeImgDiv.onmousewheel = zoom;  // 其他浏览器
      }
      else {
        s.vueShapeImgDiv.addEventListener("DOMMouseScroll",zoom,false);  // 火狐
      }
      s.maskObj.ondragstart = function() { // 解决ie useFrame移动图片时在裁剪框上出触发mouseup,再次移动拖会出现拖拽遮罩层的问题
        return false;
      };
      window.addEventListener("mouseup", function () { // 修复在同一页面中使用多个vueShapeImg导致onmouseup污染，裁剪框一直存在的问题
        s.canvasObj.onmousemove = null;
        s.maskObj.onmousemove = null;
        if (s.useFrame){
          s.center.onmousemove = null;
          s.vueShapeImgDiv.onmousemove = null;
        }
      }, false);
    },
    _oneOf (arr, el) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === el) {
          return true;
        }
      }
      return  false;
    },
    // 绘制遮罩层
    _drawMask (x, y, w, h) {
      const s = this;
      s.maskCtx.clearRect(0, 0, s.maskObj.width, s.maskObj.height);
      s.maskCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
      if (w < 0) {
        x = x + w;
        w = -w;
      }
      if (h < 0) {
        y = y + h;
        h = -h;
      }
      s.maskCtx.fillRect(0,0,s.canvasObj.width, y);
      s.maskCtx.fillRect(0,y,x, s.canvasObj.height - y);
      s.maskCtx.fillRect(x + w, y, s.canvasObj.width -x - w, s.canvasObj.height - y);
      s.maskCtx.fillRect(x, y + h, w, s.canvasObj.height - h - y);
      if (!s.useFrame) {
        s.maskCtx.strokeStyle = "rgba(255,255,255, 0.8)";
        s.maskCtx.strokeRect(x,y,w,h);
      }
      if (s.useFrame) {
        s.center.style.width = w + "px";
        s.center.style.height = h + "px";
        s.center.style.left = x + "px";
        s.center.style.top = y + "px";
      }
      s.x = x;s.y = y;s.h = h;s.w = w;
      if (s.timelyGetRange) {
        s.$emit("rangeChange", { x, y, w, h });
      }
      if (s.timelyImageData && !s.crossOriginError) {
        let timer = null;
        if (!timer) {
          timer = setTimeout(function () {
            try{ s.$emit("imageDataChange", s.ctx.getImageData(x, y, w, h)); } catch (e) {
              if (w === 0 || h === 0) {
                return;
              }
              s.$emit("error", {code: -3, message: "getImageData failed, it is cross-origin data"});
              s.crossOriginError = 1;
            }
          }, 17); // 修复普通模式下使用跨域图片多次触发-3报错问题
        }
      }
    },
    // 框架缩放
    _zoomFrame (e) {
      const s = this;
      const CN = e.target.className;
      let ox = e.screenX, oy = e.screenY, timer = null,x = 0, y = 0, w = 0, h = 0,px =0, py = 0;
      x = parseInt(s.center.style.left);
      y = parseInt(s.center.style.top);
      w = parseInt(s.center.style.width);
      h = parseInt(s.center.style.height);
      let  rx = x, ry = y, rw = w, rh = h;
      const aspect = w / h;
      s.vueShapeImgDiv.onmousemove = function (e) {
        if (!timer) {
          px = e.screenX - ox;
          py = e.screenY - oy;
          if (s.aspectRatio) {
            if (s._oneOf(['bottomRight', 'bottom', 'top', 'topRight'], CN)) {
               px = aspect * py;
            }
            if (s._oneOf(['right', 'left', 'bottomLeft', 'topLeft'], CN)) {
              py = px / aspect;
            }
          }
          if (rx + rw > s.width || ry + rh > s.height) {
            timer = null;
            return;
          }
          timer = setTimeout(function () {
            switch (CN) {
              case "top": ry = y + py; rh = h - py; break;
              case "bottom": rh = h + py; break;
              case "left": rx = x + px; rw = w - px; break;
              case "right": rw = w + px; break;
              case "topLeft": rx = x + px; ry = y + py; rw = w - px; rh = h -py; break;
              case "topRight": ry = y + py; rw = w + px; rh = h - py; break;
              case "bottomLeft": rx = x + px; rw = w - px; rh = h + py;  break;
              case "bottomRight": rw = w + px; rh = h + py;  break;
            }
            if (rx < 0) {
              rx = 0;
            }
            if (ry < 0) {
              rx = 0;
            }
            s._drawMask(rx, ry, rw, rh);
            timer = null;
          }, 17);
        }
      };
    },
    _fileChange (e) {
      const s = this;
      let file =  e.target || e.srcElement;
      file =  file.files[0] || {}; // edge file对象获取延迟报错修正
      if ("image/png,image/jpeg".indexOf(file.type) === -1) {
        s.$emit("error", { code: -1, message: "Picture format is not supported" });
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        s.setImgSrc(reader.result);
        reader.onload = null;
        s.$refs.file.value = "";
      };
    },
    _Base64toBlob(dataurl) {
      let arr = dataurl.split(","), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
  }
};
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
      z-index: 10;
    }
    .canvas{
      border: 1px solid rgba(79, 72, 65, 0.35);
    }
    .center{
      position: absolute;
      z-index: 510;
      cursor: move;
      background-color: rgba(0,0,0,0.01); // 解决ie10以下完全透明z-index会不起作用，div完全沉下去的问题
      .top, .left, .right, .bottom{
        z-index: 520;
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
        z-index: 530;
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
