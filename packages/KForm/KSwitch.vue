<template>
  <KView class="weui-cell weui-cell_switch">
    <KView v-if="label" class="weui-cell__bd">
      {{ label }}
    </KView>
    <KView class="weui-cell__ft">
      <label class="weui-switch-cp">
        <input
          :disabled="disabled"
          :checked="isChecked"
          type="checkbox"
          class="weui-switch-cp__input"
          @change="handleChange"
        >
        <KView
          :class="{'is-checked':isChecked}"
          class="weui-switch-cp__box" />
      </label>
    </KView>
  </KView>
</template>

<script>
export default {
    name: 'KSwitch',
    props: {
        label: {
            type: String,
        },
        value: {
            type: Boolean,
            required: true
        },
        disabled: {
            type: Boolean
        }
    },
    data() {
        return {
            isChecked: this.value
        }
    },
    methods: {
        handleChange(e) {
            if (this.disabled) {
                return
            }
            this.isChecked = e.target.checked

            this.$emit('input', this.isChecked)
            this.$emit('change', {
                detail: this.isChecked
            })
        }
    }
}
</script>

