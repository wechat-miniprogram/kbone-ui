<template>
   <div v-bind:class="classObject">
       <slot></slot>
   </div>
</template>

<script>
import {ismp} from '@utils/util'

export default {
    name:"KButtonArea",
    data(){
        return {
            ismp
        }
    },
    props:{
        direction:{
            direction: 'vertical'
        }
    },
    computed:{
        classObject(){
            return {
                'weui-btn-area': true,
                'weui-btn-area_inline': this.direction === 'horizontal',
            }
        }
    }
}
</script>

