<template>
  <div>
    <Button @click="click">子组件</Button>
    <span>{{ `子组件值：${value}` }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: Number
  },
  data() {
    return {
      // 由于不能直接修改props属性值，定义valueData，通过监听实时接收value值，通过click方法修改valueData
      valueData: ""
    };
  },
  watch: {
    value(newValue, oldValue) {
      this.valueData = newValue;
      console.log(`子组件值：${newValue}`);
    }
  },
  methods: {
    click() {
      this.valueData++;

      this.$emit("update:value", this.valueData);
    }
  }
};
</script>
