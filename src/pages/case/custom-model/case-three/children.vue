<template>
  <div class="main">
    <CheckboxGroup class="box" v-model="value">
      <Checkbox
        v-for="(item, index) in list"
        :label="item"
        :key="index"
      ></Checkbox>
    </CheckboxGroup>
  </div>
</template>

<script>
export default {
  model: {
    prop: "val",  // 默认 value
    event: "change" // 默认 input回传 
  },
  props: {
    val: [String, Array],
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isRadio: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
    };
  },
  computed: {
    value: {
      get() {
        return this.val
      },
      set(val) {
        // 默认使用 input回传
        if (this.isRadio) {
          let tmpVal = [val[val.length - 1]].filter(it=>it)
          this.$emit('change',tmpVal)
        } else {
          this.$emit('change', val);
        }
      }
    }
  },
};
</script>
<style scoped>
.main {
  width: 80px;
  height: 100px;
  border: 1px solid red;
  margin-top: 10px;
}
.box {
  display: flex;
  flex-direction: column;
  margin-left: 4px;
}
</style>
