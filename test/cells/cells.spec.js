import { mount } from '@vue/test-utils'
import KboneUI from 'kbone-ui'

const {
    KCell,KCells,KView
} = KboneUI

test('Cells title and footer render ',()=>{
    const container = {
        components: {
            KCell,
            KCells,
            KView
        },
        template: `
            <KView>
                <KCells id="add-title" title="带说明的列表项">
                   <KCell
                     value="标题文字"
                     footer="说明文字" />
                </KCells>
                <KCells id="title-with-footer" title="带说明的列表项" footer="带说明的列表项">
                   <KCell
                     value="标题文字"
                     footer="说明文字" />
                </KCells>
            </KView>
        `
    }
    const wrapper = mount(container)

    const onlyTitle= wrapper.find('#add-title')
    const titleWithFooter = wrapper.find('#title-with-footer')

    expect(onlyTitle.find('.weui-cells__title').text()).toBe('带说明的列表项')
    expect(titleWithFooter.find('.weui-cells__title').text()).toBe('带说明的列表项')
    expect(titleWithFooter.find('.weui-cell__ft').text()).toBe('说明文字')
})