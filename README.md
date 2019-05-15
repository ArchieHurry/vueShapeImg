# vueShapeImg

> Picture clipping component made with vue

[If you like, please give me a star (๑•̀ㅂ•́)و✧](https://github.com/ArchieHurry/vueShapeImg)

[如果你喜欢它，可以给我星星吗 (๑•̀ㅂ•́)و✧](https://github.com/ArchieHurry/vueShapeImg)

![Demonstration](http://www.bqmyweb.cn/vueshapeimg/1.3.1.gif)

## <a name="english">English</a> <a href="#中文文档">中文文档</a>

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
|useFrame|Clipping pictures using marquee boxes| Boolean | Y | false |
|canResizeFrame|Whether the box can be scaled and moved| Boolean | Y | true |
|initRange|Left,Top,Width and Height of box initialization| Array | Y | [width * 0.25, height * 0.25, width * 0.5 ,height * 0.5] |
|height |- |Number |Y |500 |
|width |- |Number |Y |500 |
|timelyGetRange |Timely get user's select range |Boolean |Y |false |
|timelyImageData |Timely converting pictures that capture the user's range of choice into imageData |Boolean |Y |false |

##### tips: You can't use imageData directly,show it in canvas putImageData 

#### methods

| Method name | Description | Parameters |
|---------- |-------- |---------- |
|rotate|Rotate the picture on canvas|deg(Arbitrary integer) |
|setImgSrc|Use network picture. Pictures with different domain names are best not to be used |imgSrc(Picture links or Base64 files)|
|fileClick|Use local picture|-|
|showMask|Open the mask layer, select the area|-| 
|closeMask|Close the mask layer|-|
|getRange|Get the scope of user selection|-|
|setRange|Set the scope of user selection| [left,top,width,height] |
|getImg|Get pictures of the range selected by the user|type('base64'/'blob'), imgType('image/jpeg' Or other image types),encoderOptions(0.00 - 1.00) |

##### tips: getImg ->  imgType -> 'image/jpeg' can compress pictures better.

#### emit

| emit name | Description
|---------- |-------- |
|imageDataChange|if props timelyImageData is true, this emit can return the imageData in timely|
|rangeChange|if props timelyGetRange is true, this emit can return the range in timely|
|error|error tips: -1(Picture format error), -2（Picture loading failed）, -3(Pictures are cross-domain resources) |

##### tips: You can't use imageData directly,show it in canvas putImageData 

### Example [OnlineDemo](http://www.bqmyweb.cn/vueshapeimg/)
<pre><code>
&lt;template&gt;
  &lt;div id=&quot;app&quot;&gt;
    &lt;div style=&quot;width: 500px;display: inline-block;float: left&quot;&gt;
      &lt;button @click=&quot;$refs.vueShapeImg2.fileClick()&quot;&gt;localImg&lt;/button&gt;
      &lt;button @click=&quot;$refs.vueShapeImg2.setImgSrc(&#x27;http://www.bqmyweb.cn/vueshapeimg/demo.png&#x27;)&quot;&gt;networkImg&lt;/button&gt;
      &lt;button @click=&quot;$refs.vueShapeImg2.showMask()&quot;&gt;startCrop&lt;/button&gt;
      &lt;button @click=&quot;$refs.vueShapeImg2.closeMask()&quot;&gt;endCrop&lt;/button&gt;
      &lt;button @click=&quot;getImg2&quot;&gt;getImg&lt;/button&gt;
      &lt;button @click=&quot;$refs.vueShapeImg2.setRange([200,200,200,200])&quot;&gt;setRange&lt;/button&gt;
      &lt;button @click=&quot;$refs.vueShapeImg2.rotate(10)&quot;&gt;rotate10&lt;/button&gt;
      &lt;button @click=&quot;$refs.vueShapeImg2.rotate(-10)&quot;&gt;rotate-10&lt;/button&gt;
      &lt;p style=&quot;font-size: 18px;font-weight: bold;&quot;&gt;useFrame:true&lt;/p&gt;
      &lt;vueShapeImg @error=&quot;imgError&quot; :height=&quot;400&quot; :width=&quot;400&quot; :useFrame=&quot;true&quot; :timelyImageData=&quot;true&quot; @imageDataChange=&quot;putImg2&quot; ref=&quot;vueShapeImg2&quot;&gt;&lt;/vueShapeImg&gt;
      &lt;canvas style=&quot;margin-left: 50px&quot; id=&quot;canvas2&quot;&gt;&lt;/canvas&gt;
    &lt;/div&gt;
    &lt;div style=&quot;clear: both&quot;&gt;&lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
export default {
  name: &#x27;app&#x27;,
  data () {
    return {
      canvas2: null,
      canvas2Ctx: null
    }
  },
  mounted () {
    this.canvas2 = document.getElementById(&#x27;canvas2&#x27;)
    this.canvas2Ctx = this.canvas2.getContext(&#x27;2d&#x27;)
  },
  methods: {
    putImg2 (imgData) {
      this.canvas2Ctx.clearRect(0, 0, 500, 500)
      let obj = this.$refs.vueShapeImg2.getRange()
      this.canvas2.width = obj.w
      this.canvas2.height = obj.h
      this.canvas2Ctx.putImageData(imgData, 0, 0)
    },
    getImg2 () {
      console.log(this.$refs.vueShapeImg2.getImg(&#x27;base64&#x27;, &#x27;image/jpeg&#x27;, 0.7))
    },
    imgError (error) {
      console.error(error)
    },
  }
}
&lt;/script&gt;
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
|useFrame|是否使用选框裁剪图片| Boolean | Y | false |
|canResizeFrame|选框是否可以缩放| Boolean | Y | true |
|initRange|数组，依次为左边距，上边距，宽，高| Array | Y | [width * 0.25, height * 0.25, width * 0.5 ,height * 0.5] |
|height |- |Number |Y |500 |
|width |- |Number |Y |500 |
|timelyGetRange |是否及时的获取用户选择的区域 |Boolean |Y |false |
|timelyImageData |是否及时的返回用户选择的图像区域|Boolean |Y |false |

##### 注意: 用户选择的图像区域不能直接使用，使用canvas的pitImageData可以展示 

#### methods

|方法名 | 描述 | 参数 |
|---------- |-------- |---------- |
|rotate|旋转canvas上的图片|任意整数|
|setImgSrc|如果使用的是网络图片，那么不同域名的图片最好不要使用 |imgSrc(任意可以被img标签加载的资源)|
|fileClick|使用本地图片|-|
|showMask|展开遮罩层，用户选择区域|-| 
|closeMask|关闭遮罩层|-|
|getRange|获取用户选择的区域|-|
|setRange|设置用户选框的大小| [left,top,width,height] |
|getImg|获取用户选择的区域|type('base64'/'blob'), imgType('image/png' 或者其他任意的web可支持的图片格式),encoderOptions(图片质量默认0.92，可选0.00 - 1.00) |

##### tips: getImg ->  imgType -> 'image/jpeg' 可以更好的压缩图片

#### emit

| emit name | Description
|---------- |-------- |
|imageDataChange|如果timelyImageData为true，那么会及时返回用户选择区域的图像，图像是imageData，img不能直接展示|
|rangeChange|如果timelyGetRange为true,那么会及时返回用户选择的区域|
|error|错误提示: -1(图片格式错误), -2（图片加载失败）, -3(图片为跨域资源) |

##### tips: imageDataChange返回的值可以通过 canvas的putImageData展示

### 举例 [在线例子](http://www.bqmyweb.cn/vueshapeimg/)
 <pre><code>
 &lt;template&gt;
   &lt;div id=&quot;app&quot;&gt;
     &lt;div style=&quot;width: 500px;display: inline-block;float: left&quot;&gt;
       &lt;button @click=&quot;$refs.vueShapeImg2.fileClick()&quot;&gt;localImg&lt;/button&gt;
       &lt;button @click=&quot;$refs.vueShapeImg2.setImgSrc(&#x27;http://www.bqmyweb.cn/vueshapeimg/demo.png&#x27;)&quot;&gt;networkImg&lt;/button&gt;
       &lt;button @click=&quot;$refs.vueShapeImg2.showMask()&quot;&gt;startCrop&lt;/button&gt;
       &lt;button @click=&quot;$refs.vueShapeImg2.closeMask()&quot;&gt;endCrop&lt;/button&gt;
       &lt;button @click=&quot;getImg2&quot;&gt;getImg&lt;/button&gt;
       &lt;button @click=&quot;$refs.vueShapeImg2.setRange([200,200,200,200])&quot;&gt;setRange&lt;/button&gt;
       &lt;button @click=&quot;$refs.vueShapeImg2.rotate(10)&quot;&gt;rotate10&lt;/button&gt;
       &lt;button @click=&quot;$refs.vueShapeImg2.rotate(-10)&quot;&gt;rotate-10&lt;/button&gt;
       &lt;p style=&quot;font-size: 18px;font-weight: bold;&quot;&gt;useFrame:true&lt;/p&gt;
       &lt;vueShapeImg @error=&quot;imgError&quot; :height=&quot;400&quot; :width=&quot;400&quot; :useFrame=&quot;true&quot; :timelyImageData=&quot;true&quot; @imageDataChange=&quot;putImg2&quot; ref=&quot;vueShapeImg2&quot;&gt;&lt;/vueShapeImg&gt;
       &lt;canvas style=&quot;margin-left: 50px&quot; id=&quot;canvas2&quot;&gt;&lt;/canvas&gt;
     &lt;/div&gt;
     &lt;div style=&quot;clear: both&quot;&gt;&lt;/div&gt;
   &lt;/div&gt;
 &lt;/template&gt;
 
 &lt;script&gt;
 export default {
   name: &#x27;app&#x27;,
   data () {
     return {
       canvas2: null,
       canvas2Ctx: null
     }
   },
   mounted () {
     this.canvas2 = document.getElementById(&#x27;canvas2&#x27;)
     this.canvas2Ctx = this.canvas2.getContext(&#x27;2d&#x27;)
   },
   methods: {
     putImg2 (imgData) {
       this.canvas2Ctx.clearRect(0, 0, 500, 500)
       let obj = this.$refs.vueShapeImg2.getRange()
       this.canvas2.width = obj.w
       this.canvas2.height = obj.h
       this.canvas2Ctx.putImageData(imgData, 0, 0)
     },
     getImg2 () {
       console.log(this.$refs.vueShapeImg2.getImg(&#x27;base64&#x27;, &#x27;image/jpeg&#x27;, 0.7))
     },
     imgError (error) {
       console.error(error)
     },
   }
 }
 &lt;/script&gt;

</code></pre>


### 浏览器支持情况

##### IE10+, chrome, firefox 和其他现代浏览器

### Upgraded content（升级的内容）

#### 1.3.4（2019-5-15 15:17:51）

- Limit the range of input parameters of setRange function 

限制了setRange 函数的输入参数范围

#### 1.3.2（2019-5-15 11:23:55）

- Fixed the problem of calling the rotate function picture to return to the center of the canvas after moving the picture in frame mode  

修复框架模式下图片移动后调用旋转函数图片返回画布中心的问题

#### 1.3.1（2019-5-15 10:47:35）

- Adding image rotate function
  
添加了图片旋转功能

#### 1.3.0（2019-5-13 17:25:10）

- Fixed the problem of onmouseup pollute caused by using multiple vueShapeImg on the same page and clipping box always exist
  
修复在同一页面中使用多个vueShapeImg导致onmouseup污染，裁剪框一直存在的问题

- Fixed cross-domain error multiple times triggered when using cross-domain images for cropping in normal mode
  
修复在普通模式下使用跨域图片进行裁剪时多次报错的问题

#### 1.2.9（2019-5-13 17:05:41）

- Fixed the problem of using timelyGetRange to report cross-domain errors in normal mode
  
修复了普通模式下使用timelyGetRange报跨域错误的问题

[more version info（更多版本信息）](./version.md)
