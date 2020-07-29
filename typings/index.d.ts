import Vue from 'vue'

export interface InstallationOptions {
    locale: any,
    i18n: any,
    size: string
}

/**
 * Install all kbone-ui components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(KboneUI)` to install.
 */
export function install (vue: typeof Vue, options: InstallationOptions): void


export declare class KboneUIComponent extends Vue {
  static install (vue: typeof Vue): void
}

/** 视图容器 */
export class KView extends KboneUIComponent { }

/** Flexbox 布局标签 */
export class KFlex extends KboneUIComponent { }
export class KFlexItem extends KboneUIComponent { }

/** 滑块视图容器。其中只可放置一级 swiper-item 组件，否则会导致未定义的行为。 */
export class KSwiper extends KboneUIComponent { }

/** 仅可放置在 KSwiper 组件中，宽高自动设置为 100%。 */
export class KSwiperItem extends KboneUIComponent { }

/** 可滚动视图区域。使用竖向滚动时，需要通过 CSS 给 scroll-view 一个固定高度。 */
export class KScrollView extends KboneUIComponent { }

/** 
 * 成对使用的组件，`MovableView` 可以在 `MovableArea` 的范围内拖拽移动、缩放。对齐微信小程序的 [movable-area](https://developers.weixin.qq.com/miniprogram/dev/component/movable-area.html) 和 [movable-view](https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html)
 * 
 * 需要注意，在实际使用中，__`MovableArea` 必须是 `MovableView` 的直接父亲__。
 */
export class KMovableArea extends KboneUIComponent { }
export class KMovableView extends KboneUIComponent { }

/** 按钮。默认是占一行的，可以结合 KButtonArea 来控制 Button 的横纵排列。 */
export class KButton extends KboneUIComponent { }

/** 按钮的包裹区域，可以用来控制当前 KButton 的排列方向。 */
export class KButtonArea extends KboneUIComponent { }

/** 多选项目，一般结合 KCheckboxGroup 一起使用。 */
export class KCheckbox extends KboneUIComponent { }

/** 多项选择器，内部由多个checkbox组成。 */
export class KCheckboxGroup extends KboneUIComponent { }

/** 输入框 */
export class KInput extends KboneUIComponent { }

/** 单选选择器。 */
export class KRadio extends KboneUIComponent { }

/** 开关选择器。 */
export class KSwitch extends KboneUIComponent { }

/** KCell 是列表或者是表单的一项，常用于设置页的展示，或者用在表单中，作为表单的每一个要填写的项，KCell 必须要放在 KCells 组件的下面。 */
export class KCell extends KboneUIComponent { }

/** KCells 是列表分组，常用于嵌套一组 KCell 或者 KCheckbox。 */
export class KCells extends KboneUIComponent { }

/** 滑动选择器。 */
export class KSlider extends KboneUIComponent { }

/** 嵌入页面的滚动选择器。其中只可放置 KPickerViewColumn 组件，并且必须和 KPickerViewColumn 为父子组件。 */
export class KPickerView extends KboneUIComponent { }

/** 滚动选择器子项。仅可放置于 KPickerView 中，其孩子节点的高度会自动设置成与 KPickerView 的选中框的高度一致。 */
export class KPickerViewColumn extends KboneUIComponent { }

/** 弹出式菜单。 */
export class KActionSheet extends KboneUIComponent { }

/** 简单的浮窗提示。通常用来作为时间点击的 Loading 和 完成反馈。 */
export class KToast extends KboneUIComponent { }

/** 弹窗组件。 */
export class KDialog extends KboneUIComponent { }

/** 顶部消息通知。 */
export class KToptips extends KboneUIComponent { }
