<template>
  <KView v-if="!ismp" class="weui-slider-box">
    <KView class="weui-slider-tap-area" ref="wrapper">
      <KView ref="trackbar" class="weui-slider-handle-wrapper">
        <KView
          :style="{left: getValueWidth(filteredValue,min,max)}"
          class="weui-slider-handle"
          ref="handle"
        />
        <KView class="weui-slider-thumb" :style="{
                width: getBlockSize(blockSize) + 'px',
                height: getBlockSize(blockSize) + 'px',
                'margin-left': '-' + getBlockSize(blockSize/2) + 'px',
                'margin-top': '-' + getBlockSize(blockSize/2) + 'px',
                left: getValueWidth(filteredValue,min,max),
                'background-color': blockColor
            }"></KView>
        <KView :style="{width: getValueWidth(filteredValue,min,max)}" class="weui-slider-track" />
        <KView class="weui-slider-step" ref="step"></KView>
      </KView>
    </KView>
    <KView v-if="showValue" class="weui-slider-value">{{ filteredValue }}</KView>
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
    @changing="sliderChanging"
  />
</template>

<script>
import {
    ismp,
    isDecimals,
    calcNumberOfDecimals, 
    getLimitNumber
} from "@utils/util";

export default {
  name: "KSlider",
  props: {
    showValue: {
      type: Boolean
    },
    value: {
      type: Number,
      default: 0
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
    },
    blockSize: {
      type: Number,
      default: 28
    },
    backgroundColor: {
        type: String,
        default: '#E9E9E9'
    },
    blockColor: {
        type: String,
        default: '#FFFFFF'
    }
  },
  data() {
    return {
      startPosition: undefined,
      currentValue: this.value,
      filteredValue: 0,
      startX: 0,
      sliderSize: 1,
      newPosition: 0,
      ismp
    };
  },
  computed: {},
  watch: {
    currentValue() {
      this.revalicateRange();
    }
  },
  mounted() {
    if (!ismp) {
      const handle = this.$refs.handle.$el;
      const wrapper = this.$refs.wrapper.$el;
      this.revalicateRange()
      handle.addEventListener("touchstart", this.onDragStart, false);
      wrapper.addEventListener("mousedown", this.onDragStart, false);
      handle.addEventListener("touchmove", this.onDragging, false);
      wrapper.addEventListener("mousemove", this.onDragging, false);
      handle.addEventListener("touchend", this.onDragEnd, false);
      wrapper.addEventListener("mouseup", this.onDragEnd, false);
    }
  },
  beforeDestroy() {
    if (!ismp) {
      const handle = this.$refs.handle.$el;
      const wrapper = this.$refs.wrapper.$el;
      handle.removeEventListener("touchstart", this.onDragStart, false);
      wrapper.removeEventListener("mousedown", this.onDragStart, false);
      handle.removeEventListener("touchmove", this.onDragging, false);
      wrapper.removeEventListener("mousemove", this.onDragging, false);
      handle.removeEventListener("touchend", this.onDragEnd, false);
      wrapper.removeEventListener("mouseup", this.onDragEnd, false);
    }
  },
  methods: {
    onDragStart(event) {
      if (this.disabled) return;
      this.dragging = true;
      this.startPosition = this.currentValue;
    },
    onDragging(event) {
      if (this.dragging) {
        if (event.type === "touchmove") {
          event.clientY = event.touches[0].clientY;
          event.clientX = event.touches[0].clientX;
        }
        console.log(event.clientX, event.clientY, event)

        this.updateHandle(event);
        this.$emit("changing", event);
      }
    },
    onDragEnd(event) {
      if (this.dragging) {
        this.dragging = false;
        if (event.type === "touchend") {
          event.clientY = event.changedTouches[0].clientY;
          event.clientX = event.changedTouches[0].clientX;
        }

        this.updateHandle(event);
        this.$emit("change", event);
        this.startPosition = undefined;
      }
    },
    updateHandle(event) {
      const stepEle = this.$refs.step.$el;
      const width = stepEle.offsetWidth;
      const startLoc = stepEle.getBoundingClientRect().left;

      // 算出当前鼠标距离左侧的位置
      let curValue =
        ((event.clientX - startLoc) * (this.max - this.min)) / width + this.min;
      curValue = this.filterValue(curValue);

      if (this.startPosition === undefined) {
        if (curValue === this.value) {
          return false;
        }
      } else if (curValue === this.startPosition) {
        return false;
      }

      console.log(curValue)
      // 改变位置
      this.currentValue = curValue;
      this.$emit("input", this.currentValue);
      return true;
    },
    filterValue(value) {
      if (value < this.min) {
        return this.min;
      }
      if (value > this.max) {
        return this.max;
      }
      const stepNum = Math.round((value - this.min) / this.step);
      return stepNum * this.step + this.min;
    },
    revalicateRange() {
      let filteredValue = this.filterValue(this.currentValue);
      if (
        isDecimals(this.min) ||
        isDecimals(this.max) ||
        isDecimals(this.step)
      ) {
        // 计算小数位
        const maxDecimalsNumber = Math.max(
          calcNumberOfDecimals(this.min),
          calcNumberOfDecimals(this.max),
          calcNumberOfDecimals(this.step)
        );
        filteredValue = +filteredValue.toFixed(maxDecimalsNumber);
      }
      this.filteredValue = filteredValue;
    },
    getValueWidth(value, min, max) {
      return ((value - min) * 100) / (max - min) + "%";
    },
    getValueTextWidth(min, max, step) {
      const maxIntegerNumber = Math.round(max).toString().length;
      const maxDecimalsNumber = Math.max(
        calcNumberOfDecimals(min),
        calcNumberOfDecimals(max),
        calcNumberOfDecimals(step)
      );

      return (
        (maxDecimalsNumber > 0
          ? maxIntegerNumber + maxDecimalsNumber
          : maxIntegerNumber) + "ch"
      );
    },
    getBlockSize(value){
        return getLimitNumber(value, 12, 28)
    },
    sliderChange(event){
        this.$emit('input',event.detail.value)
        this.$emit('change',event)
    },
    sliderChanging(event){
        this.$emit('input',event.detail.value)
        this.$emit('changing',event)
    }
  }
};
</script>

