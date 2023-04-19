<template>
  <!-- 方法一: -->
  <Input style="width: 100%" v-model="val" />
  <!-- 方法二: on-change 有点少个参数-->
  <!-- <Input style="width: 100%" :value="val" @on-change="onChange" /> -->
</template>

<script>
export default {
  props: {
    // 默认传递
    value: String
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
  methods: {
    onChange(val){
      // this.value =  val.target._value
      // 默认使用 input回传
      this.$emit('input', val.target._value)
    }
  }
}
</script>

