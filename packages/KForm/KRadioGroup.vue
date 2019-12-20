<template>
    <KView>
        <slot></slot>
    </KView>
</template>

<script>
import {findDownComponent} from '@utils/util'

export default {
    name:"KRadioGroup",
    props:{
        value:{
            type: [String,Number,Boolean]
        }
    },
    data(){
        return {
            currentValue: this.value
        }
    },
    watch:{
        value(newValue){
            this.currentValue = newValue
        },
        currentValue(){
            this.updateModel()
        }
    },
    methods:{
        updateModel(){
            this.childs = findDownComponent(this,'KRadio')
            this.childs.forEach(child=>{
                if(child.label === this.currentValue){
                    child.isChecked = true
                }else{
                    child.isChecked = false
                }
            })
        },
        change(data){
            this.currentValue = data
            this.$emit('input',data)
            this.$emit('change',data)
        }
    },
    mounted(){
        this.updateModel()
    }
}
</script>

