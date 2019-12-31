<template>
  <KView class="page flex js_show">
    <KView class="page__hd">
      <h1 class="page__title">ScrollView</h1>
      <p class="page__desc">滑动视图，模仿小程序的 scroll-view</p>
    </KView>
    <KView class="page__bd page__bd_spacing">
      <KScrollView
        scroll-y
        style="height: 100px"
      >
        <KView style="height: 100%; background: green; text-align: center; line-height: 100px">纵向滚动</KView>
        <KView style="height: 100%; background: cyan; text-align: center; line-height: 100px">纵向滚动</KView>
        <KView style="height: 100%; background: pink; text-align: center; line-height: 100px">纵向滚动</KView>
      </KScrollView>
      <KScrollView
        scroll-x
      >
        <KView style="white-space: nowrap">
          <KView style="width: 100%; background: green; text-align: center; line-height: 100px; display: inline-block">横向滚动</KView>
          <KView style="width: 100%; background: cyan; text-align: center; line-height: 100px; display: inline-block">横向滚动</KView>
          <KView style="width: 100%; background: pink; text-align: center; line-height: 100px; display: inline-block">横向滚动</KView>
        </KView>
      </KScrollView>
    </KView>
  </KView>
</template>

<script>
export default {
    data() {
        return {
            isShow: false,
            isShowTitle: false
        }
    },
    methods: {
        openSheet() {
            this.isShow = true
        },
        openTitleSheet() {
            this.isShowTitle = true
        },
        actionChoose(value) {
            console.log(value)
            this.isShow = false
            this.isShowTitle = false
        }
    }
}
</script>
