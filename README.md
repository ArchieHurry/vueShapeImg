# vueShapeImg

[![install size](https://packagephobia.now.sh/badge?p=vueshapeimg)](https://packagephobia.now.sh/result?p=vueshapeimg)

> Picture clipping component made with vue. vue编写的图片裁剪组件

[If you like, please give me a star (๑•̀ㅂ•́)و✧](https://github.com/ArchieHurry/vueShapeImg)

[如果你喜欢它，可以给我星星吗 (๑•̀ㅂ•́)و✧](https://github.com/ArchieHurry/vueShapeImg)

![Demonstration](http://www.bqmyweb.cn/vueshapeimg/1.3.1.gif)

## <a name="english">English</a> <a href="https://github.com/ArchieHurry/vueShapeImg/blob/master/README_ZH.md">中文文档</a>

## [OnlineDemo](http://www.bqmyweb.cn/vueshapeimg/)

### How to use

``` bash
import vueShapeImg from 'vueshapeimg'
Vue.use(vueShapeImg)

<vue-shape-img></vue-shape-img>

```

### vueShapeImg API Doc

#### props

|Parameters|Description|Type|Optional values|Default value|
|----------|--------|----------|----------|----------|
|useFrame|Clipping pictures using marquee boxes|Boolean|Y|false|
|canResizeFrame|Whether the box can be scaled and moved|Boolean|Y|true|
|initRange|Left,Top,Width and Height of box initialization|Array|Y|[width * 0.25, height * 0.25, width * 0.5 ,height * 0.5]|
|height|-|Number|Y|500|
|width|-|Number|Y|500|
|timelyGetRange|Timely get user's select range|Boolean|Y|false|
|timelyImageData|Timely converting pictures that capture the user's range of choice into imageData|Boolean|Y|false|

##### tips: You can't use imageData directly,show it in canvas putImageData 

#### methods

|Method name|Description|Parameters|
|----------|--------|----------|
|rotate|Rotate the picture on canvas|deg(Arbitrary integer)|
|setImgSrc|Use network picture. Pictures with different domain names are best not to be used|imgSrc(Picture links or Base64 files)|
|fileClick|Use local picture|-|
|showMask|Open the mask layer, select the area|-|
|closeMask|Close the mask layer|-|
|getRange|Get the scope of user selection|-|
|setRange|Set the scope of user selection|[left,top,width,height]|
|getImg|Get pictures of the range selected by the user|type('base64'/'blob'), imgType('image/jpeg' Or other image types),encoderOptions(0.00 - 1.00)|

##### tips: getImg ->  imgType -> 'image/jpeg' can compress pictures better.

#### emit

|emit name|Description
|----------|--------|
|imageDataChange|if props timelyImageData is true, this emit can return the imageData in timely|
|rangeChange|if props timelyGetRange is true, this emit can return the range in timely|
|error|error tips: -1(Picture format error), -2(Picture loading failed), -3(Pictures are cross-domain resources)|

##### tips: You can't use imageData directly,show it in canvas putImageData 

### Example [OnlineDemo](http://www.bqmyweb.cn/vueshapeimg/)


 <pre><code>
 &lt;template&gt;
   &lt;div id=&quot;app&quot;&gt;
     &lt;div style=&quot;width: 500px;&quot;&gt;
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
       &lt;canvas id=&quot;canvas2&quot;&gt;&lt;/canvas&gt;
     &lt;/div&gt;
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

### Upgraded content

#### 1.3.4 (2019-5-15 15:17:51)

- Limit the range of input parameters of setRange function 

#### 1.3.2 (2019-5-15 11:23:55)

- Fixed the problem of calling the rotate function picture to return to the center of the canvas after moving the picture in frame mode

#### 1.3.1 (2019-5-15 10:47:35)

- Adding image rotate function

#### 1.3.0 (2019-5-13 17:25:10)

- Fixed the problem of onmouseup pollute caused by using multiple vueShapeImg on the same page and clipping box always exist
- Fixed cross-domain error multiple times triggered when using cross-domain images for cropping in normal mode

#### 1.2.9 (2019-5-13 17:05:41)

- Fixed the problem of using timelyGetRange to report cross-domain errors in normal mode

[more version info](https://github.com/ArchieHurry/vueShapeImg/blob/master/version.md)
