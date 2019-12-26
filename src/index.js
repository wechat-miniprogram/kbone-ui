import {ismp} from './utils/util'
import KView from '../packages/KView/'
import KButton from '../packages/KButton/'
import KButtonArea from '../packages/KButtonArea/'
import {
    KFlex,
    KFlexItem
} from '../packages/KFlex'
import {
    KRadio,
    KCells,
    KCheckbox,
    KCheckboxGroup,
    KRadioGroup,
    KSwitch,
    KInput,
    KSlider,
} from '../packages/KForm'
import KActionSheet from '../packages/KActionSheet/'
import KDialog from '../packages/KDialog/'
import KToast from '../packages/KToast/'
import KProgress from '../packages/KProgress/'
import KToptips from '../packages/KToptips/'
import {
    KPickerView,
    KPickerViewColumn,
} from '../packages/KPicker/'
import {
    KSwiper,
    KSwiperItem
} from '../packages/KSwiper/'
import KDrawer from '../packages/KDrawer/'

const components = [
    KView,
    KButton,
    KButtonArea,
    KFlex,
    KFlexItem,
    KRadio,
    KCells,
    KCheckbox,
    KCheckboxGroup,
    KSwitch,
    KRadioGroup,
    KInput,
    KSlider,
    KActionSheet,
    KDialog,
    KToast,
    KProgress,
    KToptips,
    KPickerView,
    KPickerViewColumn,
    KSwiper,
    KSwiperItem,
    KDrawer
]

const install = function(Vue, opts = {}) {
    components.forEach(component => {
        Vue.component(component.name, component)
    })
    // register variable for mp and h5
    Vue.prototype.$kbone = {
        size: opts.size || '',
        zIndex: opts.zIndex || 2000
    }

    Vue.prototype.$ismp = typeof Page === 'function' && typeof Component === 'function'
}


if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(WeUI)
}

export default {
    version: '0.5.6',
    ismp,
    install,
    KView,
    KButton,
    KButtonArea,
    KFlex,
    KFlexItem,
    KRadio,
    KCells,
    KCheckbox,
    KCheckboxGroup,
    KSwitch,
    KRadioGroup,
    KInput,
    KSlider,
    KActionSheet,
    KDialog,
    KToast,
    KProgress,
    KToptips,
    KPickerView,
    KPickerViewColumn,
    KSwiper,
    KSwiperItem,
    KDrawer
}
