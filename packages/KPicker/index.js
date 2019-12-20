import KPickerView from './KPickerView.vue'
import KPickerViewColumn from './KPickerViewColumn.vue'

KPickerView.install = function(Vue){
    Vue.component(KPickerView.name, KPickerView)
}

KPickerViewColumn.install = function(Vue){
    Vue.component(KPickerViewColumn.name, KPickerViewColumn)
}

export {
    KPickerView,
    KPickerViewColumn
}