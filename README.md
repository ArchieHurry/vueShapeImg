# vueShapeImg

[github](https://github.com/ArchieHurry/vueShapeImg)

![Demonstration](http://www.bqmyweb.cn/vueshapeimg/vueShapeImg1-1-9.gif)

## <a name="english">English</a> <a href="#中文文档">中文文档</a>

> An image resizer made by vue

## [OnlineDemo](http://www.bqmyweb.cn/vueshapeimg/)  

### How to use

``` bash
import vueShapeImg from 'vueshapeimg'
Vue.use(vueShapeImg)

<vue-shape-img></vue-shape-img>

```

### vueShapeImg API Doc
#### props
| Parameters | Description | Type | Optional values | Default value |
|---------- |-------- |---------- |---------- |---------- |
|height |- |Number |Y |500 |
|width |- |Number |Y |500 |
|timelyGetRange |Timely get user's select range |Boolean |Y |false |
|timelyImageData |Timely converting pictures that capture the user's range of choice into imageData |Boolean |Y |false |
##### tips: You can't use imageData directly,show it in canvas putImageData 

#### methods
| Method name | Description | Parameters |
|---------- |-------- |---------- |
|setImgSrc|Use network picture. Pictures with different domain names are best not to be used |imgSrc|
|fileClick|Use local picture|-|
|showMask|Open the mask layer, select the area|-| 
|closeMask|Close the mask layer|-|
|getRange|Get the scope of user selection|-|
|getImg|Get pictures of the range selected by the user|type('base64'/'blob'), imgType('image/png' Or other image types),encoderOptions(0.00 - 1.00) |
#### emit
| emit name | Description
|---------- |-------- |
|imageDataChange|if props timelyImageData is true, this emit can return the imageData in timely|
|rangeChange|if props timelyGetRange is true, this emit can return the range in timely|
##### tips: You can't use imageData directly,show it in canvas putImageData

### Example
  
#### in HTML:

 <pre><code>
 &lt;div style="width: 500px;margin: 20px auto">
   &lt;button @click="$refs.vueShapeImg.fileClick()" >localImage&lt;/button>
   &lt;button @click="$refs.vueShapeImg._main('https://i.loli.net/2019/05/05/5cce957e23c2c.jpg')">networkImage&lt;/button>
   &lt;button @click="$refs.vueShapeImg.showMask()" >startCropper&lt;/button>
   &lt;button @click="$refs.vueShapeImg.closeMask()" >closeCropper&lt;/button>
   &lt;button @click="getImage" >getImage&lt;/button>
 &lt;/div>
 &lt;vueShapeImg :height="400" :width="400" :timelyGetRange="true" :timelyImageData="true" 
              @imageDataChange="imageDataChange"  @rangeChange="rangeChange" ref="vueShapeImg"&gt;&lt;/vueShapeImg&gt;
  </code></pre>
  
#### in Methods:
 
  <pre><code>
rangeChange (obj) {
  console.log(obj)
},
imageDataChange (data) {
  console.log(data)
}, 
getImage () {
  console.log(this.$refs.vueShapeImg.getImg('base64', 'image/png',0.2))
},
 </code></pre>

### Browser support

##### IE10+, chrome, firefox or other modern Browser


## <a name="中文文档">中文文档</a> <a href="#english">English</a> 
> 使用vue编写的图片裁剪组件

## [在线例子](http://www.bqmyweb.cn/vueshapeimg/)

### 怎样使用

``` bash
import vueShapeImg from 'vueshapeimg'
Vue.use(vueShapeImg)

<vue-shape-img></vue-shape-img>

```

### 接口文档
#### props
| 名称 | 描述 | 类型 | 可选参数 | 默认值 |
|---------- |-------- |---------- |---------- |---------- |
|height |- |Number |Y |500 |
|width |- |Number |Y |500 |
|timelyGetRange |是否及时的获取用户选择的区域 |Boolean |Y |false |
|timelyImageData |是否及时的返回用户选择的图像区域|Boolean |Y |false |
##### 注意: 用户选择的图像区域不能直接使用，使用canvas的pitImageData可以展示 

#### methods
|方法名 | 描述 | 参数 |
|---------- |-------- |---------- |
|setImgSrc|如果使用的是网络图片，那么不同域名的图片最好不要使用 |imgSrc|
|fileClick|使用本地图片|-|
|showMask|展开遮罩层，用户选择区域|-| 
|closeMask|关闭遮罩层|-|
|getRange|获取用户选择的区域|-|
|getImg|获取用户选择的区域|type('base64'/'blob'), imgType('image/png' 或者其他任意的web可支持的图片格式),encoderOptions(图片质量默认0.92，可选0.00 - 1.00) |
#### emit
| emit name | Description
|---------- |-------- |
|imageDataChange|如果timelyImageData为true，那么会及时返回用户选择区域的图像，图像是imageData，img不能直接展示|
|rangeChange|如果timelyGetRange为true,那么会及时返回用户选择的区域|
##### tips: imageDataChange返回的值可以通过 canvas的putImageData展示

### 举例
 
#### html里面:
  
 <pre><code>
 &lt;div style="width: 500px;margin: 20px auto">
   &lt;button @click="$refs.vueShapeImg.fileClick()" >localImage&lt;/button>
   &lt;button @click="$refs.vueShapeImg._main('https://i.loli.net/2019/05/05/5cce957e23c2c.jpg')">networkImage&lt;/button>
   &lt;button @click="$refs.vueShapeImg.showMask()" >startCropper&lt;/button>
   &lt;button @click="$refs.vueShapeImg.closeMask()" >closeCropper&lt;/button>
   &lt;button @click="getImage" >getImage&lt;/button>
 &lt;/div>
 &lt;vueShapeImg :height="400" :width="400" :timelyGetRange="true" :timelyImageData="true" 
              @imageDataChange="imageDataChange"  @rangeChange="rangeChange" ref="vueShapeImg"&gt;&lt;/vueShapeImg&gt;
  </code></pre>
  
#### 方法里面:
 
  <pre><code>
rangeChange (obj) {
  console.log(obj)
},
imageDataChange (data) {
  console.log(data)
}, 
getImage () {
  console.log(this.$refs.vueShapeImg.getImg('base64', 'image/png',0.2))
},
 </code></pre>

### 浏览器支持情况
##### IE10+, chrome, firefox 和其他现代浏览器

