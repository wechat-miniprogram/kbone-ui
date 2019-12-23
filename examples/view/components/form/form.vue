<template>
    <KView class="page form js_show">
        <KView class="page__hd">
            <h1 class="page__title">Form</h1>
            <p class="page__desc">form 表单内容</p>
        </KView>
        <KCells checkbox title="Checkbox">
            <KCheckboxGroup @change="handleChange" v-model="checkboxGrpValues">
                <KCheckbox value="零度的田">零度的田</KCheckbox> 
                <KCheckbox value="小程序开发">小程序开发</KCheckbox> 
            </KCheckboxGroup>
        </KCells>
        <KCells title="Switch">
            <KSwitch v-model="switchItem" label="Switch文本" />
        </KCells>
        <KCells title="Radio">
            <KRadioGroup @change="raidoChange" v-model="radioValue">
                <KRadio :value="1">微信</KRadio>
                <KRadio :value="2">微信支付</KRadio>
                <KRadio :value="3">小程序</KRadio>
            </KRadioGroup>
        </KCells>

        <KCells title="表单输入">
            <KInput label="卡号" @change="inputChange" v-model="inputCardValue" placeholder="填写本人卡号" clearable/>
            <KInput label="昵称" @change="inputChange" v-model="inputNickName" placeholder="填写本人微信号的昵称" clearable/>
        </KCells>


    </KView>
</template>

<script>
export default {
    data(){
        return {
            singleCheckbox:false,
            checkboxGrpValues:[],
            inputCardValue:"",
            inputNickName:"",
            switchItem:false,
            radioValue: 1
        }
    },
    methods:{
        handleChange(){
            console.log(this.checkboxGrpValues)
        },
        singleCheckboxHandler(){
            console.log(this.singleCheckbox)
        },
        raidoChange(){
            console.log(this.radioValue)
        },
        inputChange(){
            console.log(this.inputValue)
        }
    }
}
</script>
