<template>
  <wx-picker-view
    v-if="ismp"
    :indicator-style="indicatorStyle"
    :indicator-class="indicatorClass"
    :mask-style="maskStyle"
    :mask-class="maskClass">
    <slot/>
  </wx-picker-view>
  <KView
    v-else
    class="weui-picker__bd">
    <slot/>
  </KView>
</template>
<script>
import {ismp, findUpComponent, findDownComponent} from '@utils/util'

export default {
    name: 'KPickerView',
    props: {
        indicatorStyle: {
            type: String,
            value: '',
        },
        indicatorClass: {
            type: String,
            value: '',
        },
        maskStyle: {
            type: String,
            value: '',
        },
        maskClass: {
            type: String,
            value: '',
        },
        value: {
            type: Number,
            value: 0
        }
    },
    data() {
        return {
            ismp,
        }
    },
    mounted() {
        !ismp && this.setIndicatorStyle()
    },
    methods: {
        change(index) {
            this.$emit('input', index)
            this.$emit('change', index)
        },
        setIndicatorStyle() {
            const columns = findDownComponent(this, 'KPickerViewColumn')
            columns.forEach(col => {
                // 覆盖 indicator 样式
                col.$refs.indicator.$el.style = this.indicatorStyle
                col.renderItems()
                col.updatePos(this.value || 0)
            })
        }
    },
}
</script>
