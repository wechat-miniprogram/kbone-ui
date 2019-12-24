<template>
  <KView class="page dialog js_show">
    <KView class="page__hd">
      <h1 class="page__title">Dialog</h1>
      <p class="page__desc">Dialog 显示</p>
    </KView>
    <KView class="page__bd page__bd_spacing">
      <KButton @click="openDialog">Dialog with one button</KButton>
      <KButton @click="openDualDialog">Dialog with two buttons</KButton>
    </KView>
    <KDialog
      v-model="diaShow"
      :buttons="diaBtn"
      title="零度的田"
      desc="弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内"
    />
    <KDialog
      v-model="dualShow"
      :buttons="dualBtn"
      title="villainhr"
      desc="弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内"
    />
  </KView>
</template>

<script>
export default {
    data() {
        return {
            diaShow: false,
            dualShow: false,
            diaBtn: [
                {
                    text: '确定',
                    click: () => {
                        console.log('确定')
                        this.diaShow = false
                    }
                }
            ],
            dualBtn: [
                {
                    text: '确定',
                    click: () => {
                        console.log('确定')
                        this.dualShow = false
                    }
                },
                {
                    text: '取消',
                    click: () => {
                        console.log('取消')
                        this.dualShow = false
                    }
                },
            ]
        }
    },
    methods: {
        openDialog() {
            this.diaShow = true
        },
        openDualDialog() {
            this.dualShow = true
        }
    }
}
</script>
