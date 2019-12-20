<template>
     <KView class="page button js_show">
        <KView class="page__hd">
            <h1 class="page__title">Button</h1>
            <p class="page__desc">按钮，WeUI采用小程序原生的按钮为主体，加入一些间距的样式。</p>
        </KView>
        <KButtonArea>
            <KButton type="primary" >页面主要操作</KButton>
            <KButton type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" > getUserInfo </KButton>
            <KButton type="primary" :loading="true">Loading</KButton>
            <KButton type="primary" :disabled="true">禁止点击</KButton>
            <KButton >页面次要操作</KButton>
            <KButton type="warn">警告类操作</KButton>
            <KButton type="warn" :loading="true">警告类操作</KButton>
            <KButton type="warn" :disabled="true">警告类操作</KButton>
        </KButtonArea>
        <KButtonArea direction="horizontal">
            <KButton size="mini" type="primary">btn</KButton>
            <KButton size="mini" >btn</KButton>
            <KButton size="mini" type="warn">btn</KButton>
        </KButtonArea>
    </KView>
</template>

<script>
export default {
    methods:{
        getUserInfo(e){
            console.log(e)
        }
    }
}


</script>