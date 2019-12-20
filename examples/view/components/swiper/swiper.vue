<template>
    <KView  class="page swiper js_show">
        <KView class="page__hd">
            <h1 class="page__title">Swiper</h1>
            <p class="page__desc">Swiper 内容</p>
        </KView>
        <KView class="page__bd page__bd_spacing">
            <KSwiper 
                :indicator-dots="indicatorDots"
            >
                <KSwiperItem v-for="(item,index) in background" :key="index" >
                    <KView :class="'swiper-item '+ item"></KView>
                </KSwiperItem>
            </KSwiper>
        </KView>
    </KView>
</template>
<script>
export default {
    data(){
        return {
             background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
             indicatorDots: false,
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