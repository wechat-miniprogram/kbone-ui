<template>
  <KView>
    <slot/>
  </KView>
</template>

<script>
import {ismp, findDownComponent} from '@utils/util'

export default {
    name: 'KCheckboxGroup',
    props: {
        value: {
            type: Array,
            default() {
                return []
            }
        },
    },
    data() {
        return {
            ismp,
            currentValue: this.value
        }
    },
    watch: {
        value(newValue) {
            this.currentValue = newValue
        },
        currentValue() {
            this.updateModel(true)
        }
    },
    mounted() {
        this.updateModel(true)
    },
    methods: {
        updateModel(update) {
            this.childs = findDownComponent(this, 'KCheckbox')
            if (this.childs) {
                const {
                    currentValue
                } = this
                this.childs.forEach((child) => {
                    child.model = currentValue // 数组
                    if (update) {
                        child.currentValue = currentValue.indexOf(child.label) >= 0
                        child.isGroup = true
                    }
                })
            }
        },
        change(data) {
            this.currentValue = data
            this.$emit('input', data)
            this.$emit('change', data)
        }
    },
}
</script>
