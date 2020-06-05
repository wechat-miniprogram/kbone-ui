<template>
  <wx-picker-view-column v-if="ismp">
    <slot/>
  </wx-picker-view-column>
  <KView
    v-else
    ref="container"
    class="weui-picker__group">
    <KView class="weui-picker__mask"/>
    <KView
      ref="indicator"
      class="weui-picker__indicator"/>
    <KView
      ref="content"
      class="weui-picker__content">
      <slot/>
    </KView>
  </KView>

</template>
<script>
import {ismp, findUpComponent} from '@utils/util'

export default {
    name: 'KPickerViewColumn',
    data() {
        return {
            itemHeight: 54,
            bodyHeight: 54 * 5,
            offset: 2,
            start: 0,
            end: 0,
            startTime: 0,
            translate: 0,
            points: [],
            parent: findUpComponent(this, 'KPickerView'),
            ismp
        }
    },
    mounted() {
        if (!ismp) {
            this.renderItems()
            const container = this.$refs.container.$el
            container.addEventListener('touchstart', this.startHandler, false)
            container.addEventListener('touchmove', this.moveHandler, false)
            container.addEventListener('touchend', this.endHandler, false)
            container.addEventListener('mousedown', this.startHandler, false)
            container.addEventListener('mousemove', this.moveHandler, false)
            container.addEventListener('mouseup', this.endHandler, false)
        }
    },
    beforeDestroy() {
        if (!ismp) {
            const container = this.$refs.container.$el
            container.removeEventListener('touchstart', this.startHandler, false)
            container.removeEventListener('touchmove', this.moveHandler, false)
            container.removeEventListener('touchend', this.endHandler, false)
            container.removeEventListener('mousedown', this.startHandler, false)
            container.removeEventListener('mousemove', this.moveHandler, false)
            container.removeEventListener('mouseup', this.endHandler, false)
        }
    },
    methods: {
        renderItems() {
            // 设置行高
            const children = this.$refs.content.$el.children
            this.itemHeight = this.$refs.indicator.$el.offsetHeight

            this.bodyHeight = 5 * this.itemHeight

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children.item(i)
                child.style.height = this.itemHeight + 'px'
                child.style.overflow = 'hidden'
            }
        },
        updatePos(index) {
            let diff = (this.offset - index) * this.itemHeight
            this.stop(diff,false) 
        },
        startHandler(event) {
            if (event.type === 'touchstart') {
                event.clientY = event.touches[0].clientY
            }
            this.start = event.clientY
            this.startTime = +new Date()
        },
        moveHandler(event) {
            if (!this.start) return false

            if (event.type === 'touchmove') {
                event.clientY = event.touches[0].clientY
            }
            this.end = event.clientY
            const diff = this.end - this.start

            this.setTransition(this.$refs.content.$el, 0)
            this.setTranslate(this.$refs.content.$el, this.translate + diff)

            this.startTime = +new Date()
            this.points.push({
                time: this.startTime,
                y: this.end
            })
            if (this.points.length > 40) {
                this.points.shift()
            }
            // 禁掉外部 webview 的滚动
            event.preventDefault()
            return false
        },
        endHandler(event) {
            if (!this.start) return
            if (event.type === 'touchend') {
                event.clientY = event.changedTouches[0].clientY
            }

            // touchend 松开手时, 记录该点和时间. 如果松开手时的时间, 距离上一次 move时的时间超过 100ms, 那么认为停止了, 不执行惯性滑动
            // 如果间隔时间在 100ms 内, 查找 100ms 内最近的那个点, 和松开手时的那个点, 计算距离和时间差, 算出速度
            // 速度乘以惯性滑动的时间, 例如 300ms, 计算出应该滑动的距离
            const endTime = new Date().getTime()
            const relativeY =
        this.$refs.container.$el.getBoundingClientRect().top +
        this.bodyHeight / 2
            this.end = event.clientY

            // 如果上次时间距离松开手的时间超过 100ms, 则停止了, 没有惯性滑动
            if (endTime - this.startTime > 100) {
                if (Math.abs(this.start - this.end) > 10) {
                    // 回到原始位置
                    this.stop(this.end - this.start)
                } else {
                    this.stop(relativeY - this.end)
                }
            } else if (Math.abs(this.start - this.end) > 10) {
                // 计算加速度
                const endPos = this.points.length - 1
                let startPos = endPos

                for (
                    let i = endPos;
                    i > 0 && this.startTime - this.points[i].time < 100;
                    i--
                ) {
                    startPos = i
                }

                if (startPos !== endPos) {
                    const ep = this.points[endPos]
                    const sp = this.points[startPos]
                    const t = ep.time - sp.time
                    const s = ep.y - sp.y
                    const v = s / t
                    const diff = v * 150 + (this.end - this.start) // 150ms 作为缓冲滑行时间
                    this.stop(diff)
                } else {
                    this.stop(0)
                }
            } else {
                this.stop(relativeY - this.end)
            }

            this.start = null
        },
        stop(diff, animation=true) {
            this.translate += diff

            this.translate =
        Math.round(this.translate / this.itemHeight) * this.itemHeight
            const max = this.getMax(this.offset, this.itemHeight)
            const min = this.getMin(
                this.offset,
                this.itemHeight,
                this.$refs.content.$el.children.length
            )

            if (this.translate > max) {
                this.translate = max
            }

            if (this.translate < min) {
                this.translate = min
            }

            // TODO 支持 disabled 选项
            const index = this.offset - this.translate / this.itemHeight
            if (animation) {
                this.setTransition(this.$refs.content.$el, 0.3)
            } else {
                this.setTransition(this.$refs.content.$el, 0)
            }
            
            this.setTranslate(this.$refs.content.$el, this.translate)

            // TODO 触发 KPickerView 的 onchagne 事件
            this.parent.change(index)
        },
        getMin(offset, rowHeight, length) {
            return -(rowHeight * (length - offset - 1))
        },
        getMax(offset, rowHeight) {
            return offset * rowHeight
        },
        setTranslate($target, diff) {
            $target.style.transform = `translate3d(0, ${diff}px, 0)`
            $target.style['-webkit-transform'] = `translate3d(0, ${diff}px, 0)`
        },
        setTransition($target, time) {
            $target.style.transition = `all ${time}s`
            $target.style['-webkit-transition'] = `all ${time}s`
        }
    },
}
</script>
