<template>
  <KView
    name="kb-drawer">
    <KView
      v-show="visible"
      class="weui-drawer__main">
      <KView
        :class="'weui-drawer__wrapper'+(visible && ' weui-drawer__open')"
        @click.self="handleWrapperClick">
        <KView
          :class="direction"
          :style="`width: ${size}`"
          class="weui-drawer">
          <section>
            <slot />
          </section>
        </KView>
      </KView>
    </KView>
  </KView>
</template>

<script>
import KView from '../KView/'

export default {
    name: 'KDrawer',
    components: {
        KView
    },
    props: {
        /** 是否显示 */
        visible: {
            type: Boolean,
            default: false
        },
        /** 打开方向 */
        direction: {
            default: 'rtl',
            validator(val) {
                return ['ltr', 'rtl'].indexOf(val) !== -1
            }
        },
        /** 是否显示模态 */
        modal: {
            type: Boolean,
            default: false
        },
        /** 抽屉大小 */
        size: {
            type: String,
            default: '30%'
        },
        /** 可点击空白处关闭 */
        wrapperClosable: {
            type: Boolean,
            default: true
        },
        /** 关闭前钩子 */
        beforeClose: {
            type: Function
        }
    },
    data() {
        return {
            closed: false
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.closed = false
                this.$emit('open')
            } else if (!this.closed) {
                this.$emit('close')
            }
        }
    },
    methods: {
        hide() {
            this.$emit('update:visible', false)
            this.$emit('close')
            this.closed = true
        },
        /** 点击空白处关闭 */
        handleWrapperClick() {
            if (this.wrapperClosable) {
                this.closeDrawer()
            }
        },
        /** 关闭抽屉 */
        closeDrawer() {
            if (typeof this.beforeClose === 'function') {
                this.beforeClose(this.hide)
            } else {
                this.hide()
            }
        },
    }
}
</script>
