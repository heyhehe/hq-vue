<template>
  <Select style="width: 100%" v-model="val" clearable > 
    <Option v-for="item in options" :value="item.field" :key="item.field">{{ item.name }}</Option>
  </Select>
</template>

<script>
export default {
  props: {
    value: [Array,String,Number],
    options:Array,
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(val) {
        // 默认使用 input回传
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {

    }
  },
}
</script>

