<template>
   <wx-picker-view
    :indicator-style="indicatorStyle" 
    :indicator-class="indicatorClass"
    :mask-style="maskStyle"
    :mask-class="maskClass"
    v-if="ismp">
    <slot></slot>
   </wx-picker-view>
    <KView v-else class="weui-picker__bd">
        <slot></slot>
    </KView>
</template>
<script>
import { ismp,findUpComponent,findDownComponent } from "@utils/util"

export default {
    name:"KPickerView",
    props:{
        indicatorStyle: {
          type: String,
          value: '',
        },
        indicatorClass: {
          type: String,
          value: '',
        },
        maskStyle: {
          type: String,
          value: '',
        },
        maskClass: {
          type: String,
          value: '',
        }
    },
    data(){
        return {
            ismp,
        }
    },
    methods:{
        change(index){
            this.$emit('change',index)
        },
        setIndicatorStyle(){
            let columns = findDownComponent(this,'KPickerViewColumn')
            columns.forEach(col=>{
                // 覆盖 indicator 样式
                col.$refs.indicator.$el.style = this.indicatorStyle
                col.renderItems()
            })
        }
    },
    mounted(){
        !ismp && this.setIndicatorStyle()
        
    }
}
</script>
