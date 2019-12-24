<template>
  <label class="weui-cell weui-check__label weui-cells_checkbox">
    <KView class="weui-cell__hd">
      <input
        v-if="isGroup"
        :value="value"
        v-model="model"
        :checked="checked"
        :disabled="disabled"
        class="weui-check "
        type="checkbox"
        @change="handleChange" >
      <input
        v-else
        :checked="checked"
        :disabled="disabled"
        class="weui-check"
        type="checkbox"
        @change="handleChange"
      >
      <i
        :class="{isChecked}"
        class="weui-icon-checked"/>
    </KView>

    <KView class="weui-cell__bd">
      <slot/>
    </KView>
  </label>
</template>

<script>
import {findUpComponent} from '@utils/util'


export default {
    name: 'KCheckbox',
    props: {
        value: {
            type: [Number, String, Boolean],
        },
        checked: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean
        },
    },
    data() {
        return {
            model: [],
            isGroup: false,
            isChecked: this.checked,
            currentValue: this.value,
            parent: findUpComponent(this, 'KCheckboxGroup')
        }
    },
    watch: {
        value(newValue) {
            this.updateModel()
        }
    },
    mounted() {
        this.parent = findUpComponent(this, 'KCheckboxGroup')
        if (this.parent) {
            this.isGroup = true
            this.showSlot = true
        }
    },
    methods: {
        handleChange(e) {
            if (this.disabled) {
                return
            }

            this.isChecked = e.target.checked
            this.currentValue = this.isChecked

            this.$emit('input', this.isChecked)

            if (this.isGroup) {
                this.parent.change(this.model)
            } else {
                this.$emit('change', this.isChecked)
            }
        },
        updateModel() {
            this.currentValue = this.value
        }
    },
}
</script>

