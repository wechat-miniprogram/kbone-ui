<template>
  <KView class="weui-cell">
    <KView v-if="value" class="weui-cell__bd" >
      {{value}} 
      <slot></slot>
    </KView>
    <KView
      v-else
      class="weui-cell__bd">
        <template>
          <img v-if="icon" class="weui-cell__icon" :src="icon" >
          <slot name="icon"></slot>
        </template>
        <template>
          {{title}}
          <slot name="title"></slot>
        </template>
    </KView>
    <KView class="weui-cell__ft">
      {{footer}}
      <slot name="footer"></slot>
    </KView>
  </KView>
</template>

<script>
export default {
  name: 'KCell',
  props: {
        extClass: {
            type: String,
            value: ''
        },
        iconClass: {
            type: String,
            value: ''
        },
        bodyClass: {
            type: String,
            value: ''
        },
        icon: {
            type: String,
            value: '',
        },
        title: { // 和icon二选一，都是放在cell_hd里面
            type: String,
            value: '',
        },
        value: {
            type: String,
            value: '',
        },
        showError: {
            type: Boolean,
            value: false
        },
        prop: { // 校验的属性，给父元素form使用
            type: String,
            value: ''
        },
        footerClass: {
            type: String,
            value: ''
        },
        footer: {
            type: String,
            value: ''
        },
        inline: { // 左右布局样式还是上下布局
            type: Boolean,
            value: true
        },
  }
}
</script>