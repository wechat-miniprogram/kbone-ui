<template>
  <label class="weui-cell weui-check__label weui-cells_radio">
    <KView class="weui-cell__bd">
      <slot/>
    </KView>
    <KView class="weui-cell__ft">
      <input
        v-if="isGroup"
        :value="label"
        :checked="isChecked"
        :disabled="disabled"
        class="weui-check"
        type="radio"
        @change="handleChange"
      >
      <input
        v-else
        :checked="checked"
        :disabled="disabled"
        type="radio"
        class="weui-check"
        @change="handleChange" >
      <span
        :class="{'is-checked':isChecked}"
        class="weui-icon-checked"/>
    </KView>
  </label>
</template>

<script>
import {findUpComponent} from '@utils/util'

export default {
    name: 'KRadio',
    props: {
        value: {
            type: [Number, String, Boolean]
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
            isGroup: false,
            isChecked: this.checked,
            label: this.value,
            parent: findUpComponent(this, 'KRadioGroup'),
        }
    },
    watch: {
        checked(newValue) {
            this.isChecked = newValue
        }
    },
    mounted() {
        if (this.parent) {
            this.isGroup = true
        }
    },
    methods: {
        handleChange(e) {
            if (this.disabled) {
                return
            }
            this.isChecked = e.target.checked

            this.$emit('input', this.isChecked)

            if (this.isGroup) {
                this.parent.change(this.label)
            } else {
                this.$emit('change', this.isChecked)
            }
        }
    },
}
</script>

