<template>
  <wx-picker-view
    v-if="ismp"
    :value="value"
    :indicator-style="indicatorStyle"
    :indicator-class="indicatorClass"
    :mask-style="maskStyle"
    :mask-class="maskClass"
    @change="updateKey">
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
            type: Array,
            value: []
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
        change(key,index) {
            this.value[key] = index
            this.$emit('input', this.value)
            this.$emit('change', this.value)
        },
        updateKey(event) {
            this.$emit('input', event.detail.value)
            this.$emit('change', event.detail.value)
        },
        setIndicatorStyle() {
            const columns = findDownComponent(this, 'KPickerViewColumn')
            columns.forEach((col,index) => {
                // 覆盖 indicator 样式
                col.$refs.indicator.$el.style = this.indicatorStyle
                col.order = index
                col.renderItems()
                col.updatePos(this.value[index] || 0)
            })
        }
    },
}
</script>
