<template>
  <div :style="{ height: clientHeight - 194 + 'px' }">
    {{ clientHeight }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      clientHeight: document.body.clientHeight
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.clientHeight = window.screenHeight
      })()
    }
  },
  watch: {
    clientHeight(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.clientHeight = val
        this.timer = true
        let that = this
        setTimeout(function () {
          // 打印screenWidth变化的值
          console.log(that.clientHeight)
          that.timer = false
        }, 400)
      }
    }
  }
}
</script>
