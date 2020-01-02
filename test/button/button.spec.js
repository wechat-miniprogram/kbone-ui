import { mount } from '@vue/test-utils'
import KboneUI from 'kbone-ui'
import sinon from 'sinon';

const {
    KButton,KButtonArea,KView
} = KboneUI

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
    const wrapper = mount(container)

    const defaultTypeBtn = wrapper.find('#default-type');
    const primaryTypeBtn = wrapper.find('#primary-type');
    const warnTypeBtn = wrapper.find('#warn-type');

    expect(defaultTypeBtn.classes()).toEqual(['weui-btn','weui-btn_default'])
    expect(primaryTypeBtn.classes()).toEqual(['weui-btn','weui-btn_primary'])
    expect(warnTypeBtn.classes()).toEqual(['weui-btn','weui-btn_warn'])
})

test("render mini button",()=>{
    const wrapper = mount(KButton,{
        propsData: {
            size: 'mini'
          }
    })
    expect(wrapper.classes()).toEqual(['weui-btn','weui-btn_mini','weui-btn_default'])
})

test("render loading",()=>{
    const wrapper = mount(KButton,{
        propsData: {
            loading: true
          }
    })

    const loadingWrapper = wrapper.find('.weui-loading')
    expect(loadingWrapper.is('i')).toBe(true)
})

test('trigger click when disabled',()=>{
    const clickHandler = sinon.fake()

    const parent = {
        components:{
            KButton,
            KView
        },
        template:`
            <KView>
                <KButton id="btn" @click="clickHandler" :disabled="true" ></KButton>
            </KView>
        `,
        methods:{
            clickHandler
        }
    }

    const btn = mount(parent, {}).find('#btn');
    btn.trigger('click')
    expect(clickHandler.called).toBe(false)

})