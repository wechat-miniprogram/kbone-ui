<template>
  <div
    :hoverStartTime="hoverStartTime"
    :hoverStayTime="hoverStayTime"
    :hoverStopPropagation="hoverStopPropagation"
    :hoverClass="hoverClass"
    @click="clickHander"
    @touchstart="touchStartHander"
    @touchend="touchEndHander"
    @touchmove="touchMoveHander"
  >
    <slot/>
  </div>
</template>

<script>
export default {
    name: 'KView',
    props: {
        hoverStartTime: {
            type: Number,
            value: 50,
            public: true
        },
        hoverStayTime: {
            type: Number,
            value: 400,
            public: true
        },
        hoverStopPropagation: {
            type: Boolean,
            value: false,
        },
        hoverClass: {
            type: String,
            value: ''
        }
    },
    methods: {
        clickHander(event) {
            this.$emit('click', event)
        },
        touchStartHander(event) {
            this.$emit('touchstart', event)
        },
        touchEndHander(event) {
            this.$emit('touchend', event)
        },
        touchMoveHander(event) {
            this.$emit('touchmove', event)
        }
    }
}
</script>
