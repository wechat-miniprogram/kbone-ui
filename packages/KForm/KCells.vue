<template>
    <KView class="weui-cells__group weui-cells__group_form">
        <KView class="weui-cells__title" v-if="title">{{title}}</KView>
        <KView class="weui-cells weui-cells_after-title weui-cells_form" v-bind:class="classObject">
            <slot></slot>
        </KView>
        <KView v-if="footer" class="weui-cells__tips">
            {{footer}}
        </KView>
        <slot name="footer" v-else></slot>
    </KView>
</template>

<script>
export default {
  name: "KCells",
  props: {
    title: {
      type: String,
      value: ""
    },
    footer: {
      type: String,
      value: ""
    },
    checkbox:{
        type:Boolean,
        default: false
    }
  },
  computed:{
        classObject(){
            return {
                "weui-cells_checkbox": this.checkbox,

            }
        }
    },
};
</script>
