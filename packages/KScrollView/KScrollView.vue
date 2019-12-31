<template>
  <div
    ref="wrap"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
  >
    <div
      ref="main"
      :style="{
        height: '100%',
        overflowX: scrollX ? 'auto' : 'hidden',
        overflowY: scrollY ? 'auto' : 'hidden',
      }"
    >
      <div
        ref="content"
        style="height: 100%"
      >
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'KScrollView',
    props: {
        scrollX: {
            type: Boolean,
            default: false,
        },
        scrollY: {
            type: Boolean,
            default: false,
        },
        // TODO 支持这个属性
        enableFlex: {
            type: Boolean,
            default: false,
        },
        // TODO
        upperThreshold: {
            type: String,
            default: '50px',
        },
        // TODO
        lowerThreshold: {
            type: String,
            default: '50px',
        },
        scrollTop: {
            type: String,
            default: '0px',
        },
        scrollLeft: {
            type: String,
            default: '0px',
        },
        scrollIntoView: {
            type: String,
            default: '',
        },
        scrollWithAnimation: {
            type: Boolean,
            default: false,
        },
        // TODO
        scrollAnchoring: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        scrollTop(pos) {
            this.$refs.main.scrollTop = pos
        },
        scrollLeft(pos) {
            this.$refs.main.scrollLeft = pos
        },
        scrollIntoView(id) {
            if (!/^[_a-zA-Z][-_a-zA-Z0-9:]*$/.test(id)) {
                console.info(`[KScrollView] "${id}" is not a valid id.`)
                return
            }
            const relRect = this.$refs.main.getBoundingClientRect()
            const rect = this.$refs.content.querySelector('#' + id).getBoundingClientRect()
            if (this.scrollX) {
                this.scrollTo(this.$refs.main.scrollLeft + rect.left - relRect.left, 'x')
            }
            if (this.scrollY) {
                this.scrollTo(this.$refs.main.scrollTop + rect.top - relRect.top, 'y')
            }
        },
    },
    methods: {
        scrollTo(val, direction) {
            if (!this.scrollWithAnimation) {
                if (direction === 'x') {
                    this.$refs.main.scrollLeft = val
                } else if (direction === 'y') {
                    this.$refs.main.scrollTop = val
                }
                return
            }

            const main = this.$refs.main

            if (val < 0) {
                val = 0
            } else if (direction === 'x' && val > main.scrollWidth - main.offsetWidth) {
                val = main.scrollWidth - main.offsetWidth
            } else if (direction === 'y' && val > main.scrollHeight - main.offsetHeight) {
                val = main.scrollHeight - main.offsetHeight
            }

            let pos = 0
            let transform = ''

            if (direction === 'x') {
                pos = main.scrollLeft - val
            } else if (direction === 'y') {
                pos = main.scrollTop - val
            }

            if (pos === 0) {
                return
            }

            this.$refs.content.style.transition = 'transform .3s ease-out'
            this.$refs.content.style.webkitTransition = '-webkit-transform .3s ease-out'

            if (direction === 'x') {
                transform = 'translateX(' + pos + 'px) translateZ(0)'
            } else if (direction === 'y') {
                transform = 'translateY(' + pos + 'px) translateZ(0)'
            }

            this.$refs.content.removeEventListener('transitionend', this.__transitionEnd)
            this.$refs.content.removeEventListener('webkitTransitionEnd', this.__transitionEnd)
            this.__transitionEnd = this._transitionEnd.bind(this, val, direction)
            this.$refs.content.addEventListener('transitionend', this.__transitionEnd)
            this.$refs.content.addEventListener('webkitTransitionEnd', this.__transitionEnd)

            if (direction === 'x') {
                // ios下先hidden会先闪到scrollleft = 0处
                if (!/iPhone|iPad/.test(navigator.userAgent)) main.style.overflowX = 'hidden'
            } else if (direction === 'y') {
                main.style.overflowY = 'hidden'
            }

            this.$refs.content.style.transform = transform
            this.$refs.content.style.webkitTransform = transform
        },
        _transitionEnd(val, direction) {
            this.$refs.content.style.transition = ''
            this.$refs.content.style.webkitTransition = ''
            this.$refs.content.style.transform = ''
            this.$refs.content.style.webkitTransform = ''

            const main = this.$refs.main

            if (direction === 'x') {
                main.style.overflowX = this.scrollX ? 'auto' : 'hidden'
                main.scrollLeft = val
            } else if (direction === 'y') {
                main.style.overflowY = this.scrollY ? 'auto' : 'hidden'
                main.scrollTop = val
            }
            this.$refs.content.removeEventListener('transitionend', this.__transitionEnd)
            this.$refs.content.removeEventListener('webkitTransitionEnd', this.__transitionEnd)
        },

        touchstart(e) {
            this._x = e.detail.x
            this._y = e.detail.y
            this._noBubble = null
        },
        touchend() {
            this._noBubble = false
        },
        touchmove(e) {
            if (this._noBubble === null && this.scrollY) {
                if (Math.abs(this._y - e.detail.y) / Math.abs(this._x - e.detail.x) > 1) {
                    this._noBubble = true
                } else {
                    this._noBubble = false
                }
                if (this._isScrollingOnBoundary(e)) {
                    this._noBubble = false
                }
            }

            if (this._noBubble === null && this.scrollX) {
                if (Math.abs(this._x - e.detail.x) / Math.abs(this._y - e.detail.y) > 1) {
                    this._noBubble = true
                } else {
                    this._noBubble = false
                }
                if (this._isScrollingOnBoundary(e)) {
                    this._noBubble = false
                }
            }

            this._x = e.detail.x
            this._y = e.detail.y

            if (this._noBubble) {
                e.stopPropagation()
            }
        },


    }
}
</script>
