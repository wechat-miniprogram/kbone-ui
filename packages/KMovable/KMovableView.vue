<template>
  <wx-movable-view
    v-if="ismp"
    :x="x"
    :y="y"
    :direction="direction"
    :out-of-bounds="outOfBounds"
    :inertia="inertia"
    :friction="friction"
    :damping="damping"
    :scale="scale"
    :animation="animation"
    :disabled="disabled"
    :scale-min="scaleMin"
    :scale-max="scaleMax"
    :scale-value="scaleValue"
    @change="bindchange"
    @scale="bindscale"
    @htouchmove="bindhtouchmove"
    @vtouchmove="bindvtouchmove"
  >
    <slot />
  </wx-movable-view>
  <div
    v-else
    class="k-movable-view"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchCancelOrEnd"
    @touchcancel="handleTouchCancelOrEnd"
  >
    <slot />
  </div>
</template>

<script>
import {ismp} from '@utils/util'
import {
    Decline,
    Friction,
    Spring2D,
    transformStrToNumber,
    createTouchTrack,
    subtract,
    createAnimation,
    getElementOffsetX,
    getElementOffsetY,
} from './utils'
import KView from '../KView'

const MOVABLE_VIEW_SCALE_MIN = 0.5
const MOVABLE_VIEW_SCALE_MAX = 10

