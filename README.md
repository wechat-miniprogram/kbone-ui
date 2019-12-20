# kbone-ui

`kbone-ui` 是一个能同时支持 小程序(kbone) 和 vue 框架开发的多端 UI 库。


## 特性

* 即可以基于 `Kbone` 同时开发小程序和 H5，也可以单独使用开发 H5 应用。
* 支持以 Vue 语法来支持 H5 端和小程序端运行
* 对齐 [微信weui](https://weui.io) 样式组件


## 相关链接

* [kbone-ui 组件文档](https://wechat-miniprogram.github.io/kbone/docs/ui/intro/)

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