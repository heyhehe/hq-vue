<template>
  <div class="gantt" >
    <div ref="gantt" class="gantt-div"></div>
    <vxe-modal ref="ganttModal" v-model="showModal" title="编辑&保存" width="800" resize destroy-on-close>
      <template #default>
        <vxe-form :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="submitEvent">
          <vxe-form-item title="Basic information" span="24" title-align="left" title-width="200px" :title-prefix="{icon: 'fa fa-address-card-o'}"></vxe-form-item>
          <vxe-form-item title="状态" field="status" span="12" :item-render="{name: 'input', attrs: {placeholder: '请输入名称'}}"></vxe-form-item>
          <vxe-form-item title="申请单编号" field="number" span="12" :item-render="{name: 'input', attrs: {placeholder: '请输入昵称'}}"></vxe-form-item>
          <vxe-form-item title="项目编号" field="project" span="12" :item-render="{name: 'input', attrs: {placeholder: '请输入角色'}}"></vxe-form-item>
          <vxe-form-item title="申请人" field="user" span="12" :item-render="{name: '$select', options: userList}"></vxe-form-item>
          <vxe-form-item title="申请日期" field="date" span="12" :item-render="{name: 'input', attrs: {type: 'number', placeholder: '请输入'}}"></vxe-form-item>
          <vxe-form-item title="Other information" span="24" title-align="left" title-width="200px" :title-prefix="{message: '请填写必填项', icon: 'fa fa-info-circle'}"></vxe-form-item>
          <vxe-form-item title="创建人" field="creater" span="12" :item-render="{name: 'input', attrs: {type: 'number', placeholder: '请输入'}}"></vxe-form-item>
          <vxe-form-item title="创建时间" field="createTime" span="12" :item-render="{name: '$input', props: {type: 'date', placeholder: '请选择'}}"></vxe-form-item>
          <vxe-form-item title="备注" field="changeUser" span="24" :title-suffix="{message: '啦啦啦，就是这么强大！！！', icon: 'fa fa-question-circle'}" :item-render="{name: 'textarea', attrs: {placeholder: '请输入地址'}}"></vxe-form-item>
          <vxe-form-item align="center" span="24">
            <template #default>
              <vxe-button type="submit" status="primary">保存</vxe-button>
              <vxe-button @click="$refs.xModal.close()">取消</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>
  </div>
