<template>
  <KView
    name="k-drawer">
    <KView
      v-show="visible"
      class="kb-drawer__main">
      <KView
        :class="'kb-drawer__wrapper'+(visible && ' kb-drawer__open')"
        @click.self="handleWrapperClick">
        <KView
          :class="direction"
          :style="`width: ${size}`"
          class="kb-drawer">
          <section>
            <slot />
          </section>
        </KView>
      </KView>
    </KView>
  </KView>
</template>

<style lang="less">
.kb-drawer__main { position: fixed; left: 0; top: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; z-index: 9999; }
.kb-drawer__wrapper { position: relative; left: 0; top: 0; right: 0; bottom: 0; width: 100%; height: 100%; background: rgba(200, 200, 200, .7); }
.kb-drawer { position: absolute; display: flex; flex-direction: column; overflow: hidden; padding: 20px; background: #FFFFFF; }
@keyframes rtl-drawer-in { 0% { transform: translate(100%) } to { transform:translate(0) } }
@keyframes rtl-drawer-out { 0% { transform: translate(0) } to { transform:translate(100%) } }
@keyframes ltr-drawer-in { 0% { transform: translate(-100%) } to { transform:translate(0) } }
@keyframes ltr-drawer-out { 0% { transform: translate(0) } to { transform:translate(-100%) } }
.kb-drawer.rtl { animation: rtl-drawer-out .3s; }
.kb-drawer.ltr { animation: ltr-drawer-out .3s; }
.kb-drawer__open .kb-drawer.rtl { animation: rtl-drawer-in .3s; }
.kb-drawer__open .kb-drawer.ltr { animation: ltr-drawer-in .3s; }
.kb-drawer.rtl, .kb-drawer.ltr { height: 100%; top: 0; bottom: 0; }
.kb-drawer.rtl { right: 0; }
.kb-drawer.ltr { left: 0; }
</style>

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
