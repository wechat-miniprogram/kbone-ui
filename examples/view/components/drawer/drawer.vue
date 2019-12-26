<template>
  <KView class="page button js_show">
    <KView class="page__hd">
      <h1 class="page__title">Drawer</h1>
      <p class="page__desc">抽屉，目前仅支持左/右。</p>
    </KView>
    <KButtonArea>
      <KButton
        type="primary"
        @click="isShowRightDrawer = true">
        显示右边抽屉
      </KButton>
      <KButton
        type="primary"
        @click="isShowLeftDrawer = true">
        显示左边抽屉
      </KButton>
    </KButtonArea>

    <KDrawer :visible.sync="isShowRightDrawer">右边的抽屉</KDrawer>
    <KDrawer
      :visible.sync="isShowLeftDrawer"
      direction="ltr"
      size="50%">
      左边的抽屉
      <KButton
        type="primary"
        @click="isShowSubDrawer = true">
        显示小抽屉
      </KButton>
      <KDrawer
        :visible.sync="isShowSubDrawer"
        size="10%"
        direction="ltr">左边比较小的抽屉</KDrawer>
    </KDrawer>
  </KView>
</template>

<script>
export default {
    data() {
        return {
            isShowRightDrawer: false,
            isShowLeftDrawer: false,
            isShowSubDrawer: false
        }
    },
    methods: {
        getUserInfo(e) {
            console.log(e)
        }
    }
}

</script>
