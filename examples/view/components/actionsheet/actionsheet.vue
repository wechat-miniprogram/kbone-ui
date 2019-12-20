<template>
    <KView class="page actionsheet js_show">
        <KView class="page__hd">
            <h1 class="page__title">Button</h1>
            <p class="page__desc">按钮，WeUI采用小程序原生的按钮为主体，加入一些间距的样式。</p>
        </KView>
        <KView class="page__hd">
            <KButton @click="openSheet">Show ActionSheet</KButton>
            <KButton @click="openTitleSheet">带 title</KButton>
        </KView>
        <KActionSheet
            :actions="['微信','微信读书','微信小程序']"
            v-model="isShow"
            :actionClick='actionChoose'
        />
        <KActionSheet
            :actions="['villainhr','淮仁']"
            label="选择你的名字"
            v-model="isShowTitle"
            :actionClick='actionChoose'
        />
    </KView>
</template>

<script>
export default {
    data(){
        return {
            isShow: false,
            isShowTitle: false
        }
    },
    methods:{
        openSheet(){
            this.isShow = true
        },
        openTitleSheet(){
            this.isShowTitle = true
        },
        actionChoose(value){
            console.log(value)
            this.isShow = false
            this.isShowTitle = false
        }
    }
}
</script>
