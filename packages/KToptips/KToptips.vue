<template>
  <KView
    :class="{
      'weui-toptips_show': isShow,
      'weui-toptips_success': type === 'success',
      'weui-toptips_error': type === 'error',
      'weui-toptips_info': type === 'info',
    }"
    class="weui-toptips"
  >
    <slot/>
  </KView>
</template>
<script>
export default {
    name: 'KToptips',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Number
        },
        type: {
            type: String, // warn, info、error、success
            default: 'success'
        }
    },
    data() {
        return {
            isShow: this.value
        }
    },
    watch: {
        value(newValue) {
            if (newValue) {
                this.isShow = true
                if (this.duration) {
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        this.isShow = false
                        this.$emit('input', false)
                    }, this.duration)
                }
            } else {
                this.isShow = false
            }
        }
    }
}
</script>
