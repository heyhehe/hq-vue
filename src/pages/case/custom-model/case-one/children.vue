<template>
  <div>
    <Button @click="click">子组件</Button>
    <span>{{ `子组件值：${value}` }}</span>
  </div>
</template>

<script>
export default {
  // model语法糖prop 是接收的props属性value，event是先上传递的事件名。
  // 当未声明双向绑定回传事件 默认使用 input回传  this.$emit("input", this.value)
  // 一个组件上的 v-model 默认会利用名为 value 的 prop 和 input 的 event 事件 注:默认可以省略model
  model: {
    prop: "value",  // 默认 value
    event: "change" // 默认 input回传 
  },
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

      // 子组件在传值的时候，默认选用input，如this.$emit(‘input’,val)，在父组件直接用v-model绑定，就可以获取到了
      this.$emit("change", this.valueData);
      // this.$emit("update:value", this.valueData);
    }
  }
};
</script>
