<template>
    <KView class="page slider js_show">
        <KView class="page__hd">
            <h1 class="page__title">Slider</h1>
            <p class="page__desc">滑块</p>
        </KView>

        <KView class="page__bd page__bd_spacing">
            <KSlider/>
            <KSlider :show-value="true" />
        </KView>

    </KView>

</template>

