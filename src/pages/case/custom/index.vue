<template>
  <div>
    <Select
      v-model="pitchOn.value"
      multiple
      style="width: 260px; margin-right: 8px"
      placeholder="请选择弹窗展示内容 ! ! !"
    >
      <Option
        v-for="item in pitchOn.optionList"
        :value="item.value"
        :key="item.value"
        >{{ item.name }}</Option
      >
    </Select>
    <Button type="primary" @click="affirm" :disabled="pitchOn.value == 0"
      >确认</Button
    >

    <Modal v-model="pitchOn.showModal" title="标题">
      <Form ref="formCustom" :model="formData" :label-width="80">
        <Row>
          <Col v-for="(item, index) in listData" span="24" :key="index">
            <FormItem
              :prop="item.field"
              :label="item.name"
              :rules="getRequired(item)"
            >
              <component
                :is="item.type"
                v-if="item.show"
                v-model="formData[item.field]"
                :options="setting"
                :key="item.field"
              />
              <!-- @on-custom-select="handleSelect" -->
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消 </Button>
        <Button type="primary" @click="handleConfirm('formCustom')"
          >确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import customInput from "./custom-input.vue";
import customSelect from "./custom-select.vue";
import customDatepicker from "./custom-datepicker.vue";
// 校验参考表单 可以写数组 自定义校验
const setting = [
  { field: 'datepicker', name: '日期框', type: 'custom-datepicker', show: true, rules: { required: true, message: '请选择日期!', type: 'date', trigger: 'change' } },
  { field: 'select', name: '下拉框', type: 'custom-select', show: true, rules: { required: false } },
  { field: 'input', name: '文本框', identification: 'select', type: 'custom-input', show: true, rules: {required: true, message: '请输入!', trigger: 'blur'  } }
]
export default {
  data() {
    return {
      pitchOn: {
        value: [],
        optionList: [{ name: '文本框', value: 'input' }, { name: '日期框', value: 'datepicker' }, { name: '下拉框', value: 'select' }],
        showModal: false
      },
      setting: setting,
      formData: { datepicker: null, select: null, input: '' },
      listData: [],
    }
  },
  computed: {
    getRequired() { // 返回当前组件是否必填，用于前面清空日期  后面的文本框必填
      return function (item) {
        if (item.type == 'custom-input') { 
          let select = this.formData[item.identification] 
          console.log(select, item);
            if (!select) { // 如果没有值
              this.$nextTick(() => {
                this.$refs.formCustom.validateField(item.field) // 去掉红框
              })
              return { required: false }
            } else { // 如果有值，则后面文本框必填
              return item.rules
            }
        } else {
          return item.rules
        }
      }
    }
  },
  methods: {
    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.info(JSON.stringify(this.formData));
        } else {
          this.$Message.error('请完善数据');
        }
      })
    },
    cancel() {
      this.pitchOn.showModal = false
    },
    affirm() {
      this.formData = { datepicker: new Date(new Date().getTime() + 7 * 1000 * 60 * 60 * 24), select: '', input: '' }
      this.listData = setting.filter(item => this.pitchOn.value.includes(item.field))

      this.pitchOn.showModal = true
    }
  },
  components: {
    customDatepicker, customInput, customSelect
  },
}
</script>

<style></style>
