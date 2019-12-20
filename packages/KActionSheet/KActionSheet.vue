<template>
    <KView>
        <KMask v-show="isShow" @click="cancelHander" />
        <KView class="weui-actionsheet" :class="{
            'weui-actionsheet_toggle': isShow
        }">
            <KView v-if="label" class="weui-actionsheet__title">
                <KView  class="weui-actionsheet__title-text">{{label}}</KView>
            </KView>
            <KView class="weui-actionsheet__menu">
                <KView 
                    v-for="(desc,key) in actions"
                    class="weui-actionsheet__cell"
                    :key="key"
                    @click="clickHander(desc,key)"
                >{{desc}}</KView>
            </KView>
            <KView class="weui-actionsheet__action">
                <KView @click="cancelHander"  class="weui-actionsheet__cell" >取消</KView>
            </KView>
        </KView>
    </KView>
</template>
<script>
import KMask from '../KMask/index'

export default {
    name:"KActionSheet",
    components:{KMask},
    props:{
        actions:{
            type:Array,
            required:true,
            default:[]
        },
        value:{
            type: Boolean,
            default: false,
            required:true
        },
        label:{
            type:String
        },
        
    },
    watch:{
        value(newValue){
            this.isShow = newValue
        }
    },
    data(){
        return {
            isShow: this.value
        }
    },
    methods:{
        cancelHander(event){
            this.isShow = false
            this.$emit('input',false)
            this.$emit('cancel')
        },
        clickHander(desc,index){
            this.$emit('click',desc,index)
        }
    }
}
</script>

