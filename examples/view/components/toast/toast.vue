<template>
  <KView class="page toast js_show">
    <KView class="page__hd">
      <h1 class="page__title">Toast</h1>
      <p class="page__desc">弹出式提示</p>
    </KView>
    <KView class="page__bd page__bd_spacing">
      <KButton @click="successShow">
        成功提示
      </KButton>
      <KButton @click="loadingShow">
        加载中提示
      </KButton>
    </KView>
    <KToast
      :duration="1000"
      v-model="successTips"
      type="success"
    >已完成</KToast>
    <KToast
      v-model="loadingToast"
      type="loading"
    >加载中提示</KToast>
  </KView>
</template>

<script>

export default {
    data() {
        return {
            successTips: false,
            loadingToast: false,
        }
    },
    methods: {
        successShow() {
            this.successTips = true
        },
        loadingShow() {
            this.loadingToast = true
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.loadingToast = false
            }, 1000)
        }

    }
}
</script>
