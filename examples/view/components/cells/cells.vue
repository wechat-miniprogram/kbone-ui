<template>
  <KView class="page cells js_show">
    <KView class="page__hd">
      <h1 class="page__title">Cells</h1>
      <p class="page__desc">Cells 显示</p>
    </KView>
    <KView>
      <KCells title="带说明的列表项">
        <KCell
          value="标题文字"
          footer="说明文字" />
        <KCell
          title="带图标"
          footer="说明文字">
          <KIcon
            slot="icon"
            type="info" />
        </KCell>
      </KCells>
    </KView>
  </KView>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>
