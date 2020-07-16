<template>
  <KView class="weui-cell">
    <KView class="weui-cell__hd">
      <label class="weui-label">{{ label }}</label>
    </KView>
    <KView class="weui-cell__bd">
      <input
        ref="field"
        :type="type"
        :value="internalValue"
        :focus="internalFocused"
        :placeholder="placeholder"
        :auto-focus="autoFocus"
        :placeholder-style="placeholderStyle"
        :placeholder-class="placeholderClass"
        :dropdown-style="dropdownStyle"
        :show-value="showValue"
        :maxlength="maxlength"
        :password="password"
        :disabled="disabled"
        :confirm-hold="confirmHold"
        :cursor="cursor"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        :adjust-position="adjustPosition"
        :hold-keyboard="holdKeyboard"
        class="weui-input"
        @focus="bindfocus"
        @input="inputHandler"
        @blur="blurHandler"
        @confirm="bindconfirm"
        @keyboardheightchange ="bindkeyboardheightchange "
      >
      <button
        v-if="clearable"
        :class="{'is-focused':internalValue.length > 0}"
        class="weui-btn_reset weui-btn_icon weui-btn_input-clear"
        @click="handleClear">
        <i class="weui-icon-clear"/>
      </button>
    </KView>
  </KView>
</template>

<script>
export default {
    name: 'KInput',
    props: {
        label: {
            type: String
        },
        value: {
            type: String,
            default: ''
        },
        clearable: {
            type: Boolean
        },
        focus: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ''
        },
        autoFocus: {
            type: Boolean,
            value: false,
            public: true
        },

        placeholderStyle: {
            type: String,
            value: '',
            public: true
        },
        placeholderClass: {
            type: String,
            value: '',
        },
        dropdownStyle: {
            type: Object,
            value: {},
            public: true
        },
        showValue: {
            type: String,
            value: ''
        },
        maxlength: {
            type: Number,
            value: 140,
            observer: '_maxlengthChanged',
            public: true
        },
        /** value* */
        /** type* */
        type: {
            type: String,
            value: 'text',
            public: true
        },
        password: {
            type: Boolean,
            value: false,
            public: true
        },
        /** 这里重复了，以上面的为准 */
        /* disabled: {
            type: Boolean,
            value: false,
            public: true
        },
        */
        confirmHold: {
            type: Boolean,
            value: false,
            public: true
        },

        cursor: {
            type: null,
            value: -1,
            public: true
        },
        selectionStart: {
            type: null,
            value: -1,
            public: true
        },
        selectionEnd: {
            type: null,
            value: -1,
            public: true
        },
        adjustPosition: {
            type: Boolean,
            value: true,
        },
        holdKeyboard: {
            type: Boolean,
            value: false,
        },
    },
    watch:{
        value(newValue) {
            if(newValue !== this.internalValue) {
                this.internalValue = newValue
            }
        }
    },
    data() {
        return {
            internalValue: this.value,
            internalFocused: this.focus
        }
    },
    methods: {
        handleClear() {
            this.internalValue = ''
            this.$refs.field.focus()
            this.$emit('clear')
        },
        inputHandler(e) {
            if (this.readonly || this.disabled) {
                e.target.value = this.internalValue
            } else {
                const value = e.target.value
                this.internalValue = value
                this.$emit('input', value)
                this.$emit('change', value)
                this.internalFocused = true
            }
        },
        blurHandler(...args) {
            this.internalFocused = false
            this.$emit('blur', ...args)
        },
        bindconfirm(...args) {
            this.$emit('confirm', ...args)
        },
        bindkeyboardheightchange(...args) {
            this.$emit('keyboardheightchange', ...args)
        },
        bindfocus(...args) {
            this.$emit('focus', ...args)
        }
    }
}
</script>
