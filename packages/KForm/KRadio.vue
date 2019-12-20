<template>
    <label class="weui-cell weui-check__label weui-cells_radio">
        <KView class="weui-cell__bd">
            <slot></slot>
        </KView>
        <KView class="weui-cell__ft">
            <input v-if="isGroup" 
                class="weui-check" 
                type="radio" 
                @change="handleChange"
                :value="label"
                :checked="isChecked"
                :disabled="disabled"
                />
            <input v-else
                @change="handleChange"
                :checked="checked"
                :disabled="disabled" 
                 type="radio"
                 class="weui-check" />
            <span class="weui-icon-checked" v-bind:class="{'is-checked':isChecked}"></span>
        </KView>
    </label>
</template>

<script>
import {findUpComponent} from '@utils/util'

export default {
    name:"KRadio",
    props:{
        value:{
            type:[Number,String,Boolean]
        },
        checked:{
            type:Boolean,
            default: false
        },
        disabled:{
            type:Boolean
        },
    },
    data(){
        return {
            isGroup:false,
            isChecked: this.checked,
            label: this.value,
            parent:findUpComponent(this,'KRadioGroup'),
        }
    },
    watch:{
        checked(newValue){
            this.isChecked = newValue
        }
    },
    methods:{
        handleChange(e){
            if(this.disabled){
                return
            }
            this.isChecked = e.target.checked

            this.$emit('input',this.isChecked)

            if(this.isGroup){
                this.parent.change(this.label)
            }else{
                this.$emit('change',this.isChecked)
            }

        }
    },
    mounted(){
        if(this.parent){
            this.isGroup = true
        }
    }
}
</script>

