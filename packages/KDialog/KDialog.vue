<template>
  <KView v-show="isShow">
    <KMask @click="maskClick" />
    <KView class="weui-dialog">
      <KView
        v-if="title"
        class="weui-dialog__hd">
        <KView class="weui-dialog__title">
          {{ title }}
        </KView>
      </KView>
      <KView class="weui-dialog__bd">
        {{ desc }}
      </KView>
      <KView class="weui-dialog__ft">
        <KView
          v-for="(item,index) in buttons"
          :key="index"
          class="weui-dialog__btn weui-dialog__btn_primary"
          @click="item.click" >
          {{ item.text }}
        </KView>
      </KView>
    </KView>
  </KView>
</template>
<script>
import KMask from '../KMask/index'

export default {
    name: 'KDialog',
    components: {
        KMask
    },
    props: {
        title: {
            type: String
        },
        desc: {
            type: String
        },
        buttons: {
            type: Array,
            default: []
        },
        onCancel: {
            type: Function,
            default: () => {}
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isShow: this.value
        }
    },
    watch: {
        value(newValue) {
            this.isShow = newValue
        }
    },
    methods: {
        maskClick(event) {
            this.isShow = false
            this.$emit('input', false)
            this.onCancel(event)
        }
    }
}
</script>

