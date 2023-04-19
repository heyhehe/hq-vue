<template>
  <div>
     <DatePicker type="date" v-model="val" style="width: 100%"></DatePicker>
  </div>
</template>

<script>
export default {
  props: {
    value: [Date,String]
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
  }
}
</script>