<template>
  <KView
    v-if="!ismp"
    class="weui-slider-box" >
    <KView class="weui-slider">
      <KView
        ref="trackbar"
        class="weui-slider__inner" >
        <KView
          :style="{width: stopPosition + '%'}"
          class="weui-slider__track" />
        <KView
          :style="{left: stopPosition + '%'}"
          class="weui-slider__handler"
          @mouseenter.native="handleMouseEnter"
          @mouseleave.native="handleMouseLeave"
          @mousedown.native="onButtonDown"
          @touchstart.native="onButtonDown"
        />
      </KView>
    </KView>
    <KView
      v-if="showValue"
      class="weui-slider-box__value">{{ stopPosition }}</KView>
  </KView>
  <wx-slider
    v-else
    :min="min"
    :max="max"
    :show-value="showValue"
    :value="value"
    :disabled="disabled"
    :step="step"
    @change="sliderChange"
    @changing="sliderChanging" />
</template>

<script>
import {ismp} from '@utils/util'

export default {
    name: 'KSlider',
    props: {
        showValue: {
            type: Boolean
        },
        value: {
            type: Number
        },
        disabled: {
            type: Boolean,
            default: false
        },
        step: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        }
    },
    data() {
        return {
            startPosition: 0,
            startX: 0,
            sliderSize: 1,
            newPosition: 0,
            stopPosition: this.value || 0,
            ismp
        }
    },
    computed: {
    // 计算实际比例
    // currentPosition() {
    //   return `${((this.stopPosition - this.min) / (this.max - this.min)) *
    //     100}%`;
    // },
        currentPercentage() {
            return (this.stopPosition - this.min) / (this.max - this.min)
        },
        precision() {
            const precisions = [this.min, this.max, this.step].map(item => {
                const decimal = ('' + item).split('.')[1]
                return decimal ? decimal.length : 0
            })
            return Math.max.apply(null, precisions)
        }
    },
    mounted() {
        console.log('初始化')
    },
    methods: {
        handleMouseEnter() {},
        handleMouseLeave() {},
        onButtonDown(event) {
            if (this.disabled) return
            event.preventDefault()
            this.onDragStart(event)
            document.body.addEventListener('mousemove', this.onDragging)
            document.body.addEventListener('touchmove', this.onDragging)
            document.body.addEventListener('mouseup', this.onDragEnd)
            document.body.addEventListener('touchend', this.onDragEnd)
        },
        onDragStart(event) {
            this.dragging = true
            this.isClick = true
            if (event.type === 'touchstart') {
                event.clientY = event.touches[0].clientY
                event.clientX = event.touches[0].clientX
            }

            this.startX = event.clientX

            this.totalLength = this.$refs.trackbar.$el.clientWidth
            this.startPosition = parseInt(this.totalLength * this.currentPercentage)

            this.newPosition = this.startPosition
        },
        onDragging(event) {
            if (this.dragging) {
                this.isClick = false
                let diff = 0
                if (event.type === 'touchmove') {
                    event.clientY = event.touches[0].clientY
                    event.clientX = event.touches[0].clientX
                }
                this.currentX = event.clientX
                diff = ((this.currentX - this.startX) / this.sliderSize)
                this.totalLength = this.$refs.trackbar.$el.clientWidth
                this.newPosition = (this.startPosition + diff) / this.totalLength * 100

                this.setPosition(this.newPosition)
            }
        },
        onDragEnd() {
            if (this.dragging) {
                this.dragging = false
                document.body.removeEventListener('mousemove', this.onDragging)
                document.body.removeEventListener('touchmove', this.onDragging)
                document.body.removeEventListener('mouseup', this.onDragEnd)
                document.body.removeEventListener('touchend', this.onDragEnd)
            }
        },
        setPosition(pointPos) {
            if (pointPos === null || isNaN(pointPos)) return
            if (pointPos < 0) {
                pointPos = 0
            } else if (pointPos > 100) {
                pointPos = 100
            }
            const lengthPerStep = 100 / ((this.max - this.min) / this.step)
            const steps = Math.round(pointPos / lengthPerStep)
            let value =
        (steps * lengthPerStep * (this.max - this.min)) / 100 + this.min
            value = parseFloat(value.toFixed(this.precision))

            this.stopPosition = value
            this.$emit('input', value)
        },
        sliderChange(event) {
            this.$emit('change', event)
        },
        sliderChanging(event) {
            this.$emit('changing', event)
        }
    },
}
</script>

