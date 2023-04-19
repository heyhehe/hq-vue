<template>
  <div>
     <Switch v-model="isRadio">
       <template #open>
          <span>单</span>
        </template>
        <template #close>
          <span>多</span>
        </template>
     </Switch>  {{text}}
    <children v-model="text" :isRadio="isRadio" :list="data"></children>
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
      isRadio:false,
      data:['55G','626','0AHB'],
      text: []
    };
  },
};
</script>
