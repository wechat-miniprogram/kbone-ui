<template>
    <wx-button v-if="ismp"
     @click="clickHander" 
     :type="type" 
     :disabled="disabled" 
     class="weui-btn" 
     :loading="loading" 
     v-bind:class="classObject" 
    :form-type="formType"
    :open-type="openType"
    :appParameter="appParameter"
    :withCredentials="withCredentials"
    :lang="lang"
    :hover-startTime="hoverStartTime"
    :hover-stayTime="hoverStayTime"
    :hover-class="hoverClass"
    :session-from="sessionFrom"
    :businessId="businessId"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :send-message-img="sendMessageImg"
    :show-message-card="showMessageCard"
    :need-phone-number="needPhoneNumber"
    @getuserinfo="bindgetuserinfo"
    @contact="bindcontact"
    @getphonenumber="bindgetphonenumber"
    @error="binderror"
    @opensetting="bindopensetting"
    @launchapp="bindlaunchapp"
     >
        <slot></slot>
    </wx-button>
    <button @click="clickHander" :disabled="disabled" class="weui-btn" v-bind:class="classObject" v-else>
        <i v-if="loading" class="weui-loading"></i><slot></slot>
    </button>
</template>

<script>
import { ismp } from "@utils/util";

export default {
  name: "KButton",
  data() {
    return {
      ismp
    };
  },
  props: {
    size: {
      type: String,
      default: "default"
    },
    type: {
      type: String,
      default: "default"
    },
    loading: {
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String
    },
    openType: {
      value: "",
      type: String
    },
    appParameter: {
      value: "",
      type: String
    },
    withCredentials: {
      value: true,
      type: Boolean
    },
    lang: {
      value: "en",
      type: String
    },
    hoverStartTime: {
      type: Number,
      value: 20
    },
    hoverStayTime: {
      type: Number,
      value: 70
    },
    hoverClass: {
      type: String,
      value: "" // 对，这里是空的！！！
    },
    sessionFrom: {
      type: String,
      value: "wxapp"
    },
    businessId: {
      type: String,
      value: ""
    },
    sendMessageTitle: {
      type: String,
      value: ""
    },
    sendMessagePath: {
      type: String,
      value: ""
    },
    sendMessageImg: {
      type: String,
      value: ""
    },
    showMessageCard: {
      type: Boolean,
      value: false
    },
    needPhoneNumber: {
      type: Boolean,
      value: false
    },

    native: {
      type: Boolean,
      value: false
    }
  },
  computed: {
    classObject() {
      return {
        "weui-btn_mini": this.size === "mini",
        "weui-btn_primary": this.type === "primary",
        "weui-btn_default": this.type === "default",
        "weui-btn_warn": this.type === "warn",
        "weui-btn_disabled": this.disabled
      };
    }
  },
  methods: {
    clickHander(event) {
      this.$emit("click", event);
    },
    bindgetuserinfo(...args){
        this.$emit('getuserinfo',...args)
    },
    bindcontact(...args){
        this.$emit('contact',...args)
    },
    bindgetphonenumber(...args){
        this.$emit('getphonenumber',...args)
    },
    binderror(...args){
        this.$emit('error',...args)
    },
    bindopensetting(...args){
        this.$emit('opensetting',...args)
    },
    bindlaunchapp(...args){
        this.$emit('launchapp',...args)
    },
  }
};
</script>