</template>
<script>
  import { Gantt } from 'dhtmlx-gantt';
  export default {
    name: 'gantt',
    props: {
      height: {
        type: String,
        default: '200px'
      },
      tasks: {
        type: Object,
        default () {
          return { data: [], links: [], columns: [] }
        }
      }
    },
    data () {
      return {
        gantt: Gantt.getGanttInstance(), // 初始化gantt
        // 弹出框数据
        showModal: false,
        submitLoading: false,
        userList: [
          { label: '', value: '' },
          { label: '女', value: '0' },
          { label: '男', value: '1' }
        ],
        formData: {
          id: '',
          car: null,
          nickname: null,
          role: null,
          sex: null,
          age: null,
          num: null,
          checkedList: [],
          flag1: null,
          start_date: null,
          address: null
        },
        formRules: {
          name: [
            { required: true, message: '请输入名称' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
          ],
          nickname: [
            { required: true, message: '请输入昵称' }
          ],
          sex: [
            { required: true, message: '请选择性别' }
          ]
        }
      }
    },
    watch:{
      // 监控父值，否则无法实时更新
      tasks:{
        deep:true,
        handler(val){
          let gantt = this.gantt
          gantt.parse(this.$props.tasks)
        },
      }
    },
    mounted: function () {
      let gantt = this.gantt
      gantt.config.xml_date = '%Y-%m-%d'
      this.initColumns() // 初始化列
      this.setConfigs() // 自定义配置
      gantt.init(this.$refs.gantt)
      gantt.parse(this.$props.tasks)
    },
    methods: {
      // 初始化表格列
      initColumns () {
        let gantt = this.gantt
        gantt.config.columns = this.tasks.columns
      },
      initGanttEvents () {
        let self = this
        let gantt = this.gantt
        if (gantt.$_eventsInitialized) {
          return;
        }
        // 监听点击事件
        gantt.attachEvent('onTaskClick', function (id, e) {
          var button = e.target.closest('[data-action]')
          if (button) {
            var action = button.getAttribute('data-action');
            switch (action) {
            case 'edit':
              self.handleNew('edit', id)
              break;
            case 'add':
              self.handleNew('new', id)
              break;
            }
            return false;
          }
          return true;
        })
        // 监听滚动条滚动
        // gantt.attachEvent("onGanttScroll", function (left, top){
        // })
      },
      // 甘特图配置
      setConfigs () {
        let gantt = this.gantt
        // render:"split" 时，需要配置一下这个
        gantt.config.open_split_tasks = true
        // 表格区域宽度
        // gantt.config.autofit = true
        // gantt.config.grid_width = 600
        // 设置滚动条在进度区域内
        gantt.config.layout = {
          css: 'gantt_container',
          cols: [
            {
              // width:gantt.config.grid_width,
              // min_width: 400,
              gravity:1, //各站页面宽度比重
              // adding horizontal scrollbar to the grid via the scrollX attribute
              rows:[
                {view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer"},
                {view: "scrollbar", id: "gridScroll",group:"horizontal"}
              ]
            },
            {resizer: true, width: 1},
            {
              gravity:1, //各站页面宽度比重 1:1就是各50%
              rows:[
                {view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},
                {view: "scrollbar", id: "scrollHor",group:"horizontal"}
              ]
            },
            {view: "scrollbar", id: "scrollVer"}
          ]
        }
        /* eslint-disable */
        // 添加新类型
        // 红色
        gantt.config.types.meetingred = 'MeetingRed'
        gantt.locale.labels.type_meetingred = 'MeetingRed'
        // 橙色
        gantt.config.types.meetingorange = 'MeetingOrange'
        gantt.locale.labels.type_meetingyellow = 'MeetingOrange'
        // 黄色
        gantt.config.types.meetingyellow = 'MeetingYellow'
        gantt.locale.labels.type_meetingyellow = 'MeetingYellow'
        // 绿色
        gantt.config.types.meetinggreen = 'MeetingGreen'
        gantt.locale.labels.type_meetinggreen = 'MeetingGreen'
        // 青色
        gantt.config.types.meetingcyan = 'MeetingCyan'
        gantt.locale.labels.type_meetingcyan = 'MeetingCyan'
        // 蓝色
        gantt.config.types.meetingblue = 'MeetingBlue'
        gantt.locale.labels.type_meetingblue = 'MeetingBlue'

        // 紫色
        gantt.config.types.meetingpurple = 'MeetingPurple'
        gantt.locale.labels.type_meetingpurple = 'MeetingPurple'


        gantt.config.lightbox.meetingred_sections = [
          { name: 'title', height: 20, map_to: 'text', type: 'textarea', focus: true },
          { name: 'details', height: 70, map_to: 'details', type: 'textarea' },
          { name: 'type', type: 'typeselect', map_to: 'type' },
          { name: 'time', height: 72, type: 'time', map_to: 'auto' }
        ]
        gantt.locale.labels.section_title = 'Subject'
        gantt.locale.labels.section_details = 'Details'

        gantt.templates.task_class = function (start, end, task) {
          if (task.type == gantt.config.types.meetingred) {
            return 'meeting_task_red'
          }
          if (task.type == gantt.config.types.meetingorange) {
            return 'meeting_task_orange'
          }
          if (task.type == gantt.config.types.meetingyellow) {
            return 'meeting_task_yellow'
          }
          if (task.type == gantt.config.types.meetinggreen) {
            return 'meeting_task_green'
          }
          if (task.type == gantt.config.types.meetingcyan) {
            return 'meeting_task_cyan'
          }
          if (task.type == gantt.config.types.meetingblue) {
            return 'meeting_task_blue'
          }
          if (task.type == gantt.config.types.meetingpurple) {
            return 'meeting_task_purple'
          }
          return '';
        }

        gantt.templates.task_text = function (start, end, task) {
          if (task.type == gantt.config.types.meetingred
          || task.type == gantt.config.types.meetingorange
          || task.type == gantt.config.types.meetingyellow
          || task.type == gantt.config.types.meetinggreen
          || task.type == gantt.config.types.meetingcyan
          || task.type == gantt.config.types.meetingblue
          || task.type == gantt.config.types.meetingpurple) {
            return '<b>' + task.project_name + '</b>'
          }
          return task.car;
        };
        this.initGanttEvents()
      },
      // 新建模板
      handleNew (action, id) {
        let gantt = this.gantt
        // this.actionTemp = action
        // if (action == 'edit') { // 如果是编辑
        let task = gantt.getTask(id)
        this.formData = {
          status: task.status,
          number: task.number,
          project: task.project
        }
        this.showModal = true
        // this.editTempData = JSON.parse(JSON.stringify(task))
        // this.editTempData.name = this.editTempData.text
        // }
        // this.$refs.template.show = true
      },
      submitEvent () {
        this.showModal = false
        this.$XModal.message({ content: '保存成功', status: 'success' })
        Object.assign(this.selectRow, this.formData)
      }
    }
  }
</script>
<style>
  @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
  .gantt{
    height: 100%;
  }
  .gantt-div{
    height: 100%;
  }
  .meeting_task_red {
      border:2px solid #b74957;
      color:#6ba8e3;
      background: #e77685
  }
  .meeting_task_red .gantt_task_progress{
      background:#c3626f
  }
  .meeting_task_orange {
      border:2px solid #cc9349;
      color:#6ba8e3;
      background: #f8c788
  }
  .meeting_task_orange .gantt_task_progress{
      background:#dc9d4b
  }
  .meeting_task_yellow {
      border:2px solid #BFC518;
      color:#6ba8e3;
      background: #F2F67E
  }
  .meeting_task_yellow .gantt_task_progress{
      background:#D9DF29
  }
    .meeting_task_green {
      border:2px solid #9cc76a;
      color:#6ba8e3;
      background: #b9ea7f
  }
  .meeting_task_green .gantt_task_progress{
      background:#afda7e
  }
  .meeting_task_cyan {
      border:2px solid #6ac3c3;
      color:#6ba8e3;
      background: #75f2f2
  }
  .meeting_task_cyan .gantt_task_progress{
      background:#59dede
  }
  .meeting_task_blue {
      border:2px solid #66a2bb;
      color:#6ba8e3;
      background: #7ad0f4
  }
  .meeting_task_blue .gantt_task_progress{
      background:#6ebada
  }
  .meeting_task_purple {
      border:2px solid #9152c9;
      color:#6ba8e3;
      background: #ba71fc
  }
  .meeting_task_purple .gantt_task_progress{
      background:#a665e0
  }
</style>
