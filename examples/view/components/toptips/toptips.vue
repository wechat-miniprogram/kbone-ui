<template>
  <KView class="page progress js_show">
    <KView class="page__hd">
      <h1 class="page__title">Toptips</h1>
      <p class="page__desc">Toptips 布局</p>
    </KView>
    <KView class="page__bd page__bd_spacing">
      <KButton @click="openSuccess" >Success</KButton>
      <KButton @click="openinfo" >Info</KButton>
      <KButton @click="openerror" >Error</KButton>
    </KView>
    <KToptips
      v-model="successShow"
      :duration="1000">
      成功
    </KToptips>
    <KToptips
      v-model="infoShow"
      :duration="1000"
      type="info">
      提示
    </KToptips>
    <KToptips
      v-model="errorShow"
      :duration="1000"
      type="error">
      错误
    </KToptips>
  </KView>
</template>

<script>
export default {
    data() {
        return {
            successShow: false,
            infoShow: false,
            errorShow: false
        }
    },
    methods: {
        openSuccess() {
            this.successShow = true
        },
        openinfo() {
            this.infoShow = true
        },
        openerror() {
            this.errorShow = true
        },
    }
}
</script>
