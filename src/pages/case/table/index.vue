<template>
  <div>
    <Table :columns="columns" :data="data">
    <template #header>Footer</template>
    </Table>
    {{ data }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          title: '下拉',
          key: 'select',
          width: 120,
          rowType: 'select',
          render: (h, params) => {
            return this.createTemp(
              h,
              params,
              this.data,
              null,
              true
            );
          },
        },
        {
          title: '文本',
          key: 'text',
          resizable: true,
          width: 120,
          rowType: 'input',
          render: (h, params) => {
            return this.createTemp(
              h,
              params,
              this.data,
              null,
              true
            );
          },
        },
        {
          title: '数字',
          key: 'num',
          resizable: true,
          width: 120,
          rowType: 'number',
          render: (h, params) => {
            return this.createTemp(
              h,
              params,
              this.data,
              null,
              true
            );
          },
        },
        {
          title: '日期',
          key: 'date',
          resizable: true,
          width: 160,
          rowType: 'date',
          render: (h, params) => {
            return this.createTemp(
              h,
              params,
              this.data,
              null,
              true
            );
          },
        },
        {
          title: '日期时间',
          key: 'datetime',
          resizable: true,
          width: 210,
          rowType: 'datetime',
          render: (h, params) => {
            return this.createTemp(
              h,
              params,
              this.data,
              null,
              true
            );
          },
        },
      ],
      data: [
        {
          text: '文本',
          num: 18,
          select: 'eq',
          date: '2016-10-03',
          datetime: '2022-05-26 06:06:00'
        },
      ],
      selectList: [
        {
          label: '等于',
          value: 'eq',
        },
        {
          label: '不等于',
          value: 'ne',
        },
        {
          label: '大于',
          value: 'gt',
        },
      ],
    }
  },
  methods: {

    // filtercolumns
    changeVal(newVal) {
      if (newVal || newVal === 0) {
        newVal = (1 * newVal).toFixed(2);
      }
      return Number(newVal);
    },
    createTemp(h, params, data, pre, flag) {
      const attr = params.column.key;
      let newVal = params.row[attr];

      if (params.column.rowType === 'select') {
        let create = this.$createElement;
        let list = this.selectList
        return h('div', {}, [
          create(
            'Select',
            {
              props: {
                transfer: true,
                placeholder: '',
                disabled: false,
                clearable: true,
                value: this.data[params.index][attr],
              },
              style: {
                width: '100%',
              },
              on: {
                input: (event) => {
                  data[params.index][attr] = event;
                  newVal = event;
                },
                'on-change': (v) => {
                  // console.log(newVal, attr, pre);
                  this.data[params.index][attr] = newVal ? newVal : '';
                },
              },
            },
            [
              list.map((item) => {
                return h('Option', {
                  props: {
                    value: item.value,
                    label: item.label,
                  },
                });
              }),
            ]
          ),
        ]);
      }

      if (params.column.rowType === 'date') {
        data[params.index][attr]
        return h('DatePicker', {
          class: `${attr}DatePicker`,
          props: {
            value: data[params.index][attr],
            size: 'default',
            min: 0,
            max: 999999999999999,
            disabled: false,
            activeChange: false,
            transfer: true
          },
          style: {
            width: '100%',
            // height: "25px",
            // height: "60%",
          },
          on: {
            'on-change': (val) => {
              if (val != undefined) {
                data[params.index][attr] = val
              }
            },
            input: (val) => {
              if (val.data != undefined) {
                data[params.index][attr] = val.data.trim();
              }
            },
          },
        });
      }

      if (params.column.rowType === 'datetime') {
        return h('DatePicker', {
          class: `${attr}DatePicker`,
          props: {
            value: data[params.index][attr],
            size: 'default',
            min: 0,
            max: 999999999999999,
            disabled: false,
            activeChange: false,
            transfer: true,
            type: "datetime"
          },
          style: {
            width: '100%',
            // height: "25px",
            // height: "60%",
          },
          on: {
            'on-change': (val) => {
              if (val != undefined) {
                data[params.index][attr] = val
              }
            },
            input: (val) => {
              if (val.data != undefined) {
                data[params.index][attr] = val.data.trim();
              }
            },
          },
        });
      }

      if (params.column.rowType === 'input') {
        return h('Input', {
          class: `${attr}Input`,
          props: {
            value: data[params.index][attr],
            size: 'default',
            min: 0,
            max: 999999999999999,
            disabled: false,
            activeChange: false,
          },
          style: {
            width: '100%',
            // height: "25px",
            // height: "60%",
          },
          on: {
            'on-change': (val) => {
              // data[params.index][attr] = val.data;
              if (val.target.value != undefined) {
                data[params.index][attr] = val.target.value.trim();
              }
            },
            'on-blur': () => {
              // if (!flag) {
              //   this.onBlur(newVal, attr, pre);
              // }
            },
            input: (val) => {
              if (val.data != undefined) {
                data[params.index][attr] = val.data.trim();
              }
            },
          },
        });
      }
      if (params.column.rowType === 'number') {
        return h('InputNumber', {
          class: `${attr}InputNumber`,
          props: {
            value: data[params.index][attr],
            size: 'default',
            min: 0,
            max: 999999999999999,
            disabled: false,
            activeChange: false,
          },
          style: {
            width: '100%',
          },
          on: {
            'on-change': (val) => {
                data[params.index][attr] = val
            },
            input: (val) => {
              if (val.data != undefined) {
                data[params.index][attr] = val
              }
            },
          },
        });
      }
      // newVal = this.changeVal(newVal);
      // let create = this.$createElement;
    },

  },
}
</script>
