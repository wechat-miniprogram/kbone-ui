<template>
  <KView class="page progress js_show">
    <KView class="page__hd">
      <h1 class="page__title">Progress</h1>
      <p class="page__desc">Progress布局</p>
    </KView>
    <KView class="page__bd page__bd_spacing">
      <KProgress :percent="progress" />
      <KProgress
        :percent="progress"
        :show-info="true" />
    </KView>
  </KView>
</template>
<script>
export default {
    data() {
        return {
            progress: 0
        }
    },
    mounted() {
        this.progressInterval = setInterval(() => {
            if (this.progress === 100) {
                clearInterval(this.progressInterval)
            } else {
                this.progress += 1
            }
        }, 20)
    }
}
</script>
