# kbone-ui

`kbone-ui` 是一个能同时支持 小程序(kbone) 和 vue 框架开发的多端 UI 库。

> 注意：此仓库为 kbone-ui 0.x 版本，基于 Vue 实现，后续不再维护。1.x 版本已迁移至 [kbone 主仓库下](https://github.com/Tencent/kbone/tree/develop/packages/kbone-ui)，新版采用 Web Components 实现，不依赖 Web 框架，有需要可点进 [1.x 版本文档](https://wechat-miniprogram.github.io/kbone/docs/kbone-ui/#%E7%AE%80%E4%BB%8B)了解详情。

## 特性

* 既可以基于 `Kbone` 同时开发小程序和 H5，也可以单独使用开发 H5 应用。
* 支持以 Vue 语法来支持 H5 端和小程序端运行
* 对齐 [微信weui](https://weui.io) 样式组件


## 相关链接

* [kbone-ui 组件文档](https://wechat-miniprogram.github.io/kbone/docs/ui/intro/)
* [kbone-ui 示例](https://wechat-miniprogram.github.io/kboneui/ui/#/)

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
