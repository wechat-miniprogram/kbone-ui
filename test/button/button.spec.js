import { mount } from '@vue/test-utils'
import { KButton,KButtonArea,KView } from 'kbone-ui'

test('render ok',()=>{
    const container = {
        components:{
            KButton,
            KButtonArea,
            KView
        },
        template: `
            <KView>
                <KButtonArea id="vertical-wrapper">
                    <KButton id="default-type">Default</KButton>
                    <KButton id="primary-type" type="primary">Primary</KButton>
                    <KButton id="warn-type"type="warn">warn</KButton>
                </KButtonArea>
            </KView>
        `
    }
    const wrapper = mount(container,{})

    const defaultTypeBtn = wrapper.find('#default-type');
    const primaryTypeBtn = wrapper.find('#primary-type');
    const warnTypeBtn = wrapper.find('#warn-type');

    expect(defaultTypeBtn.classes()).toEqual(['weui-btn weui-btn_default'])
    expect(primaryTypeBtn.classes()).toEqual(['weui-btn weui-btn_primary'])
    expect(warnTypeBtn.classes()).toEqual(['weui-btn weui-btn_warn'])
})