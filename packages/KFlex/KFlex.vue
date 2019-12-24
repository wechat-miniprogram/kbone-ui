<template>
  <div
    :style="{
      'flex-direction':direction
    }"
    class="weui-flex"
    @click="$emit('click')"
  >
    <slot/>
  </div>
</template>

<script>
export default {
    name: 'KFlex',
    props: {
        direction: {
            type: String,
            default: 'row'
        }
    }
}
</script>

