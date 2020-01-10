<template>
  <div
    class="k-movable-area"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <slot />
  </div>
</template>

<script>
import KView from '../KView'
import {
    getLength
} from './utils'


const isAncestor = (node, ancestor) => {
    const parentNode = node.parentNode
    if (!parentNode) return false
    if (parentNode === document.body || parentNode === document) return false
    if (parentNode === ancestor.$el) return true
    else return isAncestor(parentNode, ancestor)
}

const getMovableView = (node, views = []) => {
    for (let i = 0, len = views.length; i < len; i++) {
        if (node === views[i].$el || isAncestor(node, views[i])) {
            return views[i]
        }
    }
    return undefined
}

export default {
    name: 'KMovableArea',
    components: {KView},
    props: {
        scaleArea: {
            type: Boolean,
            value: false,
        },
    },
    data() {
        return {
        }
    },
    watch: {
    },
    created() {
        this.isKBoneUIMovableArea = true
        this.$on('k-movable-view-changed', this.movableViewChanged)

        this.gapV = {x: null, y: null}
        this.pinchStartLen = null
    },
    mounted() {
        this.isMounted = true

        const observer = new MutationObserver(mutationLists => {
            mutationLists.forEach(mutation => {
                if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                    this.performUpdateIfNecessary()
                }
            })
        })
        observer.observe(this.$el, {
            attributes: true,
            attributeFilter: ['style', 'class'],
        })
    },
    methods: {
        movableViewChanged() {
            const views = this.views = []
            const dfs = (elem) => {
                for (let i = 0; i < elem.$children.length; i++) {
                    const child = elem.$children[i]
                    if (child._isVue) {
                        if (child.isKBoneUIMovableView) views.push(child)
                        else dfs(child)
                    }
                }
            }
            dfs(this)
            this.updateArea()
            return false
        },
        updateArea() {
            const {height, width} = this.getWidthAndHeight()

            this.height = height
            this.width = width

            const views = this.views

            views.forEach(v => {
                v.setParent(this)
            })
            return true
        },
        getWidthAndHeight() {
            const style = window.getComputedStyle(this.$el)
            const rect = this.$el.getBoundingClientRect()

            const h = ['Left', 'Right'].map((item) =>
                parseFloat(style['border' + item + 'Width']) +
                parseFloat(style['padding' + item]))

            const v = ['Top', 'Bottom'].map((item) =>
                parseFloat(style['border' + item + 'Width']) +
                parseFloat(style['padding' + item]))

            return {
                height: rect.height - v[0] - v[1],
                width: rect.width - h[0] - h[1]
            }
        },

        handleTouchStart(e) {
            const touches = e.touches

            if (!touches) return

            const len = touches.length

            if (len > 1) {
                const v = {
                    x: touches[1].pageX - touches[0].pageX,
                    y: touches[1].pageY - touches[0].pageY
                }

                this.pinchStartLen = getLength(v)
                this.gapV = v

                if (!this.scaleArea) {
                    const _scaleMovableView0 = getMovableView(touches[0].target, this.views)
                    const _scaleMovableView1 = getMovableView(touches[1].target, this.views)
                    if (!_scaleMovableView0 || _scaleMovableView0 !== _scaleMovableView1) {
                        this.scaleMovableView = null
                    } else {
                        this.scaleMovableView = _scaleMovableView0
                    }
                }
            }
        },

        handleTouchMove(e) {
            const touches = e.touches

            if (!touches) return

            const len = touches.length

            if (len > 1) {
                e.preventDefault()

                const v = {
                    x: touches[1].pageX - touches[0].pageX,
                    y: touches[1].pageY - touches[0].pageY
                }

                if (this.gapV.x !== null && this.pinchStartLen > 0) {
                    const scale = getLength(v) / this.pinchStartLen

                    this.updateScale(scale)
                }

                this.gapV = v
            }
        },

        handleTouchEnd(e) {
            const touches = e.touches

            if (touches && touches.length) return

            if (!e.changedTouches) return

            this.gapV.x = 0
            this.gapV.y = 0
            this.pinchStartLen = null

            if (this.scaleArea) {
                this.views.forEach(v => {
                    v.endScale()
                })
            } else if (this.scaleMovableView) {
                this.scaleMovableView.endScale()
            }
        },

        updateScale(scale) {
            if (scale && scale !== 1) {
                if (this.scaleArea) {
                    this.views.forEach(v => {
                        v.setScale(scale)
                    })
                } else if (this.scaleMovableView) {
                    this.scaleMovableView.setScale(scale)
                }
            }
        },

        performUpdateIfNecessary() {
            const rect = this.$el.getBoundingClientRect() || {}
            const offsetWidth = this.$el.offsetWidth
            const offsetHeight = this.$el.offsetHeight
            const isTransformed = rect.width !== offsetWidth || rect.height !== offsetHeight

            if (offsetWidth !== this.offsetWidth || offsetHeight !== this.offsetHeight) {
                this.updateArea()
            }

            if (this.views) {
                this.views.forEach(view => {
                    if (typeof view.setTransformed === 'function') {
                        view.setTransformed(isTransformed)
                    }
                })
            }

            this.offsetWidth = offsetWidth
            this.offsetHeight = offsetHeight
        },
    }
}
</script>

<style lang="less">
.k-movable-area {
  display: block;
  position: relative;
  width: 10px;
  height: 10px;

  &[hidden]{
    display: none;
  }
}
</style>
