<template>
  <KView class="page movable js_show kbone-ui-example-movable">
    <KView class="page__hd">
      <h1 class="page__title">Movable</h1>
      <p class="page__desc">MovableArea 和 MovableView 组件</p>
    </KView>
    <KCells title="movable-view区域小于movable-area">
      <KMovableArea class="movable-area">
        <KMovableView
          ref="movableView"
          :x="x"
          :y="y"
          class="movable-view"
          direction="all"
          @change="onChange"
          @scale="onScale"
          @htouchmove="onMove"
          @vtouchmove="onMove"
        >
          text
        </KMovableView>
      </KMovableArea>
      <KButton
        class="page-body-button"
        type="primary"
        @click="tap"
      >
        click me to move to (30px, 30px)
      </KButton>
    </KCells>

    <KCells title="movable-view区域大于movable-area">
      <KMovableArea class="movable-area">
        <KMovableView
          class="movable-view max"
          direction="all"
        >
          text
        </KMovableView>
      </KMovableArea>
    </KCells>

    <KCells title="只可以横向移动">
      <KMovableArea class="movable-area">
        <KMovableView
          class="movable-view"
          direction="horizontal"
        >
          text
        </KMovableView>
      </KMovableArea>
    </KCells>

    <KCells title="只可以纵向移动">
      <KMovableArea class="movable-area">
        <KMovableView
          class="movable-view"
          direction="vertical"
        >
          text
        </KMovableView>
      </KMovableArea>
    </KCells>

    <KCells title="多个 movable-view">
      <KMovableArea class="movable-area">
        <KMovableView
          class="movable-view"
          direction="all"
          x="10"
          y="10"
        >
          hello
        </KMovableView>
        <KMovableView
          class="movable-view"
          direction="all"
          x="140"
          y="140"
        >
          world
        </KMovableView>
      </KMovableArea>
    </KCells>

    <KCells title="可超出边界">
      <KMovableArea class="movable-area">
        <KMovableView
          class="movable-view"
          direction="all"
          out-of-bounds
          @change="onChange"
        >
          text
        </KMovableView>
      </KMovableArea>
    </KCells>

    <KCells title="带有惯性">
      <KMovableArea class="movable-area">
        <KMovableView
          class="movable-view"
          direction="all"
          inertia
        >
          text
        </KMovableView>
      </KMovableArea>
    </KCells>

    <KCells title="可放缩">
      <KMovableArea
        class="movable-area"
        scale-area
      >
        <KMovableView
          :scale-value="scale"
          :scale-min="0.5"
          :scale-max="4"
          class="movable-view"
          direction="all"
          scale
          @change="onChange"
          @scale="onScale"
        >
          text
        </KMovableView>
      </KMovableArea>

      <KView class="btn-area">
        <KButton
          class="page-body-button"
          type="primary"
          @click="tap2"
        >
          click me to scale to {{ nextScale }}
        </KButton>
      </KView>
    </KCells>
  </KView>
</template>

<script>
export default {
    data() {
        return {
            x: 0,
            y: 0,
            scale: 1,
            nextScale: 3,
        }
    },
    methods: {
        tap() {
            this.x = 30
            this.y = 30
            // const movableView = this.$refs.movableView
            // movableView.setX(30)
            // movableView.setY(30)
        },
        tap2() {
            this.scale = this.nextScale
            this.nextScale = Math.floor(Math.random() * 40) / 10
        },
        onChange(e) {
            console.log(e.detail)
        },
        onScale(e) {
            console.log(e.detail)
        },
        onMove(e) {
            console.log(e.touches)
            console.log(e.changedTouches)
        }
    }
}
</script>

<style lang="less">
.kbone-ui-example-movable {
  .movable-view {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    background: #07C160;
    color: #fff;
  }

  .movable-area {
    height: 200px;
    width: 200px;
    margin: 32px;
    background-color: #ccc;
    overflow: hidden;
  }

  .max {
    width: 80vw;
    height: 80vw;
  }

  .page-body-button {
    margin: 32px;
  }
}
</style>
