!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("vueShapeImg",[],t):"object"==typeof exports?exports.vueShapeImg=t():e.vueShapeImg=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(a){if(n[a])return n[a].exports;var o=n[a]={i:a,l:!1,exports:{}};return e[a].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,a){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:a})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/dist/",t(t.s=1)}([function(e,t,n){"use strict";t.a={name:"cropper",data:function(){return{perPI:Math.PI/180,crossOriginError:0,deg:0,canvasIf:!0,timeId:"",ctx:null,canvasObj:null,maskObj:null,mask:!1,maskCtx:null,vueShapeImgDiv:null,x:0,y:0,w:0,h:0,center:null,zoom:{img:null,x:0,y:0,w:0,h:0}}},props:{height:{type:Number,default:500},width:{type:Number,default:500},timelyGetRange:{type:Boolean,default:!1},timelyImageData:{type:Boolean,default:!1},useFrame:{type:Boolean,default:!1},canResizeFrame:{type:Boolean,default:!0},initRange:{type:Array,default:function(){var e=this;return[.25*e.width,.25*e.height,.5*e.width,.5*e.height]}}},created:function(){this.timeId=(new Date).valueOf()},mounted:function(){this.init()},methods:{rotate:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:45,t=this;0!==(e%=360)&&t.zoom.img&&(t.deg+=e,t.deg<0&&(t.deg=360+t.deg),t.deg>360&&(t.deg=t.deg-360),t.ctx.clearRect(-5*t.width,-5*t.height,10*t.width,10*t.height),t.ctx.translate(t.zoom.x+t.zoom.w/2,t.zoom.y+t.zoom.h/2),t.deg&&t.ctx.rotate(e*Math.PI/180),t.ctx.drawImage(t.zoom.img,-t.zoom.w/2,-t.zoom.h/2,t.zoom.w,t.zoom.h),t.ctx.translate(-(t.zoom.x+t.zoom.w/2),-(t.zoom.y+t.zoom.h/2)),t._drawMask(t.x,t.y,t.w,t.h))},showMask:function(){this.useFrame?this.setRange(this.initRange):this.setRange([0,0,0,0]),this.mask=!0},closeMask:function(){this.mask=!1},setRange:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.initRange;e[2]<0&&(e[0]=e[0]+e[2],e[2]=-e[2]),e[3]<0&&(e[1]=e[1]+e[3],e[3]=-e[3]),e[0]<0&&(e[0]=0),e[1]<0&&(e[1]=0),e[0]+e[2]>this.width&&(e[2]=this.width-e[0]),e[1]+e[3]>this.height&&(e[3]=this.height-e[1]),this._drawMask(e[0],e[1],e[2],e[3])},getRange:function(){return{x:this.x,y:this.y,w:this.w,h:this.h}},setImgSrc:function(e){var t=this,n=function(){var n=new Image;t.zoom.img=n,n.crossorigin="",n.src=e,n.onload=function(){t._main(n)},n.onerror=function(e){t.$emit("error",{code:-2,message:"Picture loading failed"})}};t.canvasIf=!1,t.deg=0,setTimeout(function(){t.canvasIf=!0,t.$nextTick(function(){t.init(),n()})}),t.crossOriginError=0},fileClick:function(){this.$refs.file.click()},getImg:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"base64",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"image/jpeg",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.92,a=this,o=a.ctx.getImageData(a.x,a.y,a.w,a.h);a.closeMask(),a.maskObj.width=a.w,a.maskObj.height=a.h,a.maskCtx.clearRect(0,0,a.maskObj.width,a.maskObj.height),a.maskCtx.putImageData(o,0,0);var r=a.maskObj.toDataURL(t,n);return"blob"===e&&(r=a._Base64toBlob(r)),a.maskObj.width=a.width,a.maskObj.height=a.height,r},init:function(){var e=this;e.vueShapeImgDiv=document.getElementById("vueShapeImg"+e.timeId),e.useFrame&&(e.center=e.vueShapeImgDiv.getElementsByClassName("center")[0]),e.maskObj=document.getElementById("canvas1"+e.timeId),e.maskCtx=e.maskObj.getContext("2d"),e.canvasObj=document.getElementById("canvas"+e.timeId),e.canvasObj.width=e.width,e.canvasObj.height=e.height,e.maskObj.width=e.width,e.maskObj.height=e.height,e.ctx=e.canvasObj.getContext("2d")},_main:function(e){var t=this,n=t.canvasObj.width/e.width*e.height,a=t.canvasObj.width,o=(t.canvasObj.height-n)/2,r=0,i=o,s=5*t.width,c=10*t.width,u=5*t.height,h=10*t.height;t.zoom.x=0,t.zoom.y=o,t.zoom.w=a,t.zoom.h=n,t.ctx.clearRect(-s,-u,c,h),t.ctx.drawImage(e,0,o,a,n),t.useFrame?(t.showMask(),t.center.onmousedown=function(e){if("center"!==e.target.className)return void t._zoomFrame(e);t.center.onmousemove=null;var n=e.offsetX||e.layerX,a=e.offsetY||e.offsetY,o=t.x-n+(e.offsetX||e.layerX),r=t.y-a+(e.offsetY||e.layerY),i=null;t.center.onmousemove=function(e){i||(i=setTimeout(function(){o=o-n+(e.offsetX||e.layerX),r=r-a+(e.offsetY||e.layerY),o<=0&&(o=0),r<=0&&(r=0),o>=t.width-t.w&&(o=t.width-t.w),r>=t.height-t.h&&(r=t.height-t.h),t._drawMask(o,r,t.w,t.h),i=null},10))}}):t.maskObj.onmousedown=function(e){var n=null;if(t.mask){var a=e.offsetX||e.layerX,o=e.offsetY||e.offsetY;t.maskObj.onmousemove=function(e){n||(n=setTimeout(function(){t._drawMask(a,o,(e.offsetX||e.layerX)-a,(e.offsetY||e.layerY)-o),n=null},17))}}},t.canvasObj.onmousedown=function(o){var l=null,m=o.screenX,d=o.screenY,f=0,g=0;t.canvasObj.onmousemove=function(o){l||(l=setTimeout(function(){t.ctx.clearRect(-s,-u,c,h),f=o.screenX-m,g=o.screenY-d,r+=Math.cos(t.deg*t.perPI)*f+Math.sin(t.deg*t.perPI)*g,i+=Math.cos(t.deg*t.perPI)*g+Math.sin(-t.deg*t.perPI)*f,t.ctx.drawImage(e,r,i,a,n),t.zoom.x=r,t.zoom.y=i,l=null,m=o.screenX,d=o.screenY},17))}},t.useFrame&&(t.maskObj.onmousedown=function(o){var l=null,m=o.screenX,d=o.screenY,f=0,g=0;t.vueShapeImgDiv.onmousemove=function(o){l||(l=setTimeout(function(){t.ctx.clearRect(-s,-u,c,h),f=o.screenX-m,g=o.screenY-d,r+=Math.cos(t.deg*t.perPI)*f+Math.sin(t.deg*t.perPI)*g,i+=Math.cos(t.deg*t.perPI)*g+Math.sin(-t.deg*t.perPI)*f,t.ctx.drawImage(e,r,i,a,n),t._drawMask(t.x,t.y,t.w,t.h),t.zoom.x=r,t.zoom.y=i,l=null,m=o.screenX,d=o.screenY},17))}});var l=function(o){if(o.preventDefault?o.preventDefault():window.event.returnValue=!1,!t.mask||t.useFrame){var l=0;o||(o=window.event),o.wheelDelta?(l=o.wheelDelta/120,window.opera&&(l=-l)):o.detail&&(l=-o.detail/3),t.ctx.clearRect(-s,-u,c,h);var m=l>0?1:-1;a+=10*m,n+=10*e.height/e.width*m,t.ctx.drawImage(e,r,i,a,n),t.zoom.x=r,t.zoom.y=i,t.zoom.w=a,t.zoom.h=n,t._drawMask(t.x,t.y,t.w,t.h)}};"onmousewheel"in document?t.vueShapeImgDiv.onmousewheel=l:t.vueShapeImgDiv.addEventListener("DOMMouseScroll",l,!1),window.addEventListener("mouseup",function(){t.canvasObj.onmousemove=null,t.maskObj.onmousemove=null,t.useFrame&&(t.center.onmousemove=null,t.vueShapeImgDiv.onmousemove=null)},!1)},_drawMask:function(e,t,n,a){var o=this;if(o.maskCtx.clearRect(0,0,o.maskObj.width,o.maskObj.height),o.maskCtx.fillStyle="rgba(0, 0, 0, 0.5)",n<0&&(e+=n,n=-n),a<0&&(t+=a,a=-a),o.maskCtx.fillRect(0,0,o.canvasObj.width,t),o.maskCtx.fillRect(0,t,e,o.canvasObj.height-t),o.maskCtx.fillRect(e+n,t,o.canvasObj.width-e-n,o.canvasObj.height-t),o.maskCtx.fillRect(e,t+a,n,o.canvasObj.height-a-t),o.useFrame||(o.maskCtx.strokeStyle="rgba(255,255,255, 0.8)",o.maskCtx.strokeRect(e,t,n,a)),o.useFrame&&(o.center.style.width=n+"px",o.center.style.height=a+"px",o.center.style.left=e+"px",o.center.style.top=t+"px"),o.x=e,o.y=t,o.h=a,o.w=n,o.timelyGetRange&&o.$emit("rangeChange",{x:e,y:t,w:n,h:a}),o.timelyImageData&&!o.crossOriginError){var r=null;r||(r=setTimeout(function(){try{o.$emit("imageDataChange",o.ctx.getImageData(e,t,n,a))}catch(e){if(0===n||0===a)return;o.$emit("error",{code:-3,message:"getImageData failed, it is cross-origin data"}),o.crossOriginError=1}},17))}},_zoomFrame:function(e){var t=this,n=e.target.className,a=e.screenX,o=e.screenY,r=null,i=0,s=0,c=0,u=0,h=0,l=0;i=parseInt(t.center.style.left),s=parseInt(t.center.style.top),c=parseInt(t.center.style.width),u=parseInt(t.center.style.height);var m=i,d=s,f=c,g=u;t.vueShapeImgDiv.onmousemove=function(e){if(!r){if(h=e.screenX-a,l=e.screenY-o,m+f>t.width||d+g>t.height)return void(r=null);r=setTimeout(function(){switch(n){case"top":d=s+l,g=u-l;break;case"bottom":g=u+l;break;case"left":m=i+h,f=c-h;break;case"right":f=c+h;break;case"topLeft":m=i+h,d=s+l,f=c-h,g=u-l;break;case"topRight":d=s+l,f=c+h,g=u-l;break;case"bottomLeft":m=i+h,f=c-h,g=u+l;break;case"bottomRight":f=c+h,g=u+l}m<0&&(m=0),d<0&&(m=0),t._drawMask(m,d,f,g),r=null},17)}}},_fileChange:function(e){var t=this,n=e.target||e.srcElement;if(n=n.files[0]||{},-1==="image/png,image/jpeg".indexOf(n.type))return void t.$emit("error",{code:-1,message:"Picture format is not supported"});var a=new FileReader;a.readAsDataURL(n),a.onload=function(){t.setImgSrc(a.result),a.onload=null,t.$refs.file.value=""}},_Base64toBlob:function(e){for(var t=e.split(","),n=t[0].match(/:(.*?);/)[1],a=atob(t[1]),o=a.length,r=new Uint8Array(o);o--;)r[o]=a.charCodeAt(o);return new Blob([r],{type:n})}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),o={install:function(e,t){e.component("vueShapeImg",a.a)}};"undefined"!=typeof window&&window.Vue&&window.Vue.use(a.a),t.default=o},function(e,t,n){"use strict";function a(e){n(3)}var o=n(0),r=n(9),i=n(8),s=a,c=i(o.a,r.a,!1,s,null,null);t.a=c.exports},function(e,t,n){var a=n(4);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);n(6)("61812da4",a,!0,{})},function(e,t,n){t=e.exports=n(5)(!1),t.push([e.i,'.vueShapeImg{position:relative;margin:0 auto;background-image:url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAAPAA8BAREA/8QAFwAAAwEAAAAAAAAAAAAAAAAABQcICf/EAB0QAAEDBQEAAAAAAAAAAAAAAAACBAUBFlWU0RL/2gAIAQEAAD8A1CuOJyjLYR0TNuyuKe66+A71Qog//9k=")}.vueShapeImg .mask{position:absolute;top:0;left:0;z-index:10}.vueShapeImg .canvas,.vueShapeImg .mask{border:1px solid rgba(79,72,65,.35)}.vueShapeImg .center{position:absolute;z-index:510;cursor:move;background-color:rgba(0,0,0,.01)}.vueShapeImg .center .bottom,.vueShapeImg .center .left,.vueShapeImg .center .right,.vueShapeImg .center .top{z-index:520;position:absolute;background:rgba(48,135,255,.64)}.vueShapeImg .center .bottom,.vueShapeImg .center .top{height:3px;width:100%;cursor:n-resize}.vueShapeImg .center .bottom{bottom:-2px}.vueShapeImg .center .left,.vueShapeImg .center .right{cursor:w-resize;height:100%;width:3px}.vueShapeImg .center .right{right:-2px}.vueShapeImg .center .bottomLeft,.vueShapeImg .center .bottomRight,.vueShapeImg .center .topLeft,.vueShapeImg .center .topRight{z-index:530;position:absolute;width:10px;height:10px}.vueShapeImg .center .topLeft{top:0;left:0;cursor:se-resize}.vueShapeImg .center .topRight{top:0;right:0;cursor:ne-resize}.vueShapeImg .center .bottomLeft{bottom:0;left:0;cursor:ne-resize}.vueShapeImg .center .bottomRight{bottom:0;right:0;cursor:se-resize}',""])},function(e,t){function n(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var r=a(o);return[n].concat(o.sources.map(function(e){return"/*# sourceURL="+o.sourceRoot+e+" */"})).concat([r]).join("\n")}return[n].join("\n")}function a(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var a=n(t,e);return t[2]?"@media "+t[2]+"{"+a+"}":a}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var a={},o=0;o<this.length;o++){var r=this[o][0];"number"==typeof r&&(a[r]=!0)}for(o=0;o<e.length;o++){var i=e[o];"number"==typeof i[0]&&a[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),t.push(i))}},t}},function(e,t,n){function a(e){for(var t=0;t<e.length;t++){var n=e[t],a=h[n.id];if(a){a.refs++;for(var o=0;o<a.parts.length;o++)a.parts[o](n.parts[o]);for(;o<n.parts.length;o++)a.parts.push(r(n.parts[o]));a.parts.length>n.parts.length&&(a.parts.length=n.parts.length)}else{for(var i=[],o=0;o<n.parts.length;o++)i.push(r(n.parts[o]));h[n.id]={id:n.id,refs:1,parts:i}}}}function o(){var e=document.createElement("style");return e.type="text/css",l.appendChild(e),e}function r(e){var t,n,a=document.querySelector("style["+v+'~="'+e.id+'"]');if(a){if(f)return g;a.parentNode.removeChild(a)}if(w){var r=d++;a=m||(m=o()),t=i.bind(null,a,r,!1),n=i.bind(null,a,r,!0)}else a=o(),t=s.bind(null,a),n=function(){a.parentNode.removeChild(a)};return t(e),function(a){if(a){if(a.css===e.css&&a.media===e.media&&a.sourceMap===e.sourceMap)return;t(e=a)}else n()}}function i(e,t,n,a){var o=n?"":a.css;if(e.styleSheet)e.styleSheet.cssText=b(t,o);else{var r=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(r,i[t]):e.appendChild(r)}}function s(e,t){var n=t.css,a=t.media,o=t.sourceMap;if(a&&e.setAttribute("media",a),p.ssrId&&e.setAttribute(v,t.id),o&&(n+="\n/*# sourceURL="+o.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}var c="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!c)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var u=n(7),h={},l=c&&(document.head||document.getElementsByTagName("head")[0]),m=null,d=0,f=!1,g=function(){},p=null,v="data-vue-ssr-id",w="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());e.exports=function(e,t,n,o){f=n,p=o||{};var r=u(e,t);return a(r),function(t){for(var n=[],o=0;o<r.length;o++){var i=r[o],s=h[i.id];s.refs--,n.push(s)}t?(r=u(e,t),a(r)):r=[];for(var o=0;o<n.length;o++){var s=n[o];if(0===s.refs){for(var c=0;c<s.parts.length;c++)s.parts[c]();delete h[s.id]}}}};var b=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},function(e,t){e.exports=function(e,t){for(var n=[],a={},o=0;o<t.length;o++){var r=t[o],i=r[0],s=r[1],c=r[2],u=r[3],h={id:e+":"+o,css:s,media:c,sourceMap:u};a[i]?a[i].parts.push(h):n.push(a[i]={id:i,parts:[h]})}return n}},function(e,t){e.exports=function(e,t,n,a,o,r){var i,s=e=e||{},c=typeof e.default;"object"!==c&&"function"!==c||(i=e,s=e.default);var u="function"==typeof s?s.options:s;t&&(u.render=t.render,u.staticRenderFns=t.staticRenderFns,u._compiled=!0),n&&(u.functional=!0),o&&(u._scopeId=o);var h;if(r?(h=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),a&&a.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(r)},u._ssrRegister=h):a&&(h=a),h){var l=u.functional,m=l?u.render:u.beforeCreate;l?(u._injectStyles=h,u.render=function(e,t){return h.call(t),m(e,t)}):u.beforeCreate=m?[].concat(m,h):[h]}return{esModule:i,exports:s,options:u}}},function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"cropper"+e.timeId}},[n("div",{staticClass:"vueShapeImg",style:{height:e.height+"px",width:e.width+"px"},attrs:{id:"vueShapeImg"+e.timeId}},[e.useFrame?n("div",{directives:[{name:"show",rawName:"v-show",value:e.mask,expression:"mask"}],staticClass:"center"},[n("div",{staticClass:"top"}),e._v(" "),n("div",{staticClass:"right"}),e._v(" "),n("div",{staticClass:"bottom"}),e._v(" "),n("div",{staticClass:"left"}),e._v(" "),n("div",{staticClass:"topLeft"}),e._v(" "),n("div",{staticClass:"topRight"}),e._v(" "),n("div",{staticClass:"bottomLeft"}),e._v(" "),n("div",{staticClass:"bottomRight"})]):e._e(),e._v(" "),e.canvasIf?n("canvas",{staticClass:"canvas",attrs:{id:"canvas"+e.timeId}}):e._e(),e._v(" "),n("canvas",{directives:[{name:"show",rawName:"v-show",value:e.mask,expression:"mask"}],staticClass:"mask",attrs:{id:"canvas1"+e.timeId}}),e._v(" "),n("input",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],ref:"file",attrs:{type:"file"},on:{change:e._fileChange}})])])},o=[],r={render:a,staticRenderFns:o};t.a=r}])});