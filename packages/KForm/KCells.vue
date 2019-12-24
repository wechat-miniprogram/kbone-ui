<template>
  <KView class="weui-cells__group weui-cells__group_form">
    <KView
      v-if="title"
      class="weui-cells__title">{{ title }}</KView>
    <KView
      :class="classObject"
      class="weui-cells weui-cells_after-title weui-cells_form">
      <slot/>
    </KView>
    <KView
      v-if="footer"
      class="weui-cells__tips">
      {{ footer }}
    </KView>
    <slot
      v-else
      name="footer"/>
  </KView>
</template>

<script>
export default {
    name: 'KCells',
    props: {
        title: {
            type: String,
            value: ''
        },
        footer: {
            type: String,
            value: ''
        },
        checkbox: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classObject() {
            return {
                'weui-cells_checkbox': this.checkbox,

            }
        }
    },
}
</script>