export default {
    name: 'KMovableView',
    components: {KView},
    props: {
        x: {
            type: [Number, String],
            default: 0,
        },
        y: {
            type: [Number, String],
            default: 0,
        },
        direction: {
            type: String,
            default: 'none',
        },
        outOfBounds: {
            type: Boolean,
            default: false,
        },
        inertia: {
            type: Boolean,
            default: false,
        },
        friction: {
            type: Number,
            default: 2,
        },
        damping: {
            type: Number,
            default: 20,
        },
        scale: {
            type: Boolean,
            default: false,
        },
        animation: {
            type: Boolean,
            default: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        scaleMin: {
            type: Number,
            default: MOVABLE_VIEW_SCALE_MIN,
        },
        scaleMax: {
            type: Number,
            default: MOVABLE_VIEW_SCALE_MAX,
        },
        scaleValue: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            ismp,
            touchTrack: createTouchTrack(),
            isKBoneUIMovableView: true,
            areaWidth: 0,
            areaHeight: 0,
            offset: {x: 0, y: 0},
            scaleOffset: {x: 0, y: 0},
            translateX: 0,
            translateY: 0,
            scaling: 1,
            oldScale: 1,
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0,
            springModel: new Spring2D(1, (this.damping ** 2) * 9 / 40, this.damping),
            frictionModel: new Friction(1, this.friction),
            declineX: new Decline(),
            declineY: new Decline(),
            touchInfo: {
                historyX: [0, 0],
                historyY: [0, 0],
                historyT: [0, 0],
            },
        }
    },
    computed: {
        xMove() {
            return !!(this.direction === 'horizontal' || this.direction === 'all')
        },
        yMove() {
            return !!(this.direction === 'vertical' || this.direction === 'all')
        },
        style() {
            return {}
        }
    },
    watch: {
        style: '',
        scaleValue: 'setScaleValue',
        disabled: 'setDisabled',
        scaleMin: 'setScaleMinOrMax',
        scaleMax: 'setScaleMinOrMax',
        scale: 'setScale',
        x: 'setX',
        y: 'setY',
    },
    mounted() {
        if (ismp) return
        this.$el.setAttribute('aria-dropeffect', 'move')
        this.$el.setAttribute('aria-label', '可移动')

        this._x = 0
        this._y = 0

        if (this.friction <= 0) this.friction = 2
        this.frictionModel.reconfigure(1, this.friction)

        this.springModel.reconfigure(1, (this.damping ** 2) * 9 / 40, this.damping)

        this.$el.style.transformOrigin = 'center'

        this.ignoredStyles = ['transform-origin', 'will-change', 'transform', '-webkit-transform']
        this.previousStyle = null

        const observer = new MutationObserver(mutationLists => {
            mutationLists.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    this.updateWidthAndHeight()
                    this.updateBoundary()
                    this.revise()
                } else if (mutation.attributeName === 'style') {
                    if (this.styleChanged()) {
                        this.setTransform(this.translateX, this.translateY, this.scaling, '', true, false)
                        this.$el.style.transformOrigin = 'center'

                        this.updateWidthAndHeight()
                        this.updateBoundary()
                        this.revise()
                    }
                }
            })
        })
        observer.observe(this.$el, {
            attributes: true,
            attributeFilter: ['style', 'class'],
        })

        if (this.x) this.setX(this.x)
        if (this.y) this.setY(this.y)
        if (this.scaleMin || this.scaleMax) this.setScaleMinOrMax()
        if (this.scale) this.setScale()

        this.getParentMovableArea()
        if (this.parentArea) this.parentArea.$emit('k-movable-view-changed')
    },
    detached() {
        if (this.parentArea) this.parentArea.$emit('k-movable-view-changed')
    },
    methods: {
        moveAnimationFrame: (() => {
            let drawing = false
            return func => {
                if (!drawing) {
                    drawing = true
                    requestAnimationFrame(() => {
                        func()
                        drawing = false
                    })
                }
            }
        })(),
        getParentMovableArea() {
            let compo = this
            while (compo && compo._isVue) {
                if (compo.isKBoneUIMovableArea) break
                compo = compo.$parent
            }
            this.parentArea = compo
        },
        styleChanged() {
            if (ismp) return
            const newStyle = Array.from(this.$el.style)
                .filter(key => this.ignoredStyles.indexOf(key) === -1)
                .sort()
                .map(key => key + ':' + this.$el.style[key])
                .join(';')
            const styleChanged = this.previousStyle && this.previousStyle !== newStyle
            this.previousStyle = newStyle
            return styleChanged
        },
        setParent(parent) {
            if (ismp) return
            if (this.frictionAnimation) this.frictionAnimation = this.frictionAnimation.cancel()
            if (this.springAnimation) this.springAnimation = this.springAnimation.cancel()

            const scale = this.scale ? this.scaleValue : 1

            this.parentArea = parent

            this.areaWidth = this.parentArea.width || 0
            this.areaHeight = this.parentArea.height || 0

            this.updateOffset()
            this.updateWidthAndHeight(scale)
            this.updateBoundary()

            this.translateX = this._x + this.scaleOffset.x
            this.translateY = this._y + this.scaleOffset.y

            const {x, y} = this.getLimitXY(this.translateX, this.translateY)

            this.setTransform(x, y, scale, '', true)

            this.updateOldScale(scale)
        },
        setScaleMinOrMax() {
            if (ismp) return
            if (!this.scale) return false

            this.updateScale(this.scaling, true)
            this.updateOldScale(this.scaling)
        },
        setX(x) {
            if (ismp) return
            let _x = x
            if (typeof _x === 'string') _x = transformStrToNumber(_x)
            else if (typeof _x !== 'number') _x = 0

            if (!this.xMove) {
                this._x = _x
                return
            }
            if (_x + this.scaleOffset.x === this.translateX) {
                this._x = this.translateX
                return
            }

            if (this.springAnimation) this.springAnimation = this.springAnimation.cancel()
            this.animationTo(_x + this.scaleOffset.x, this._y + this.scaleOffset.y, this.duringScaleValueAnimation ? this.scaleValue : this.scaling)
            this._x = _x
        },
        setY(y) {
            if (ismp) return
            let _y = y
            if (typeof _y === 'string') _y = transformStrToNumber(_y)
            else if (typeof _y !== 'number') _y = 0

            if (!this.yMove) {
                this._y = _y
                return
            }
            if (_y + this.scaleOffset.y === this.translateY) {
                this._y = this.translateY
                return
            }

            if (this.springAnimation) this.springAnimation = this.springAnimation.cancel()
            this.animationTo(this._x + this.scaleOffset.x, _y + this.scaleOffset.y, this.duringScaleValueAnimation ? this.scaleValue : this.scaling)
            this._y = _y
        },
        handleTouchStart(e) {
            this.touchTrack.onTouchEvent(e)
            if (this.isScaling || this.disabled) return

            if (this.frictionAnimation) this.frictionAnimation = this.frictionAnimation.cancel()
            if (this.springAnimation) this.springAnimation = this.springAnimation.cancel()

            this.touchInfo.historyX = [0, 0]
            this.touchInfo.historyY = [0, 0]
            this.touchInfo.historyT = [0, 0]

            if (this.xMove) {
                this.baseX = this.translateX
            }
            if (this.yMove) {
                this.baseY = this.translateY
            }
            this.$el.style.willChange = 'transform'
            this.checkCanMove = null
            this.firstMoveDirection = null
            this.isTouching = true
        },
        handleTouchMove(_e) {
            const e = this.touchTrack.onTouchEvent(_e)
            if (this.isScaling || this.disabled || !this.isTouching) return

            let x = this.translateX
            let y = this.translateY

            if (this.firstMoveDirection === null) {
                this.firstMoveDirection = Math.abs(e.touchDetail.dx / e.touchDetail.dy) > 1 ? 'htouchmove' : 'vtouchmove'
            }

            if (this.xMove) {
                x = e.touchDetail.dx + this.baseX

                this.touchInfo.historyX.shift()
                this.touchInfo.historyX.push(x)

                if (!this.yMove && this.checkCanMove === null) {
                    if (Math.abs(e.touchDetail.dx / e.touchDetail.dy) > 1) {
                        this.checkCanMove = false
                    } else {
                        this.checkCanMove = true
                    }
                }
            }
            if (this.yMove) {
                y = e.touchDetail.dy + this.baseY

                this.touchInfo.historyY.shift()
                this.touchInfo.historyY.push(y)

                if (!this.xMove && this.checkCanMove === null) {
                    if (Math.abs(e.touchDetail.dy / e.touchDetail.dx) > 1) {
                        this.checkCanMove = false
                    } else {
                        this.checkCanMove = true
                    }
                }
            }

            this.touchInfo.historyT.shift()
            this.touchInfo.historyT.push(e.touchDetail.timeStamp)

            if (!this.checkCanMove) {
                e.preventDefault()

                let source = 'touch'
                if (x < this.minX) {
                    if (this.outOfBounds) {
                        source = 'touch-out-of-bounds'
                        x = this.minX - this.declineX.x(this.minX - x)
                    } else {
                        x = this.minX
                    }
                } else if (x > this.maxX) {
                    if (this.outOfBounds) {
                        source = 'touch-out-of-bounds'
                        x = this.maxX + this.declineX.x(x - this.maxX)
                    } else {
                        x = this.maxX
                    }
                }
                if (y < this.minY) {
                    if (this.outOfBounds) {
                        source = 'touch-out-of-bounds'
                        y = this.minY - this.declineY.x(this.minY - y)
                    } else {
                        y = this.minY
                    }
                } else if (y > this.maxY) {
                    if (this.outOfBounds) {
                        source = 'touch-out-of-bounds'
                        y = this.maxY + this.declineY.x(y - this.maxY)
                    } else {
                        y = this.maxY
                    }
                }

                this.moveAnimationFrame(() => {
                    this.setTransform(x, y, this.scaling, source)
                })
            }

            const firstMoveDirection = this.firstMoveDirection
            const event = {
                touches: e.touches || {},
                changedTouches: e.changedTouches || {}
            }
            this.$emit(firstMoveDirection, event)
        },
        handleTouchCancelOrEnd(_e) {
            this.touchTrack.onTouchEvent(_e)
            if (this.isScaling || this.disabled || !this.isTouching) return

            this.$el.style.willChange = 'auto'
            this.isTouching = false

            if (this.checkCanMove) return

            if (this.revise('out-of-bounds')) return

            if (this.inertia) {
                const v_x = (this.touchInfo.historyX[1] - this.touchInfo.historyX[0]) * 1000 / (this.touchInfo.historyT[1] - this.touchInfo.historyT[0])
                const v_y = (this.touchInfo.historyY[1] - this.touchInfo.historyY[0]) * 1000 / (this.touchInfo.historyT[1] - this.touchInfo.historyT[0])

                this.frictionModel.setV(v_x, v_y)
                this.frictionModel.setS(this.translateX, this.translateY)
                const _deltaX = this.frictionModel.delta().x
                const _deltaY = this.frictionModel.delta().y
                let _x = _deltaX + this.translateX
                let _y = _deltaY + this.translateY

                if (_x < this.minX) {
                    _x = this.minX
                    _y = this.translateY + (this.minX - this.translateX) * _deltaY / _deltaX
                } else if (_x > this.maxX) {
                    _x = this.maxX
                    _y = this.translateY + (this.maxX - this.translateX) * _deltaY / _deltaX
                }
                if (_y < this.minY) {
                    _y = this.minY
                    _x = this.translateX + (this.minY - this.translateY) * _deltaX / _deltaY
                } else if (_y > this.maxY) {
                    _y = this.maxY
                    _x = this.translateX + (this.maxY - this.translateY) * _deltaX / _deltaY
                }
                this.frictionModel.setEnd(_x, _y)

                this.frictionAnimation = createAnimation(this.frictionModel, () => {
                    const {x, y} = this.frictionModel.s()
                    this.setTransform(x, y, this.scaling, 'friction')
                }, () => {
                    if (this.frictionAnimation) this.frictionAnimation = this.frictionAnimation.cancel()
                })
            }
        },
        setDisabled(val) {
            if (ismp) return
            if (val === false) {
                this.handleTouchStart()
            }
        },

        setScaleValue(newVal) {
            if (ismp) return
            if (!this.scale) return false

            newVal = this.adjustScale(newVal)

            this.duringScaleValueAnimation = true
            this.updateScale(newVal, true, () => {
                this.duringScaleValueAnimation = false
            })
            this.updateOldScale(newVal)
        },

        getLimitXY(x, y) {
            let outOfBounds = false

            if (x > this.maxX) {
                x = this.maxX
                outOfBounds = true
            } else if (x < this.minX) {
                x = this.minX
                outOfBounds = true
            }

            if (y > this.maxY) {
                y = this.maxY
                outOfBounds = true
            } else if (y < this.minY) {
                y = this.minY
                outOfBounds = true
            }

            return {x, y, outOfBounds}
        },

        updateOffset() {
            this.offset.x = getElementOffsetX(this.$el, this.parentArea.$el)
            this.offset.y = getElementOffsetY(this.$el, this.parentArea.$el)
        },

        updateWidthAndHeight(scale) {
            scale = scale || this.scaling
            scale = this.adjustScale(scale)

            const rect = this.$el.getBoundingClientRect()

            this.height = rect.height / this.scaling
            this.width = rect.width / this.scaling

            const viewHeight = this.height * scale
            const viewWidth = this.width * scale

            this.scaleOffset.x = (viewWidth - this.width) / 2
            this.scaleOffset.y = (viewHeight - this.height) / 2
        },

        updateBoundary() {
            const x1 = 0 - this.offset.x + this.scaleOffset.x
            const x2 = this.areaWidth - this.width - this.offset.x - this.scaleOffset.x
            this.minX = Math.min(x1, x2)
            this.maxX = Math.max(x1, x2)

            const y1 = 0 - this.offset.y + this.scaleOffset.y
            const y2 = this.areaHeight - this.height - this.offset.y - this.scaleOffset.y
            this.minY = Math.min(y1, y2)
            this.maxY = Math.max(y1, y2)
        },

        beginScale() {
            this.isScaling = true
        },

        endScale() {
            this.isScaling = false

            this.updateOldScale(this.scaling)
        },

        setScale(scale) {
            if (!this.scale) return

            scale *= this.oldScale

            this.beginScale()
            this.updateScale(scale)
        },

        setTransformed(isTransformed) {
            this.isTransformed = isTransformed
        },

        updateScale(scale, needAnimation, cb) {
            if (!this.scale) return

            scale = this.adjustScale(scale)

            if (!this.isTransformed) {
                this.updateWidthAndHeight(scale)
                this.updateBoundary()
            }

            const {x, y} = this.getLimitXY(this.translateX, this.translateY)

            if (needAnimation) {
                this.animationTo(x, y, scale, '', true, true, cb)
            } else {
                this.moveAnimationFrame(() => {
                    this.setTransform(x, y, scale, '', true, true)
                })
            }
        },

        updateOldScale(scale) {
            this.oldScale = scale
        },

        adjustScale(scale) {
            scale = Math.max(MOVABLE_VIEW_SCALE_MIN, this.scaleMin, scale)
            scale = Math.min(MOVABLE_VIEW_SCALE_MAX, this.scaleMax, scale)

            return scale
        },

        animationTo(x, y, scale, source, notTriggerChange, needTriggerScale, cb) {
            if (this.frictionAnimation) this.frictionAnimation = this.frictionAnimation.cancel()
            if (this.springAnimation) this.springAnimation = this.springAnimation.cancel()
            if (!this.xMove) x = this.translateX
            if (!this.yMove) y = this.translateY
            if (!this.scale) scale = this.scaling

            const obj = this.getLimitXY(x, y)
            x = obj.x
            y = obj.y

            if (this.animation) {
                this.springModel._springX._solution = null
                this.springModel._springY._solution = null
                this.springModel._springScale._solution = null
                this.springModel._springX._endPosition = this.translateX
                this.springModel._springY._endPosition = this.translateY
                this.springModel._springScale._endPosition = this.scaling
                this.springModel.setEnd(x, y, scale, 1)

                this.springAnimation = createAnimation(this.springModel, () => {
                    const options = this.springModel.x()
                    const {x, y} = options
                    const _scale = scale === 1 ? 1 : options.scale
                    this.setTransform(x, y, _scale, source, notTriggerChange, needTriggerScale)
                }, () => {
                    if (this.springAnimation) this.springAnimation = this.springAnimation.cancel()
                    if (cb && typeof cb === 'function') cb()
                })
            } else {
                this.setTransform(x, y, scale, source, notTriggerChange, needTriggerScale)
            }
        },

        revise(source) {
            const {x, y, outOfBounds} = this.getLimitXY(this.translateX, this.translateY)

            if (outOfBounds) {
                this.animationTo(x, y, this.scaling, source)
            }

            return outOfBounds
        },

        setTransform(x, y, scale, source = '', notTriggerChange, needTriggerScale) {
            if (x === null || x.toString() === 'NaN' || typeof x !== 'number') x = this.translateX || 0
            if (y === null || y.toString() === 'NaN' || typeof y !== 'number') y = this.translateY || 0
            x = Number(x.toFixed(1))
            y = Number(y.toFixed(1))
            scale = Number(scale.toFixed(3))

            const changeX = subtract(x, this.scaleOffset.x)
            const changeY = subtract(y, this.scaleOffset.y)
            if ((this.translateX !== x || this.translateY !== y) && !notTriggerChange) {
                this.$emit('change', {
                    detail: {
                        x: changeX,
                        y: changeY,
                        source,
                    },
                })
            }

            if (!this.scale) scale = this.scaling

            scale = this.adjustScale(scale)

            scale = +scale.toFixed(3)
            if (needTriggerScale && scale !== this.scaling) {
                this.$emit('scale', {
                    detail: {
                        scale,
                        x: changeX,
                        y: changeY,
                    },
                })
            }

            const transform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ')'
            this.$el.style.transform = transform
            this.$el.style.webkitTransform = transform

            this.translateX = x
            this.translateY = y
            this.scaling = scale
            if (this.containerArgs) {
                const pos = this.containerArgs.position
                pos.left = x
                pos.top = y
                this.updatePositioningContainer({
                    position: pos
                })
            }
        },

        bindchange(...args) {
            this.$emit('change', ...args)
        },
        bindscale(...args) {
            this.$emit('scale', ...args)
        },
        bindhtouchmove(...args) {
            this.$emit('htouchmove', ...args)
        },
        bindvtouchmove(...args) {
            this.$emit('vtouchmove', ...args)
        }
    }
}
</script>

<style lang="less" scoped>
.wx-movable-view {
    height: 100%;
    width: 100%;
}
.k-movable-view {
  display: inline-block;
  width: 10px;
  height: 10px;
  top: 0px;
  left: 0px;
  position: absolute;

  &[hidden]{
    display: none;
  }
}
</style>
