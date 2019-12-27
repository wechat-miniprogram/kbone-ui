<template>
  <div :class="classObject">
    <slot/>
  </div>
</template>

<script>
import {ismp} from '@utils/util'

export default {
    name: 'KButtonArea',
    props: {
        direction: {
            type: String,
            default() { return 'vertical' }
        }
    },
    data() {
        return {
            ismp
        }
    },
    computed: {
        classObject() {
            return {
                'weui-btn-area': true,
                'weui-btn-area_inline': this.direction === 'horizontal',
            }
        }
    }
}
</script>

