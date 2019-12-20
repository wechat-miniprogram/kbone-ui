<template>
    <div @click="$emit('click')" class="weui-flex"
        :style="{
            'flex-direction':direction
        }"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    name:"KFlex",
    props:{
        direction:{
            type: String,
            default:"row"
        }
    }
}
</script>

