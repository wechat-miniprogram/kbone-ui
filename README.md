# kbone-ui

`kbone-ui` 是一个能同时支持 小程序(kbone) 和 vue 框架开发的多端 UI 库。


kbone 框架是用来对齐 Web 和 小程序多端的一个解决方案。在使用时，还是需要注意 小程序和 Web 之间的开发差异性，为了磨平这块内容，提供 kbone-ui 组件库。通过，kbone-ui 来磨平大部分的实现差异，以及能方便跨平台的开发。

## 特性

* 即可以基于 `Kbone` 同时开发小程序和 H5，也可以单独使用开发 H5 应用。
* 支持以 Vue 语法来支持 H5 端和小程序端运行
* 对齐 [微信weui](https://weui.io) 样式组件


## 相关链接


## 快速上手

下载 kbone-ui

```sh
npm install kbone-ui  
```

加载全部组件内容，并引入 weui 样式库：

```js
import KboneUI from 'kbone-ui'
import 'kbone-ui/lib/weui/weui.css'

Vue.use(KboneUI)
```


## LICENSE

MIT