<template>
  <KView class="page flex js_show">
    <KView class="page__hd">
      <h1 class="page__title">ScrollView</h1>
      <p class="page__desc">滑动视图，模仿小程序的 scroll-view</p>
    </KView>
    <KView class="page__bd page__bd_spacing">
      <KScrollView
        :scroll-top="scrollTop"
        scroll-y
        scroll-with-animation
        style="height: 100px"
        @scroll="scroll"
        @scrolltoupper="scrollToUpper"
        @scrolltolower="scrollToLower"
      >
        <KView style="height: 100%; background: green; text-align: center; line-height: 100px">纵向滚动</KView>
        <KView style="height: 100%; background: cyan; text-align: center; line-height: 100px">纵向滚动</KView>
        <KView style="height: 100%; background: pink; text-align: center; line-height: 100px">纵向滚动</KView>
      </KScrollView>
      <KButton @click="applyScrollTop">跳至 50px 处</KButton>
      <KScrollView
        :scroll-left="scrollLeft"
        scroll-x
        @scroll="scroll"
        @scrolltoupper="scrollToUpper"
        @scrolltolower="scrollToLower"
      >
        <KView style="white-space: nowrap">
          <KView style="width: 100%; background: green; text-align: center; line-height: 100px; display: inline-block">横向滚动</KView>
          <KView style="width: 100%; background: cyan; text-align: center; line-height: 100px; display: inline-block">横向滚动</KView>
          <KView style="width: 100%; background: pink; text-align: center; line-height: 100px; display: inline-block">横向滚动</KView>
        </KView>
      </KScrollView>
      <KButton @click="applyScrollLeft">跳至 200px 处</KButton>
    </KView>
  </KView>
</template>

<script>
export default {
    data() {
        return {
            scrollTop: '',
            scrollLeft: ''
        }
    },
    methods: {
        applyScrollTop() {
            if (this.scrollTop === '50px') this.scrollTop = '51px'
            else this.scrollTop = '50px'
        },
        applyScrollLeft() {
            if (this.scrollLeft === '200px') this.scrollLeft = '201px'
            else this.scrollLeft = '200px'
        },
        scroll() {
            console.info('scroll triggered')
        },
        scrollToUpper() {
            console.info('scrolltoupper triggered')
        },
        scrollToLower() {
            console.info('scrolltolower triggered')
        },
    }
}
</script>
