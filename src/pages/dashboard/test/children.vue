<template>
  <div>
    <Input v-model="value"></Input>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: [String,Number] // 以前是`value：String`
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val) // 以前是 `this.$emit('input', title)`
      }
    }
  },
};
</script>
