import KRadio from './KRadio.vue'
import KRadioGroup from './KRadioGroup.vue'
import KCells from './KCells.vue'
import KCheckbox from './KCheckbox.vue'
import KCheckboxGroup from './KCheckboxGroup.vue'
import KSwitch from './KSwitch.vue'
import KInput from './KInput.vue'
import KSlider from './KSlider.vue'


KRadio.install = function(Vue) {
    Vue.component(KRadio.name, KRadio)
};

KCells.install = function(Vue) {
    Vue.component(KCells.name, KCells)
};

KCheckbox.install = function(Vue) {
    Vue.component(KCheckbox.name, KCheckbox)
};

KCheckboxGroup.install = function(Vue) {
    Vue.component(KCheckboxGroup.name, KCheckboxGroup)
};

KSwitch.install = function(Vue) {
    Vue.component(KSwitch.name, KSwitch)
};

KRadioGroup.install = function(Vue) {
    Vue.component(KRadioGroup.name, KRadioGroup)
};

KInput.install = function(Vue) {
    Vue.component(KInput.name, KInput)
};

KSlider.install = function(Vue) {
    Vue.component(KSlider.name, KSlider)
};

export {
    KRadio,
    KCells,
    KCheckbox,
    KCheckboxGroup,
    KRadioGroup,
    KSwitch,
    KInput,
    KSlider,
}