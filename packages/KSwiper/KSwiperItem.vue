<template>
    <KView class="weui-swiper-item">
        <slot></slot>
    </KView>
</template>

<script>
import KView from '../KView/'

export default {
    name:"KSwiperItem",
    components:{
        KView
    }
}
</script>