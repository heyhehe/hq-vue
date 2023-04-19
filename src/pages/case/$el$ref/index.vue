<template>
  <div class="home">
    <Button ref="comps" />
    <Button @click="getel()">点击</Button>
  </div>
</template>
<script>
export default {
  methods: {
    getel() {
      // 得到该组件
      // VueComponent {_uid: 248, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: VueComponent, …}
      console.log(this.$refs.comps);

      // 获取Vue实例对象关联的DOM元素
      // <button type=​"button" class=​"ivu-btn ivu-btn-default">​2111111​</button>​
      console.log(this.$refs.comps.$el);

      // 操作dom元素
      this.$refs.comps.$el.innerText = '改变'
      this.$refs.comps.$el.style.color='red'
    }
  }
};
</script>