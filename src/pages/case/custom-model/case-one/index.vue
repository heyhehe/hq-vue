<template>
  <div>
    <Button @click="click">父组件</Button>
    <span>{{ `父组件值：${text}` }}</span>

    <!--
      1. 父组件通过v-model绑定text值，名称不一定是value，可以是其他任意符合命名规范的字符串，这里是text。
      2. 子组件通过change事件更新数据后，v-mode绑定值随之变化。
      3. 或者父组件修改text值后，子组件value值随之变化。
    -->

    <!-- <children :value.sync="text"></children> -->
    <children v-model="text"></children>
  </div>
</template>

<script>
import children from "./children";
/*
  结果：
    论是通过父组件改变值，还是子组件改变值。两个组件通过v-mode绑定的值始终保持一致
*/
export default {
  components: { children },
  data() {
    return {
      text: 1
    };
  },
  watch: {
    text(newValue, oldValue) {
      console.log(`父组件值：${newValue}`);
    }
  },
  methods: {
    click() {
      this.text--;
    }
  }
};
</script>
