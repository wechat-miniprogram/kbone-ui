<template>
  <KView class="weui-progress">
    <KView class="weui-progress__bar">
      <KView
        :style="{
          width:percent + '%'
        }"
        class="weui-progress__inner-bar"/>
    </KView>
    <KView
      v-if="showInfo"
      class="weui-progress-info">
      {{ percent }}%
    </KView>
  </KView>
</template>

<script>
export default {
    name: 'KProgress',
    props: {
        percent: {
            type: Number,
            default: 0
        },
        showInfo: {
            type: Boolean,
        }
    }
}
</script>
