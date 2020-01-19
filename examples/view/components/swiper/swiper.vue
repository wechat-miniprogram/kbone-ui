<template>
  <KView class="page swiper js_show">
    <KView class="page__hd">
      <h1 class="page__title">Swiper</h1>
      <p class="page__desc">Swiper 内容</p>
    </KView>
    <KView class="page__bd page__bd_spacing">
      <KSwiper
        :indicator-dots="indicatorDots"
        :circular="circularFlag"
        :autoplay="autoplay"
        :duration="duration"
        :interval="interval"
        v-model="current"
        @change="changeItem"
      >
        <KSwiperItem
          v-for="(item,index) in background"
          :key="index" >
          <KView :class="'swiper-item '+ item"/>
        </KSwiperItem>
      </KSwiper>
    </KView>
    <KView>
      <KCells>
        <KSwitch
          v-model="indicatorDots"
          label="指示点"
        />
        <KSwitch
          v-model="circularFlag"
          label="衔接滑动"
        />
        <KSwitch
          v-model="autoplay"
          label="自动播放"
        />
      </KCells>
    </KView>
    <KView
      style="margin-top:20px"
      class="page__bd page__bd_spacing">
      <KFlex>
        <KFlexItem>
          幻灯片切换时长
        </KFlexItem>
        <KFlexItem>
          {{ duration }}ms
        </KFlexItem>
      </KFlex>
      <KSlider
        :min="500"
        :max="2000"
        v-model="duration"
      />
    </KView>
    <KView class="page__bd page__bd_spacing">
      <KFlex>
        <KFlexItem>
          自动播放间隔时长
        </KFlexItem>
        <KFlexItem>
          {{ interval }}ms
        </KFlexItem>
      </KFlex>
      <KSlider
        :min="2000"
        :max="10000"
        v-model="interval"
      />
    </KView>
  </KView>
</template>
<script>
export default {
    data() {
        return {
            background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
            indicatorDots: true,
            circularFlag: false,
            autoplay: true,
            vertical: false,
            pointer: false,
            duration: 500,
            interval: 2000,
            current: 0
        }
    },
    methods: {
        changeItem() {
            console.log(this.current)
        }
    }
}

</script>

<style>
.swiper-item{
  display: block;
  height: 150px;
}

.demo-text-1{
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: #1AAD19;
  color: #FFFFFF;
  font-size: 36rpx;
}
.demo-text-1:before{
  content: 'A';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.demo-text-2{
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: #2782D7;
  color: #FFFFFF;
  font-size: 36rpx;
}
.demo-text-2:before{
  content: 'B';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.demo-text-3{
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: #F1F1F1;
  color: #353535;
  font-size: 36rpx;
}
.demo-text-3:before{
  content: 'C';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}


</style>
