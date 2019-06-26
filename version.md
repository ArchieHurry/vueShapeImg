#### 1.3.1 (2019-5-15 10:47:35)

Adding image rotate function

添加了图片旋转功能

#### 1.3.0 (2019-5-13 17:25:10)

Fixed the problem of onmouseup pollute caused by using multiple vueShapeImg on the same page and clipping box always exist

Fixed cross-domain error multiple times triggered when using cross-domain images for cropping in normal mode

修复在同一页面中使用多个vueShapeImg导致onmouseup污染，裁剪框一直存在的问题

修复在普通模式下使用跨域图片进行裁剪时多次报错的问题

#### 1.2.9 (2019-5-13 17:05:41)

Fixed the problem of using timelyGetRange to report cross-domain errors in normal mode

修复了普通模式下使用timelyGetRange报跨域错误的问题

#### 1.2.8（2019-5-13 16:21:55）

Fixed the problem that timelyGetRange did not trigger when zooming and moving the underlying image in useFrame mode.

修复了在useFrame模式下缩放和移动底层图片，timelyGetRange 不触发的问题。
