<template>
  <KView class="page picker js_show">
    <KView class="page__hd">
      <h1 class="page__title">Picker</h1>
      <p class="page__desc">PickerView 和 PickerViewGroup 组件</p>
    </KView>
    <KView class="page__bd picker_page page__bd_spacing">
      <KPickerView
        indicator-style="height: 50px;"
        style="width: 100%; height: 300px;"
        @change="changeIndex">
        <KPickerViewColumn>
          <KView
            v-for="(item,index) in singleData"
            :key="index"
            style="line-height: 50px;" >
            {{ item }}
          </KView>
        </KPickerViewColumn>
      </KPickerView>
    </KView>
  </KView>
</template>

<script>

export default {
    data() {
        return {
            singleData: [
                '小程序',
                '微信',
                '开发六组',
                '零度的田'
            ],
        }
    },
    methods: {
        changeIndex(index) {
            console.log(index)
        }
    }

}
</script>

<style>

</style>
