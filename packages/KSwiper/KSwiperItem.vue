<template>
  <wx-swiper-item
    v-if="ismp"
    :item-id="itemId"
  >
    <slot></slot>
  </wx-swiper-item>
  <KView
   v-else
   class="weui-swiper-item">
    <slot/>
  </KView>
</template>

<script>
import KView from '../KView/'
import {ismp} from '@utils/util'

export default {
    name: 'KSwiperItem',
    data(){
      return {
        ismp
      }
    },
    props:{
      itemId:{
        type: String
      }
    },
    components: {
        KView
    }
}
</script>
