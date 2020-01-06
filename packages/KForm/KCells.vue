<template>
  <KView class="weui-cells__group ">
    <KView
      v-if="title"
      class="weui-cells__title">
      {{ title }}
    </KView>
    <KView
      :class="classObject"
      class="weui-cells weui-cells_after-title weui-cells_form">
      <slot></slot>
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
        }
    },
    computed: {
        classObject() {
            return {

            }
        }
    },
}
</script>
