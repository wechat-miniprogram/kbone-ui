<template>
  <wx-scroll-view
    v-if="ismp"
    ref="mp"
    :scroll-x="scrollX"
    :scroll-y="scrollY"
    :scroll-top="mpScrollTop"
    :scroll-left="mpScrollLeft"
    :scroll-into-view="mpScrollIntoView"
    :scroll-with-animation="scrollWithAnimation"
    :upper-threshold="upperThreshold"
    :lower-threshold="lowerThreshold"
    @scroll="scroll"
    @scrolltoupper="mpScrollToUpper"
    @scrolltolower="mpScrollToLower"
  >
    <div
      ref="content"
      style="height: 100%"
    >
      <slot/>
    </div>
  </wx-scroll-view>
  <div
    v-else
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
      @scroll="scroll"
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
import {ismp} from '@utils/util'

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
        upperThreshold: {
            type: String,
            default: '50px',
        },
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
        // TODO 支持这个属性
        scrollAnchoring: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        ismp: !!ismp,
        mpScrollLeft: '0px',
        mpScrollTop: '0px',
        mpScrollIntoView: '',
    }),
    watch: {
        scrollX() {
            this._upperLowerStatusX = 'initial'
            this._upperLowerStatusY = 'initial'
            this._checkUpperLower()
        },
        scrollY() {
            this._upperLowerStatusX = 'initial'
            this._upperLowerStatusY = 'initial'
            this._checkUpperLower()
        },
        upperThreshold(pos) {
            const posVal = this.convertPosVal(pos)
            this._upperThreshold = posVal
            this._checkUpperLower()
        },
        lowerThreshold(pos) {
            const posVal = this.convertPosVal(pos)
            this._lowerThreshold = posVal
            this._checkUpperLower()
        },
        scrollTop(pos) {
            const posVal = this.convertPosVal(pos)
            this.scrollTo(posVal, 'y')
        },
        scrollLeft(pos) {
            const posVal = this.convertPosVal(pos)
            this.scrollTo(posVal, 'x')
        },
        scrollIntoView(id) {
            if (ismp) return
            if (!/^[_a-zA-Z][-_a-zA-Z0-9:]*$/.test(id)) {
                console.info(`[KScrollView] "${id}" is not a valid id.`)
                return
            }
            if (ismp) {
                this.mpScrollIntoView = id
            } else {
                const relRect = this.$refs.main.getBoundingClientRect()
                const rect = this.$refs.content.querySelector('#' + id).getBoundingClientRect()
                if (this.scrollX) {
                    this.scrollTo(this.$refs.main.scrollLeft + rect.left - relRect.left, 'x')
                }
                if (this.scrollY) {
                    this.scrollTo(this.$refs.main.scrollTop + rect.top - relRect.top, 'y')
                }
            }
        },
    },
    mounted() {
        this._upperLowerStatusX = 'initial'
        this._upperLowerStatusY = 'initial'
        this._upperThreshold = 50
        this._lowerThreshold = 50
        const posValX = this.convertPosVal(this.scrollLeft)
        this.scrollTo(posValX, 'x')
        const posValY = this.convertPosVal(this.scrollTop)
        this.scrollTo(posValY, 'y')
    },
    methods: {
        convertPosVal(pos) {
            if (typeof pos === 'number') return pos
            const posStr = String(pos)
            if (/[-.0-9]+(px)?/.test(posStr)) {
                return ismp ? posStr : parseFloat(posStr, 10)
            }
            console.error('[KScrollView] Positions only accept px values.')
        },
        scrollTo(val, direction) {
            if (ismp) {
                if (direction === 'x') {
                    this.mpScrollLeft = val
                } else if (direction === 'y') {
                    this.mpScrollTop = val
                }
                return
            }

            const main = this.$refs.main

            if (!this.scrollWithAnimation) {
                this._animationState = undefined
                if (direction === 'x') {
                    main.scrollLeft = val
                } else if (direction === 'y') {
                    main.scrollTop = val
                }
                return
            }

            if (val < 0) {
                val = 0
            } else if (direction === 'x' && val > main.scrollWidth - main.clientWidth) {
                val = main.scrollWidth - main.clientWidth
            } else if (direction === 'y' && val > main.scrollHeight - main.clientHeight) {
                val = main.scrollHeight - main.clientHeight
            }

            const dist = val - (direction === 'x' ? main.scrollLeft : main.scrollTop)
            const animationState = this._animationState = {
                a: 2 * dist / 90000,
                endTs: Date.now() + 300,
            }
            const aniFn = () => {
                const ts = Date.now()
                if (this._animationState !== animationState) return
                if (ts >= animationState.endTs) {
                    if (direction === 'x') {
                        main.scrollLeft = val
                    } else if (direction === 'y') {
                        main.scrollTop = val
                    }
                    this._animationState = undefined
                } else {
                    const t = animationState.endTs - ts
                    const d = 0.5 * animationState.a * t * t
                    if (direction === 'x') {
                        main.scrollLeft = val - d
                    } else if (direction === 'y') {
                        main.scrollTop = val - d
                    }
                    window.requestAnimationFrame(aniFn)
                }
            }
            window.requestAnimationFrame(aniFn)
        },

        mpScrollToUpper() {
            this.$emit('scrolltoupper')
        },
        mpScrollToLower() {
            this.$emit('scrolltolower')
        },

        scroll(e) {
            const main = this.$refs.main
            const detail = ismp ? e.detail : {
                scrollLeft: main.scrollLeft,
                scrollTop: main.scrollTop,
                scrollHeight: main.scrollHeight,
                scrollWidth: main.scrollWidth,
            }
            this.$emit('scroll', {detail})
            this._checkUpperLower()
        },
        _checkUpperLower() {
            if (ismp) return
            if (this._upperLowerScheduled) {
                return
            }
            this._upperLowerScheduled = () => {
                this._upperLowerScheduled = null
                const main = this.$refs.main
                this._checkUpperLowerWithOffset(main)
            }
            if (!this._upperLowerChecking) {
                this._upperLowerScheduled()
            }
        },
        _checkUpperLowerWithOffset(main) {
            if (main.scrollTop <= this._upperThreshold) {
                if (this._upperLowerStatusY !== 'initial' && this._upperLowerStatusY !== 'upper') {
                    this.$emit('scrolltoupper')
                }
                this._upperLowerStatusY = 'upper'
            } else if (main.scrollTop >= main.scrollHeight - main.clientHeight - this._lowerThreshold) {
                if (this._upperLowerStatusY !== 'initial' && this._upperLowerStatusY !== 'lower') {
                    this.$emit('scrolltolower')
                }
                this._upperLowerStatusY = 'lower'
            } else {
                this._upperLowerStatusY = 'center'
            }
            if (main.scrollLeft <= this._upperThreshold) {
                if (this._upperLowerStatusX !== 'initial' && this._upperLowerStatusX !== 'upper') {
                    this.$emit('scrolltoupper')
                }
                this._upperLowerStatusX = 'upper'
            } else if (main.scrollLeft >= main.scrollWidth - main.clientWidth - this._lowerThreshold) {
                if (this._upperLowerStatusX !== 'initial' && this._upperLowerStatusX !== 'lower') {
                    this.$emit('scrolltolower')
                }
                this._upperLowerStatusX = 'lower'
            } else {
                this._upperLowerStatusX = 'center'
            }
        },
        touchstart(e) {
            this._animationState = undefined
            this._x = e.touches[0].clientX
            this._y = e.touches[0].clientY
            this._noBubble = null
            this._preventDefault = false
        },
        touchend() {
            this._noBubble = false
        },
        touchmove(e) {
            if (this._noBubble === null && this.scrollY) {
                if (Math.abs(this._y - e.touches[0].clientY) / Math.abs(this._x - e.touches[0].clientX) > 1) {
                    this._noBubble = true
                } else {
                    this._noBubble = false
                    this._preventDefault = true
                }
                if (this._isScrollingOnBoundary(e)) {
                    this._noBubble = false
                }
            }

            if (this._noBubble === null && this.scrollX) {
                if (Math.abs(this._x - e.touches[0].clientX) / Math.abs(this._y - e.touches[0].clientY) > 1) {
                    this._noBubble = true
                } else {
                    this._noBubble = false
                    this._preventDefault = true
                }
                if (this._isScrollingOnBoundary(e)) {
                    this._noBubble = false
                }
            }

            if (this._noBubble) {
                e.stopPropagation()
            }
            if (this._preventDefault) {
                e.preventDefault()
            }
        },


    }
}
</script>
