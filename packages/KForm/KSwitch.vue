<template>
      <KView class="weui-cell weui-cell_switch">
          <KView class="weui-cell__bd">
              {{label}}
          </KView>
          <KView class="weui-cell__ft">
              <label class="weui-switch-cp">
                  <input type="checkbox" 
                    class="weui-switch-cp__input" 
                    @change="handleChange"
                    :disabled="disabled"
                    :checked="isChecked"
                  />
                  <KView class="weui-switch-cp__box" v-bind:class="{'is-checked':isChecked}" />
              </label>
          </KView>
      </KView>
</template>

<script>
export default {
    name:"KSwitch",
    props:{
        label:{
            type: String,
            required:true
        },
        value:{
            type: Boolean,
            required:true
        },
        disabled:{
            type:Boolean
        }
    },
    data(){
        return {
            isChecked: this.value
        }
    },
    methods:{
        handleChange(e){
            if(this.disabled){
                return
            }
            this.isChecked = e.target.checked
            
            this.$emit('input', this.isChecked)
            this.$emit('change', {
                detail: this.isChecked
            })
        }
    }
}
</script>

