<template>
  <KView v-show="isShow">
    <KMask :transparent="true" />
    <KView class="weui-toast">
      <KIcon
        :type="iconType"
        class="weui-icon_toast" />
      <KView class="weui-toast_content">
        <slot/>
      </KView>
    </KView>
  </KView>
</template>
<script>
import KIcon from '../KIcon/'
import KMask from '../KMask/'

export default {
    name: 'KToast',
    components: {
        KIcon,
        KMask,
    },
    props: {
        type: {
            type: String,
            default: 'success'
        },
        value: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Number,
        }
    },
    data() {
        return {
            isShow: this.value
        }
    },
    computed: {
        iconType() {
            if (this.type === 'success') {
                return 'success-no-circle'
            }
            return this.type
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
    },

}
</script>
