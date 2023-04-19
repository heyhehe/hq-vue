<template>
    <div style="height: 100%" class="bingo-gantt-wrapper">
        <bingo-toolbar :showAllButton="false" @open-full-modal="openFullModal" :showOpenButton="false" :fullFlag="fullFlag" v-if="type=='template'">
            <span slot="toolbar">
                <Button customIcon="iconfont iconxinjian" type='primary' @click="handleNew('new')">{{$t('page.common.new')}}</Button>
                 <Dropdown v-model="dropFlag" transfer @on-click="dropClick" trigger="click" v-if="type == 'template'"
                           transfer-class-name="gantt-dropdown">
                        <a>
                            {{$t('product.page.templateManage.TheFirst')}}{{dropFlag}}{{$t('product.page.templateManage.day')}}
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="1">1</DropdownItem>
                            <DropdownItem name="2">2</DropdownItem>
                            <DropdownItem name="3">3</DropdownItem>
                            <DropdownItem name="4">4</DropdownItem>
                            <DropdownItem name="5">5</DropdownItem>
                            <DropdownItem name="6">6</DropdownItem>
                            <DropdownItem name="7">7</DropdownItem>
                        </DropdownMenu>
                </Dropdown>
            </span>
        </bingo-toolbar>
        <div ref="gantt" class="gantt-wrapper" :style="type=='template' ? 'height: calc(100% - 102px);' : 'height: calc(100% - 76px)'"></div>
        <div class="page-wrapper-gantt ivu-text-center" v-if="type=='template'">
            <Page placement="top" :total="pageSetting.pageTotal" :page-size="pageSetting.pageSize"
                  :current.sync="pageSetting.pageNum" :show-sizer="pageSetting.showSizer"
                  :page-size-opts="pageSetting.pageSizeOpts" show-total @on-page-size-change="pagesizechange"
                  @on-change="pageNumChange">
            </Page>
        </div>
        <!-- 新建模板 -->
        <new-template ref="template" @on-save="onTemplateSave" :action="actionTemp" :editData="editTempData" :tempGantt="gantt"></new-template>
        <!-- 新建班次 -->
        <new-shift ref="shift" v-if="type == 'template'" @on-save="onShiftSave" :editData="editShiftData" :tempGantt="gantt" :startDate="startDate"
                   :action="actionShift" :tempId="tempId" @new-break="openNewBreak" @on-cancel="undoGantt">
        </new-shift>
        <!-- 新建日历班次 -->
        <new-calendar-shift v-else ref="shift" @on-save="onShiftSave" :editData="editShiftData" :tempGantt="gantt" :startDate="startDate"
                   :action="actionShift" :tempId="tempId" @new-break="openNewBreak" @on-cancel="undoGantt">
        </new-calendar-shift>
        <!-- 新建休息 -->
        <new-break ref="break" v-if="type == 'template'" @on-save="onBreakSave" :editData="editBreakData" :tempGantt="gantt" :startDate="startDate"
                   :action="actionBreak" :tempId="tempId" :shiftId="shiftId" @on-cancel="undoGantt">
        </new-break>
        <!-- 新建休息 -->
        <new-calendar-break v-else ref="break" @on-save="onBreakSave" :editData="editBreakData" :tempGantt="gantt" :startDate="startDate"
                   :action="actionBreak" :tempId="tempId" :shiftId="shiftId" @on-cancel="undoGantt">
        </new-calendar-break>
        <!-- 右键内容 -->
        <Dropdown transfer ref="contentMenu" style="display: none" trigger="click" transfer-class-name="tree-drop-down"
                  @on-click="changeClick">
            <DropdownMenu slot="list">
                <DropdownItem name="edit">
                    <Icon type="md-create" style="margin-right: 10px"></Icon>{{$t('page.common.edit')}}
                </DropdownItem>
                <DropdownItem name="delete" v-if="!(contextFlag == 1 && type=='calendar')"> <!-- 日历的班次不可以删除 -->
                    <Icon type="md-trash" style="margin-right: 10px"></Icon>{{$t('page.common.delete')}}
                </DropdownItem>
                <DropdownItem name="break" v-if="contextFlag == 1">
                    <span class="icon iconfont iconxiuxizhong" style="margin-right: 11px"></span>{{$t('product.page.templateManage.rest')}}
                    <!--<Icon custom="iconxiuxizhong" style="margin-right: 10px"></Icon>休息-->
                </DropdownItem>
                <DropdownItem name="copy" v-if="contextFlag == 1 && type=='template'">
                    <Icon type="md-copy" style="margin-right: 10px"></Icon>{{$t('product.page.templateManage.copy')}}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
    import { Gantt } from 'dhtmlx-gantt';
    import 'dhtmlx-gantt/codebase/locale/locale_cn';
    import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip';
    import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_undo.js';
    import bingoActionDrop from '@/components/bingo-action-drop';
    import newTemplate from './newTemplate'; // 新建模板
    import newShift from './newShift'; // 新建班次
    import newCalendarShift from './newCalendarShift'; // 新建日历班次
    import newBreak from './newBreak'; // 新建休息
    import newCalendarBreak from './newCalendarBreak'; // 新建日历休息
    import { sortDataArray, getNewDate, getDateStr, getTimeStr, getNewSecondDate, getLockData, getDayIndex, getSaveShiftFlag } from './util.js'
    import * as ApiShift from '@/api/product/shift';
    import * as ApiCalendar from '@/api/product/calendar';

    export default {
        name: 'bingo-gantt',
        data () {
            return {
                gantt: Gantt.getGanttInstance(), // 初始化gantt
                showNew: false, // 显示新建模板编辑页
                contextFlag: 1, // 右键节点标识， 1 为右键班次， 2 为右键休息
                contextData: {}, // 右键获取的数据
                tempId: '', // 对应的模板id
                shiftId: '', // 休息对应的班次id
                actionTemp: '', // 新建/编辑模板的状态
                editTempData: {}, // 编辑模板的数据
                actionShift: 'new', // 对应的班次页面状态
                editShiftData: {}, // 编辑班次的数据
                actionBreak: 'new', // 对应的休息页面状态
                editBreakData: {}, // 编辑休息的数据
                isDragShift: false, // 判断是否拖拽了shift，用于拖拽shift保存后同时保存对应的休息
                copyTasks: [], // 复制的班次
                undoExtension: {}, // 记录撤销的操作
                leftLimitArr: [], // 班次左侧的结合
                rightLimitArr: [], // 班次右侧的集合
                xiuLeftLimitArr:[], // 班次向内拖拽的左侧集合
                xiuRightLimitArr: [], // 班次向内拖拽的右侧集合
                dropFlag: '1',
                scrollLeft: 2000, // 水平滚动条滚动的位置
                scrollTop: 0, // 纵向滚动条滚动的位置
            }
        },
        props: {
            tasks: {
                type: Object,
                default () {
                    return {
                        data: [],
                        links: []
                    }
                }
            },
            type: { // 用于区分模板还是日历
                type: String,
                default: 'template'
            },
            startDate: { // 默认的开始日期
                type: [String, Date],
                default: '2020-03-01'
            },
            endDate: { // 默认的结束日期
                type: [String, Date],
                default: '2020-03-10'
            },
            fullFlag: { // 是否全屏
                type: Boolean,
                default: false
            },
            pageSetting: {
                type: Object,
                default: () => {
                    return {
                        pageNum: 1,
                        pageTotal: 0,
                        pageSize: 40,
                        showSizer: true,
                        pageSizeOpts: [10, 20, 40]
                    }
                }
            }
        },
        components: {
            newTemplate,
            bingoActionDrop,
            newShift,
            newCalendarShift,
            newBreak,
            newCalendarBreak
        },
        methods: {
            // 注册甘特图事件
            initGanttEvents: function () { // 初始化事件
                let self = this
                let gantt = this.gantt
                if(gantt.$_eventsInitialized)
                    return;
                // 监听点击事件
                gantt.attachEvent('onTaskClick', function(id, e){
                    var button = e.target.closest('[data-action]')
                    if(button){
                        var action = button.getAttribute('data-action');
                        switch (action) {
                        case 'edit':
                            self.handleNew('edit', id)
                            break;
                        case 'delete':
                            self.handleDelete(id)
                            break;
                        case 'add':
                            self.isDragShift = false
                            self.handleNewShift(id, 'new')
                            break;
                        case 'copy':
                            self.handlePaste(id)
                            break;
                        }
                        return false;
                    }
                    return true;
                });
                // 监听选择当前行的数据
                gantt.attachEvent('onTaskSelected', (id) => {
                    let task = gantt.getTask(id)
                    this.$emit('task-selected', task)
                })
                // 为任务save保存之后事件，点击+按钮即可添加数据 添加数据厚触发
                gantt.attachEvent('onAfterTaskAdd', (id, task) => {
                    this.$emit('task-updated', id, 'inserted', task)
                    task.progress = task.progress || 0
                    if(gantt.getSelectedId() == id) {
                        this.$emit('task-selected', task)
                    }
                })
                // 更新数据后触发
                gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
                    this.$emit('task-updated', id, 'updated', task)
                })
                // 删除数据后触发
                gantt.attachEvent('onAfterTaskDelete', (id) => {
                    this.$emit('task-updated', id, 'deleted')
                    if(!gantt.getSelectedId()) {
                        this.$emit('task-selected', null)
                    }
                })
                // tooltip提示
                gantt.templates.tooltip_date_format = function (date) {
                    var formatFunc = gantt.date.date_to_str('%Y-%m-%d %H:%i');
                    return formatFunc(date);
                };
                gantt.templates.tooltip_text = function (start, end, task) {
                    if (task.bus_type == 'shift' || task.bus_type == 'break') {
                        return '<b>'+$t('product.page.templateManage.name')+':'+'</b>' + task.text + '<br/><b>'+$t('page.form.startTime')+':'+'</b> ' +
                            gantt.templates.tooltip_date_format(start).substring(gantt.templates.tooltip_date_format(start).length-5) +
                            '<br/><b>'+$t('page.form.endTime')+':'+'</b> ' + gantt.templates.tooltip_date_format(end).substring(gantt.templates.tooltip_date_format(end).length-5);
                    }
                };
                // 班次下的任务添加class名称
                gantt.templates.task_class = function (start, end, task) {
                    return task.bus_type == 'shift' ? 'gantt_demo' : ''
                };
                // 班次上文字显示
                gantt.templates.task_text=function(start, end, task){
                    if (task.bus_type == 'shift') {
                        let showFlag = task.workOverTime // 加班时间
                        let parent = gantt.getTask(task.parent)
                        if (showFlag && task.isAvailable) { // 存在加班时间并且要求加班
                            let workDate = ''
                            if (self.type == 'calendar') { // 日历有具体的日期
                                workDate = new Date(showFlag)
                            } else { // 班次没有具体的日期，需要构造
                                workDate = new Date(getDateStr(task.end_date) + ' ' + task.workOverTime)
                                if (+workDate > +task.end_date) { // 说明跨天了
                                    workDate = new Date(+workDate - 1000*3600*24)
                                }
                            }
                            // 计算加班时间的宽度
                            let baiFenBi = '30px'
                            let width = 0
                            if (self.type == 'calendar') { // 如果是日历，并且最后一天跨天被拦断了
                                if (+task.end_date > +parent.endDate) { // 说明跨天
                                    if (+workDate < +parent.endDate) { // 说明加班部分在前一天应该显示
                                        width = (+parent.endDate - +workDate)*70/(1000*60*60)
                                    } else { // 加班在后一天，加班不显示
                                        width = -1
                                    }
                                } else {
                                    width = (+task.end_date - +workDate)*70/(1000*60*60)
                                }
                            } else { // 如果是模板
                                width = (+task.end_date - +workDate)*70/(1000*60*60)
                            }
                            if (width == -1) {
                                return `<div class="sigma-content">
                                    <span> ${task.text}</span>
                                </div>`;
                            }
                            if (width < 30) {
                                baiFenBi = 30 + 'px'
                            } else {
                                baiFenBi = width + 'px'
                            }
                            if (+workDate >= +task.start_date && +workDate <= +task.end_date) {
                                return `<div class="sigma-content">
                                    <span> ${task.text}</span>
                                    <div class="sigma-middle-line" style="width: ${baiFenBi};">
                                        <span class="sigma-line-text">加班</span>
                                    </div>
                                </div>`;
                            } else { // 加班时间在班次时间范围外的话则不显示加班
                                return `<div class="sigma-content">
                                    <span> ${task.text}</span>
                                </div>`;
                            }
                        } else {
                            return `<div class="sigma-content">
                                <span> ${task.text}</span>
                            </div>`;
                        }
                    } else {
                        return '<span>' + task.text + '</span>';
                    }
                };
                // 拖拽前的操作 甘特的撤销记录
                gantt.attachEvent('onBeforeTaskDrag', function(id, mode, e){
                    let task = gantt.getTask(id)
                    let modes = gantt.config.drag_mode;
                    let currentTask = task // 当前拖动的班次
                    // 控制班次节点向外侧拖拽范围
                    if (task.bus_type == 'shift') {
                        self.leftLimitArr = [] // 左侧的兄弟节点
                        self.rightLimitArr = [] // 右侧的兄弟节点
                        gantt.getSiblings(task.id).forEach(item => { // 寻找他同级节点并且时间大于结束时间的班次开始时间
                            let nextTask = gantt.getTask(item)
                            if (nextTask.bus_type == 'shift' && +nextTask.end_date <= +currentTask.start_date) {
                                self.leftLimitArr.push(new Date(+nextTask.end_date + 60*1000))
                            }
                            if (nextTask.bus_type == 'shift' && +nextTask.start_date >= +currentTask.end_date) {
                                self.rightLimitArr.push(new Date(+nextTask.start_date - 60*1000))
                            }
                        })
                        self.leftLimitArr = sortDataArray(self.leftLimitArr, 'desc') // 降序
                        self.rightLimitArr = sortDataArray(self.rightLimitArr, 'asc') // 升序
                        if (mode == modes.resize) { // 拖拉两边
                            self.xiuLeftLimitArr = [] // 左侧的兄弟节点
                            self.xiuRightLimitArr = [] // 左侧的兄弟节点
                            gantt.getSiblings(task.id).forEach(item => { // 寻找该班次的休息节点
                                let nextTask = gantt.getTask(item)
                                if (nextTask.bus_type == 'break' && currentTask.id == nextTask.bus_parent) {
                                    self.xiuLeftLimitArr.push(nextTask.start_date)
                                    self.xiuRightLimitArr.push(nextTask.end_date)
                                }
                            })
                            self.xiuLeftLimitArr = sortDataArray(self.xiuLeftLimitArr, 'asc') // 升序
                            self.xiuRightLimitArr = sortDataArray(self.xiuRightLimitArr, 'desc') // 降序
                        }
                    }
                    // 拖拽前记录可撤销的操作
                    self.undoExtension = gantt.ext.undo;
                    gantt.getChildren(task.parent).forEach(function (child) {
                        let objChildTask = gantt.getTask(child)
                        if (objChildTask.bus_type == 'break' && objChildTask.bus_parent == task.id) { // 判断是否是当前班次下的排班节点
                            self.tasks.data.forEach(item => {
                                if (item.id == child) {
                                    self.undoExtension.saveState(item.id, 'task');
                                }
                            })
                        }
                    })
                    // 日历拖拽判断是否超过已发生的时间
                    if (self.type == 'calendar') {
                        let date = new Date()
                        if (+task.end_date <= +date) {
                            if (task.bus_type == 'shift') {
                                self.$BMessage.warning($t('product.page.templateManage.FrequencyNoEdit'));
                            } else if (task.bus_type == 'break') {
                                self.$BMessage.warning($t('product.page.templateManage.restNoEdit'));
                            }
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                });
                // 拖拽时触发
                gantt.attachEvent('onTaskDrag', function(id, mode, task, original){
                    let modes = gantt.config.drag_mode;
                    if(mode == modes.move || mode == modes.resize){
                        if (task.bus_type == 'shift') { // 判断如果是班次节点拖拽
                            // 控制班次节点向外侧拖拽范围
                            let diff = original.duration*1000*60; // 拖动的距离
                            let currentTask = task // 当前拖动的班次
                            let leftLimit = ''
                            let rightLimit = ''
                            if (self.type == 'template') { // 如果是模板
                                leftLimit = new Date(self.leftLimitArr.length ? self.leftLimitArr[0] : new Date('2020-02-29 23:00:00'))// 可拖动的最左侧
                                rightLimit = new Date(self.rightLimitArr.length ? self.rightLimitArr[0] : new Date('2020-03-10 01:00:00')) // 可拖动的最右侧
                            } else if (self.type == 'calendar') { // 如果是日历的话，最左侧拖拽到0点，右侧不可超过24小时
                                let start1 = new Date(new Date().toLocaleDateString())
                                let end1 = new Date(+task.start_date + 1000*3600*24)
                                leftLimit = new Date(self.leftLimitArr.length ? self.leftLimitArr[0] : start1)// 可拖动的最左侧
                                rightLimit = new Date(self.rightLimitArr.length ? self.rightLimitArr[0] : end1) // 可拖动的最右侧
                            }

                            if(+task.end_date >= +rightLimit){ // +代表转换成时间戳
                                task.end_date = new Date(rightLimit);
                                if(mode == modes.move) { // 判断是move(整体拖动)还是resize(拖动两边)
                                    task.start_date = new Date(task.end_date - diff);
                                }
                            }
                            if(+task.start_date <= +leftLimit){
                                task.start_date = new Date(leftLimit);
                                if(mode == modes.move) {
                                    task.end_date = new Date(+task.start_date + diff);
                                }
                            }
                            // 拖拽两侧
                            if (mode == modes.resize) { // 判断是move(整体拖动)还是resize(拖动两边)
                                // 内测拖拽
                                if (self.xiuLeftLimitArr.length) { // 如果存在休息节点
                                    let xiuLeftLimit = self.xiuLeftLimitArr[0]
                                    let xiuRightLimit = self.xiuRightLimitArr[0]
                                    if(+task.end_date <= +xiuRightLimit){ // +代表转换成时间戳
                                        task.end_date = new Date(+xiuRightLimit + 60*1000);
                                    }
                                    if(+task.start_date >= +xiuLeftLimit){
                                        task.start_date = new Date(+xiuLeftLimit - 60*1000);
                                    }
                                }
                                // 外侧拖拽，拖拽不能超过24小时
                                if(+task.end_date >= (+task.start_date + 1000*3600*24)){ // +代表转换成时间戳
                                    task.end_date = new Date(+task.start_date + 1000*3600*24);
                                }
                                if(+task.start_date <= (+task.end_date - 1000*3600*24)){ // +代表转换成时间戳
                                    task.start_date = new Date(+task.end_date - 1000*3600*24);
                                }
                            }
                            // 控制控制是否能拖拽到第0天或者第8天
                            if (self.type == 'template') {
                                let tempTask = gantt.getTask(task.parent)
                                let firstDate = new Date(tempTask.startDate)
                                let secondDate = new Date(tempTask.endDate)
                                if (task.workOwn == 0) { // 开始 如果归属开始，则开始时间不能拖拽到第0天
                                    if(+task.start_date >= +secondDate){ // +代表转换成时间戳
                                        task.start_date = new Date(secondDate);
                                        if(mode == modes.move) { // 判断是move(整体拖动)还是resize(拖动两边)
                                            task.end_date = new Date(+task.start_date + diff);
                                        }
                                    }
                                    if(+task.start_date <= +firstDate){
                                        task.start_date = new Date(firstDate);
                                        if(mode == modes.move) {
                                            task.end_date = new Date(+task.start_date + diff);
                                        }
                                    }
                                } else if (task.workOwn == 1) { // 结束 如果归属结束，则结束时间不能拖拽到第0天
                                    if(+task.end_date <= +firstDate){ // +代表转换成时间戳
                                        task.end_date = new Date(firstDate);
                                        if(mode == modes.move) { // 判断是move(整体拖动)还是resize(拖动两边)
                                            task.start_date = new Date(+task.end_date - diff);
                                        }
                                    }
                                    if(+task.end_date >= +secondDate){
                                        task.end_date = new Date(secondDate);
                                        if(mode == modes.move) {
                                            task.start_date = new Date(+task.end_date - diff);
                                        }
                                    }
                                }
                            }
                            // 控制休息节点跟随班次节点拖动
                            if(mode == modes.move) {
                                if(+task.end_date <= +rightLimit && +task.start_date >= +leftLimit){
                                    var diff_b = task.start_date - original.start_date;
                                    let obgTask = task // 班次节点
                                    gantt.getChildren(task.parent).forEach(function (child) {
                                        let objChildTask = gantt.getTask(child)
                                        if (objChildTask.bus_type == 'break' && objChildTask.bus_parent == obgTask.id) { // 判断是否是当前班次下的排班节点
                                            objChildTask.start_date = new Date(+objChildTask.start_date + diff_b);
                                            objChildTask.end_date = new Date(+objChildTask.end_date + diff_b);
                                            gantt.refreshTask(objChildTask.id, true);
                                            gantt.updateTask(objChildTask.id);
                                        }
                                    })
                                }
                            }
                        } else if (task.bus_type == 'break') { // 判断当前任务是休息模块
                            let diff = original.duration*1000*60;
                            let currentTask = original // 当前拖动的休息节点
                            let bus_parent = this.getTask(task.bus_parent) // 获取休息模块对应的班次
                            let leftLimit = new Date(bus_parent.start_date) // 可拖动的最左侧
                            let rightLimit = new Date(bus_parent.end_date) // 可拖动的最右侧
                            // 控制不能与同级休息节点重合
                            let leftLimitArr = [] // 左侧的兄弟节点
                            let rightLimitArr = [] // 右侧的兄弟节点
                            gantt.getChildren(task.parent).forEach(item => { // 寻找同级的休息节点
                                let nextTask = gantt.getTask(item)
                                if (nextTask.bus_type == 'break' && nextTask.id != currentTask.id && nextTask.bus_parent == currentTask.bus_parent
                                    && +nextTask.end_date <= +currentTask.start_date) {
                                    leftLimitArr.push(new Date(+nextTask.end_date + 60*1000))
                                }
                                if (nextTask.bus_type == 'break' && nextTask.id != currentTask.id && nextTask.bus_parent == currentTask.bus_parent
                                    && +nextTask.start_date >= +currentTask.end_date) {
                                    rightLimitArr.push(new Date(+nextTask.start_date - 60*1000))
                                }
                            })
                            leftLimitArr = sortDataArray(leftLimitArr, 'desc') // 降序
                            rightLimitArr = sortDataArray(rightLimitArr, 'asc') // 升序
                            let xiuLeftLimit = new Date(leftLimitArr.length ? leftLimitArr[0] : leftLimit)// 可拖动的最左侧
                            let xiuRightLimit = new Date(rightLimitArr.length ? rightLimitArr[0] : rightLimit) // 可拖动的最右侧
                            if(+task.end_date >= +xiuRightLimit){ // +代表转换成时间戳
                                task.end_date = new Date(+xiuRightLimit - 60*1000); // 减1分钟不能和班次重叠
                                if(mode == modes.move) { // 判断是move(整体拖动)还是resize(拖动两边)
                                    task.start_date = new Date(task.end_date - diff);
                                }
                            }
                            if(+task.start_date <= +xiuLeftLimit){
                                task.start_date = new Date(+xiuLeftLimit + 60*1000); // 加1分钟不能和班次重叠
                                if(mode == modes.move) {
                                    task.end_date = new Date(+task.start_date + diff);
                                }
                            }
                        }
                    }
                });
                // 拖拽后时触发
                gantt.attachEvent('onAfterTaskDrag', function(id, mode, e){
                    let task = gantt.getTask(id)
                    task.startDate = getTimeStr(task['start_date']) // 截取时间
                    task.endDate = getTimeStr(task['end_date'])
                    if (task.bus_type == 'shift') { // 拖拽班次
                        self.isDragShift = true
                        task.durationTime = getLockData(task.start_date, task.end_date, 'lockDuration')
                        task.day = getDayIndex(task.start_date, task.end_date, task.workOwn)
                        self.handleNewShift(id, 'edit')
                    } else if (task.bus_type == 'break') { // 拖拽休息
                        task.durationTime = getLockData(task.start_date, task.end_date, 'lockDuration')
                        self.openNewBreak(id, 'edit')
                    }
                });
                // 监听双击事件
                gantt.attachEvent('onTaskDblClick', (id) => {
                    let task = gantt.getTask(id)
                    // 双击班次 并且存在bus_id,日历中bus_id区分日历是否已生成，bus_id为空的数据不可编辑
                    // 日历已发生的时间不可编辑
                    let date = new Date()
                    if (+task.end_date <= +date && self.type == 'calendar') { // 如果是日历并且已发生班次
                        if (task.bus_type == 'shift') {
                            self.$BMessage.warning($t('product.page.templateManage.FrequencyNoEdit'));
                        } else {
                            self.$BMessage.warning($t('product.page.templateManage.restNoEdit'));
                        }
                    } else {
                        if (task.bus_type == 'shift' && task.bus_id) {
                            self.isDragShift = false
                            self.handleNewShift(id, 'edit')
                        } else if (task.bus_type == 'break' && task.bus_id) { // 双击休息
                            self.openNewBreak(id, 'edit')
                        }
                    }
                })
                // 监听右键事件
                gantt.attachEvent('onContextMenu', function (id, linkId, event) {
                    event.preventDefault()
                    let task = gantt.getTask(id)
                    self.contextData = task // 记录右键的数据
                    // 右键班次 并且存在bus_id,日历中bus_id区分日历是否已生成，bus_id为空的数据不可编辑
                    // 日历已发生的时间不可编辑
                    let date = new Date()
                    if (+task.end_date <= +date && self.type == 'calendar') { // 如果是日历并且已发生班次
                        if (task.bus_type == 'shift') {
                            self.$BMessage.warning($t('product.page.templateManage.FrequencyNoEdit'));
                        } else {
                            self.$BMessage.warning($t('product.page.templateManage.restNoEdit'));
                        }
                    } else {
                        if (task && task.bus_type == 'shift' && task.bus_id) {
                            self.contextFlag = 1
                            self.$refs.contentMenu.$refs.reference = event.target
                            self.$refs.contentMenu.currentVisible = !self.$refs.contentMenu.currentVisible
                            // document.getElementsByClassName('tree-drop-down')[0].style.marginLeft = event.pageX + 'px'
                        } else if (task && task.bus_type == 'break' && task.bus_id) { // 右键休息
                            self.contextFlag = 2
                            self.$refs.contentMenu.$refs.reference = event.target
                            self.$refs.contentMenu.currentVisible = !self.$refs.contentMenu.currentVisible
                        }
                        return true;
                    }
                });
                // 滚动事件，获取水平和纵向滚动的位置
                gantt.attachEvent('onGanttScroll', function (left, top){
                    self.scrollLeft = left
                    self.scrollTop = top
                    if (self.type == 'template') {
                        self.dropFlag = Math.floor(self.scrollLeft/1680)
                        if (self.dropFlag < 1) {
                            self.dropFlag = '1'
                        } else if (self.dropFlag > 7) {
                            self.dropFlag = '7'
                        } else {
                            self.dropFlag = self.dropFlag.toString()
                        }
                    }
                });

                gantt.$_eventsInitialized = true;
            },
            // 初始化表格列
            initColumns () {
                let gantt = this.gantt
                // 自定义列
                if (this.type == 'template') { // 如果是模板
                    var colContent = function (task) {
                        return ('<i class="ivu-icon ivu-icon-md-create" style="margin-left: 5px;font-weight: bold" data-action="edit"></i>' +
                            '<i class="ivu-icon ivu-icon-md-close" style="margin-left: 5px;font-weight: bold" data-action="delete"></i>' +
                            '<i class="ivu-icon ivu-icon-md-add" style="margin-left: 5px;font-weight: bold" data-action="add"></i>' +
                            '<i class="ivu-icon ivu-icon-ios-copy" style="margin-left: 5px" data-action="copy"></i>');
                    };
                    gantt.config.columns = [
                        {name: 'wbs', label:$t('page.common.index'), min_width: 40, template: gantt.getWBSCode, align: 'center', resize: true, },
                        {name: 'buttons', label: $t('page.common.action'), align: 'center', width: '*', template: colContent, resize: true, },
                        {name: 'text', label: $t('product.page.templateManage.name'), tree: true, width: '*', align: 'center', width: 80, resize: true},
                        // {name: 'start_date', align: 'center', resize: true},
                        {name: 'durationDay', label: $t('product.page.templateManage.Duration')+'('+$t('product.page.common.day')+')', align: 'center'},
                        // {name: 'color', align: 'center', label:'颜色', editor: colorEditor},
                        // {name: 'add', width: 44}
                    ];
                } else if (this.type == 'calendar') { // 如果是日历
                    gantt.config.columns = [
                        {name: 'wbs', label: $t('page.common.index'), width: 40, template: gantt.getWBSCode, align: 'center', resize: true},
                        {name: 'text', label: $t('product.page.common.workArea'), tree: true, width: '*', align: 'center', resize: true},
                    ];
                }
            },
            // 甘特图配置
            setConfigs () {
                let gantt = this.gantt
                //设置甘特图的表头高度
                gantt.config.scale_height = 33;
                // gantt.config.grid_width = 500; // 表格区域宽度
                // 定义工作范围
                let calendar = gantt.getCalendar('global');
                for (let key in calendar.worktime.dates) {
                    delete calendar.worktime.dates[key];
                }
                gantt.setWorkTime({ hours: [0, 24] });
                // 设置表格宽度
                gantt.config.autofit = true;
                gantt.config.grid_width = 350;
                // 调整可滚动网格内的列宽
                gantt.config.grid_elastic_columns = true;
                // 拖动任务时是否自动滚动
                gantt.config.autoscroll = true;
                // 拖拽调整任务工期
                gantt.config.drag_resize = true;
                // 自动调整整体时间
                gantt.config.fit_tasks = true;
                gantt.config.duration_unit = 'minute';
                // 任务最小单位 1分钟
                gantt.config.min_duration = 1000
                // 拖拽按分钟调整按分钟调整
                gantt.config.time_step = 1;
                gantt.config.round_dnd_dates = false;
                // 是否显示连接线
                gantt.config.show_links = false;
                // 是否显示进度
                gantt.config.show_progress = false;
                // 设置时标的单位（X轴）"minute", "hour", "day", "week", "quarter", "month", "year"
                gantt.config.scale_unit = 'hour';
                // 设置时间刻度的格式（X轴）默认值： “％d％M”
                gantt.config.date_scale = '%H:%i';
                gantt.config.xml_date = '%Y-%m-%d %H:%i';
                gantt.config.work_time = true;
                if (this.type == 'template') { // 如果是模板
                    // 定义列头显示，七天工作计划
                    gantt.config.subscales = [
                        { unit: 'day', step: 1, format: function (date) {
                            let day = date.getDate()
                            let week = date.getDay()
                            if (day == 1) {
                                return '<strong style="color: #515a6e">'+$t('product.page.templateManage.TheFirst') + 0 + $t('product.page.templateManage.day') + '</strong>';
                            } else if (day == 8) {
                                return '<strong style="color: #515a6e">'+$t('product.page.templateManage.TheFirst') + 7 + $t('product.page.templateManage.day')+ '</strong>';
                            } else if (day == 9) {
                                return '<strong style="color: #515a6e">'+$t('product.page.templateManage.TheFirst') + 8 + $t('product.page.templateManage.day') + '</strong>';
                            } else {
                                return '<strong style="color: #515a6e">'+$t('product.page.templateManage.TheFirst') + week + $t('product.page.templateManage.day')+'</strong>';
                            }
                        }
                        }
                    ];
                } else if (this.type == 'calendar') { // 如果是日历
                    // 定义列头显示，七天工作计划
                    gantt.config.subscales = [
                        { unit: 'day', step: 1, format: function (date) {
                            return '<strong style="color: #515a6e">' + getDateStr(date) + '</strong>';
                        }
                        }
                    ];
                    // 设置表格宽度
                    gantt.config.grid_width = 150
                }
                // 禁止双击
                gantt.config.details_on_dblclick = false;
                // 设置滚动条在进度区域内
                gantt.config.layout = {
                    css: 'gantt_container',
                    cols: [
                        {
                            width: gantt.config.grid_width,
                            min_width: 100,
                            rows: [
                                { view: 'grid', scrollX: 'gridScroll', scrollY: 'scrollVer' },
                                { view: 'scrollbar', id: 'gridScroll', group:'horizontal' }
                            ]
                        },
                        { resizer: true, width: 1 },
                        {
                            rows: [
                                { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
                                { view: 'scrollbar', id: 'scrollHor', group: 'horizontal' }
                            ]
                        },
                        { view: 'scrollbar', id: 'scrollVer' }
                    ]
                };

                //设置行高 36
                gantt.config.row_height = 56;
                gantt.config.task_height = 36;
                this.initGanttEvents();
            },
            // 新建模板
            handleNew (action, id) {
                let gantt = this.gantt
                this.actionTemp = action
                if (action == 'edit') { // 如果是编辑
                    let task = gantt.getTask(id)
                    this.editTempData = JSON.parse(JSON.stringify(task))
                    this.editTempData.name = this.editTempData.text
                }
                this.$refs.template.show = true
            },
            // 删除模板
            handleDelete (id) {
                let gantt = this.gantt
                let task = gantt.getTask(id)
                this.$Modal.confirm({
                    title: $t('page.common.PleaseConfirm'),
                    content: '<p>'+$t('page.common.isDelete')+'</p>',
                    onOk: () => {
                        ApiShift.delTemplateData(task.bus_id).then(res => {
                            if (res.code == 901) {
                                this.$BMessage.warning(res.msg);
                            } else {
                                this.$BMessage.success($t('page.common.delSuccess'));
                                this.pageSetting.pageNum = 1 // 删除后回到第一页
                                // this.tableDatas = res.data.rows; // 删除后返回数据更新列表
                                gantt.deleteTask(id);
                                this.refreshGantt()
                            }
                        });
                    }
                });
            },
            // 新建班次 新建id是模板的id ， 编辑id是当前班次的id
            handleNewShift (id, action) {
                let gantt = this.gantt
                let task = gantt.getTask(id)
                this.actionShift = action
                // 获取模板节点的id
                if (action == 'new') {
                    this.tempId = task.templateId
                } else if (action == 'edit') {
                    this.tempId = task.parent
                    this.editShiftData = task
                }
                this.$refs.shift.show = true
            },
            // 新建休息 新建id是班次的id， 编辑id是休息的id
            openNewBreak (id, action) {
                let gantt = this.gantt
                this.actionBreak = action
                let task = gantt.getTask(id)
                this.tempId = task.parent
                if (action == 'new') {
                    this.shiftId = id
                } else if (action == 'edit') {
                    this.shiftId = task.bus_parent
                    this.editBreakData = task
                }
                this.$refs.break.show = true
            },
            // 新建模板保存
            onTemplateSave (value, callBack) {
                let gantt = this.gantt
                this.actionTemp = 'edit'
                callBack()
                this.$emit('on-temp-save', gantt)
            },
            // 新建班次保存 data新建的数据，tempId模板的id
            onShiftSave (data, tempId, callBack) {
                let self = this
                let gantt = this.gantt
                this.actionShift = 'edit'
                callBack()
                // 如果是拖拽班次保存，则保存对应的休息
                if (this.isDragShift) {
                    let task = gantt.getTask(data.id)
                    this.isDragShift = false
                    // 判断是否有休息
                    let breakArr = []
                    gantt.getChildren(task.parent).forEach(function (child) {
                        let childTask = gantt.getTask(child)
                        if (childTask.bus_type == 'break' && childTask.bus_parent == task.id) { // 休息
                            breakArr.push(childTask)
                        }
                    })
                    if (breakArr.length == 0) { // 说明没有休息
                        self.refreshGantt()
                        return
                    }
                    // 有休息的话保存休息
                    gantt.getChildren(task.parent).forEach(function (child) {
                        let childTask = gantt.getTask(child)
                        if (childTask.bus_type == 'break' && childTask.bus_parent == task.id) { // 休息
                            let params = JSON.parse(JSON.stringify(childTask))
                            params.workId = task.id
                            params.durationTime = params.durationTime.hours*60 + params.durationTime.minutes
                            params.lockDuration = params.lockDuration ? 1 : 0
                            params.lockEnd = params.lockEnd ? 1 : 0
                            params.lockStart = params.lockStart ? 1 : 0
                            params.startDate = getTimeStr(params['start_date']) // 截取时间
                            params.endDate = getTimeStr(params['end_date'])
                            params.id = 0
                            if (self.type == 'calendar') { // 日历的话
                                params.calendarWorkId = params.workId
                                params.startDateTime = getDateStr(new Date(params.start_date)) + ' ' + params.startDate + ':00'
                                params.endDateTime = getDateStr(new Date(params.end_date)) + ' ' + params.endDate + ':00'
                                ApiCalendar.editBreakCalendarData(params).then(res => {
                                    self.refreshGantt()
                                })
                            } else {
                                ApiShift.editBreakData(params).then(res => {
                                    self.refreshGantt()
                                })
                            }
                        }
                    })
                    // this.$emit('on-shift-save', gantt)
                } else {
                    this.$emit('on-shift-save', gantt)
                }
            },
            // 新建休息保存 data新建的数据，tempId模板的id, shiftId班次的id
            onBreakSave (data, tempId, shiftId, callBack) {
                let gantt = this.gantt
                this.actionBreak = 'edit'
                callBack()
                this.$emit('on-break-save', gantt)
            },
            // 节点右键菜单选中
            changeClick (value) {
                if (value === 'edit') {
                    if (this.contextData.bus_type == 'shift') {
                        this.handleNewShift(this.contextData.id, 'edit')
                    } else if (this.contextData.bus_type == 'break') {
                        this.openNewBreak(this.contextData.id, 'edit')
                    }
                } else if (value === 'delete') {
                    this.contentDelete(this.contextData.id)
                } else if (value === 'break') {
                    this.openNewBreak(this.contextData.id, 'new')
                } else if (value === 'copy') {
                    this.contentCopy(this.contextData.id)
                }
            },
            // 右键删除
            contentDelete (id) {
                let self = this
                let gantt = this.gantt
                let task = gantt.getTask(id)
                this.$Modal.confirm({
                    title: $t('page.common.PleaseConfirm'),
                    content: '<p>'+$t('page.common.isDelete')+'</p>',
                    onOk: () => {
                        if (task['bus_type'] == 'shift') { // 班次删除
                            ApiShift.delShiftData(task.bus_id).then(res => {
                                this.$BMessage.success($t('page.common.delSuccess'));
                                // this.tableDatas = res.data.rows; // 删除后返回数据更新列表
                                gantt.deleteTask(id);
                                gantt.getChildren(task.parent).forEach(function (child) {
                                    let objChildTask = gantt.getTask(child)
                                    if (objChildTask.bus_type == 'break' && objChildTask.bus_parent == task.id) { // 判断是否是当前班次下的排班节点
                                        gantt.deleteTask(child);
                                    }
                                })
                                this.refreshGantt()
                            });
                        } else if (task['bus_type'] == 'break') {
                            if (self.type == 'template') {
                                ApiShift.delBreakData(task.bus_id).then(res => {
                                    this.$BMessage.success($t('page.common.delSuccess'));
                                    // this.tableDatas = res.data.rows; // 删除后返回数据更新列表
                                    gantt.deleteTask(id);
                                    this.refreshGantt()
                                });
                            } else if (self.type == 'calendar') {
                                ApiCalendar.delBreakCalendarData(task.bus_id).then(res => {
                                    this.$BMessage.success($t('page.common.delSuccess'));
                                    // this.tableDatas = res.data.rows; // 删除后返回数据更新列表
                                    gantt.deleteTask(id);
                                    this.refreshGantt()
                                });
                            }
                        }
                    }
                });
            },
            // 右键复制
            contentCopy (id) {
                let self = this
                let gantt = this.gantt
                let task = gantt.getTask(id)
                this.copyTasks = []
                this.copyTasks.push(task)
                gantt.getChildren(task.parent).forEach(function (child) {
                    let objChildTask = gantt.getTask(child)
                    if (objChildTask.bus_type == 'break' && objChildTask.bus_parent == task.id) { // 判断是否是当前班次下的排班节点
                        self.copyTasks.push(objChildTask)
                    }
                })
                this.$BMessage.success($t('page.common.CopySucceeded'));
            },
            // 粘贴功能
            handlePaste (id) {
                // alert('粘贴在' + id)
                let self = this
                let gantt = this.gantt
                let tempTask = gantt.getTask(id) // 获取模板
                let rightLimitArr = [] // 右侧的班次节点
                let leftLimitArr = [] // 右侧的班次节点
                if (this.copyTasks.length) {
                    gantt.getChildren(tempTask.id).forEach(item => { // 获取该模板下的节点
                        let shiftTask = gantt.getTask(item)
                        if (shiftTask.bus_type == 'shift') { // 判断如果是班次
                            rightLimitArr.push(shiftTask.end_date)
                            leftLimitArr.push(shiftTask.start_date)
                        }
                    })
                    if (rightLimitArr.length) {
                        rightLimitArr = sortDataArray(rightLimitArr, 'desc') // 降序
                        leftLimitArr = sortDataArray(leftLimitArr, 'desc') // 降序
                        let defaultDate = new Date(+rightLimitArr[0] + 60*1000) // 定位的位置
                        self.copySave(defaultDate, id)
                    } else {
                        let defaultDate = new Date('2020-03-02 08:00') // 默认创建在八点位置
                        self.copySave(defaultDate, id)
                    }
                } else {
                    this.$BMessage.warning($t('product.page.templateManage.PleaseCopyTheDataFirst'));
                }
            },
            // 粘贴保存
            copySave (defaultDate, id) {
                let gantt = this.gantt
                // 复制下拷贝的数据
                let oldCopyTask = JSON.parse(JSON.stringify(this.copyTasks))
                this.copyTasks.forEach(item => {
                    if (item.bus_type == 'shift') { // 如果是班次
                        let flagDay = getDayIndex(new Date(defaultDate), new Date(getNewSecondDate(defaultDate, item.duration, 0)),
                                                  item.workOwn)
                        // 判断是否可以粘贴
                        let tempTask = gantt.getTask(id) // 获取模板
                        if (flagDay > tempTask.durationDay) { // 说明已超出模板范围
                            this.$BMessage.warning($t('product.page.templateManage.UnableToPaste'));
                            this.copyTasks = []
                        } else {
                            item.start_date = new Date(+defaultDate)
                            item.end_date = new Date(getNewSecondDate(item.start_date, item.duration, 0))
                            item.startDate = getTimeStr(item.start_date)
                            item.endDate = getTimeStr(item.end_date)
                            item.parent = id
                            item.templateId = id
                            let params = JSON.parse(JSON.stringify(item))
                            params.lockDuration = params.lockDuration ? 1 : 0
                            params.lockEnd = params.lockEnd ? 1 : 0
                            params.lockStart = params.lockStart ? 1 : 0
                            params.isAvailable  = 0
                            params.workOverTime  = ''
                            params.durationTime = params.durationTime.hours*60 + params.durationTime.minutes
                            params.day = flagDay
                            let flag = true
                            flag = this.getCopyCondition(params.templateId, params)
                            if (flag) { // 判断模板首尾的班次是否重叠
                                ApiShift.newShiftData(params).then(res => {
                                    if (this.copyTasks.length == 1) { // 如果复制的只有班次
                                        this.$BMessage.success($t('page.common.success'));
                                        this.refreshGantt()
                                    } else {
                                        this.copyTasks.forEach(item2 => {
                                            if (item2.bus_type == 'break') {
                                                let shiftTask = item
                                                let oldTask = {} // 获取原来的shift节点，并根据其推测出休息的时间段
                                                oldCopyTask.forEach(old => {
                                                    if (old.id == item2.bus_parent) {
                                                        oldTask = old
                                                    }
                                                })
                                                item2.start_date = new Date(+defaultDate + (+item2.start_date - +new Date(oldTask.start_date)))
                                                item2.end_date = new Date(getNewSecondDate( item2.start_date, item2.duration, 0))
                                                item2.startDate = getTimeStr(item2.start_date)
                                                item2.endDate = getTimeStr(item2.end_date)
                                                item2.parent = id
                                                item2.templateId = id
                                                item2.bus_parent = res
                                                item2.workId = res
                                                let params = JSON.parse(JSON.stringify(item2))
                                                params.lockDuration = params.lockDuration ? 1 : 0
                                                params.lockEnd = params.lockEnd ? 1 : 0
                                                params.lockStart = params.lockStart ? 1 : 0
                                                params.durationTime = params.durationTime.hours*60 + params.durationTime.minutes
                                                ApiShift.newBreakData(params).then(res => {
                                                    this.$BMessage.success($t('page.common.success'));
                                                    this.refreshGantt()
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                this.$BMessage.warning($t('product.page.templateManage.DataOverlap'));
                                this.refreshGantt()
                                this.copyTasks = []
                            }
                        }
                    }
                })
            },
            // 获取粘贴的条件
            getCopyCondition (tempId, params) {
                let self = this
                let gantt = this.gantt
                // 判断班次的最开始和最结尾是否重叠（出现开始跨天或结尾跨天）
                let flag3 = true
                let shiftStartArr = []
                let shiftEndArr = []
                let tempTask = gantt.getTask(tempId)
                gantt.getChildren(tempId).forEach(function (child) {
                    let objChildTask = gantt.getTask(child)
                    if (objChildTask.bus_type == 'shift' && objChildTask.id != params.id) { // 判断是否是当前班次下的排班节点
                        shiftStartArr.push(objChildTask.start_date)
                        shiftEndArr.push(objChildTask.end_date)
                    }
                })
                let shiftArr = {} // 所有班次的最大结束时间和最小开始时间
                if (shiftStartArr.length) { // 获取可设置的最小开始时间和最大结束时间
                    shiftArr = {
                        maxEnd: new Date(sortDataArray(shiftEndArr, 'desc')[0]),
                        minStart: new Date(sortDataArray(shiftStartArr, 'asc')[0])
                    }
                    let nowShift = { // 当前班次
                        start: new Date(params.start_date),
                        end: new Date(params.end_date)
                    }
                    let nowTemp = { // 当前模板
                        start: new Date(tempTask.startDate),
                        end: new Date(tempTask.endDate)
                    }
                    flag3 = getSaveShiftFlag(nowShift, nowTemp, shiftArr, tempTask.durationDay)
                }
                return flag3
            },
            // 全屏
            openFullModal () {
                this.$emit('open-full-modal');
            },
            // 刷新甘特图
            refreshGantt () {
                let gantt = this.gantt
                this.isDragShift = false
                this.copyTasks = []
                this.$emit('on-refresh-gantt', gantt);
            },
            // 撤销
            undoGantt () {
                // let gantt = this.gantt
                // if (this.undoExtension && this.undoExtension.undo) { // 只有拖动时才撤销
                //     this.undoExtension.undo();
                //     gantt.undo()
                // }
                let gantt = this.gantt
                // gantt的撤销
                this.$emit('on-undo-gantt', gantt);
            },
            // 分页
            pagesizechange (pageSize) {
                this.$emit('page-size-change', pageSize, this.gantt)
            },
            // 分页
            pageNumChange (pageNume) {
                this.$emit('page-num-change', pageNume, this.gantt)
            },
            // 只读
            readonlyCalendar () {
                let gantt = this.gantt
                // 日历情况下，控制只有生成的数据才可以编辑，即有bus_id的数据可以编辑
                if (this.type == 'calendar') {
                    this.tasks.data.forEach(item => {
                        if (!item.bus_id) { // bus_id为空的数据不可编辑
                            gantt.getTask(item.id).readonly = true;
                        }
                    })
                }
            },
            // 定位
            dropClick (name) {
                let gantt = this.gantt
                this.dropFlag = name
                gantt.scrollTo(1680*parseInt(this.dropFlag), null)
            }
        },
        created () {
        },
        mounted () {
            let gantt = this.gantt
            // 初始化虚拟日期  第0天---第八天
            gantt.config.start_date = new Date(new Date(this.startDate).toLocaleDateString())
            gantt.config.end_date = new Date(new Date(this.endDate).toLocaleDateString())

            this.initColumns() // 初始化列
            this.setConfigs() // 自定义配置
            gantt.init(this.$refs.gantt)
            gantt.parse(this.$props.tasks)
            this.readonlyCalendar()
            if (this.type == 'template') { // 如果是模板
                gantt.scrollTo(1680*parseInt(this.dropFlag), null)
            }
        }
    }
</script>

<style lang="less">
    @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
    .gantt-wrapper {
        .gantt_grid_head_cell {
            font-size: 14px!important;
            font-weight: bold!important;
            color: #515a6e!important;
            background-color: rgba(51, 63, 72, 0.06);
        }
    }
    .gantt-dropdown {
        max-height: unset;
        text-align: center;
    }
    .page-wrapper-gantt {
        margin-top: 8px;
    }
    .tree-drop-down {
        margin-left: 50px;
    }
    .gantt_tree_icon { // 隐藏默认图标
        display: none!important;
    }
    .gantt_bar_project { // 隐藏project默认的竖线
        border: unset!important;
        width: 0!important;
    }
    .bingo-gantt-wrapper {
        .ivu-dropdown {
            position: absolute;
            right: 26px;
            top: 15px;
        }
        .iconxinjian {
            vertical-align: middle;
            margin-top: -2px;
        }
    }
    .gantt_tree_content .ivu-icon:hover {
        padding-top: 3px;
        padding-bottom: 3px;
        color: #fff;
        border-radius: 4px;
        background-color: #4c84ff;
        cursor: pointer;
    }
    .gantt_cell { // 表格加边框
        border-right: 1px solid rgba(51, 63, 72, 0.1)!important;
    }
    .gantt_row:nth-child(2n) { // 偶数行显示颜色
        .gantt_cell {
            background-color: rgba(51, 63, 72, 0.03);
        }
    }
    .gantt_row:hover { // 表格鼠标滑过背景颜色
        background-color:rgba(0,119,200,0.08)!important;
    }
    // 表格选中背景颜色
    .gantt_grid_data .gantt_row.gantt_selected, .gantt_grid_data .gantt_row.odd.gantt_selected, .gantt_task_row.gantt_selected {
        background-color:rgba(0,119,200,0.08)!important;
    }
    // 甘特图任务的样式
    .gantt_task_line {
        margin-top: 10px;
    }
    // 超出父元素的部分也显示，班次下的
    .gantt_demo .gantt_task_content {
        overflow: unset;
    }
    // 加班样式
    .sigma-content { // 父标签
        width: 100%;
        height: 100%;
        position: relative;
        text-align: left;
        overflow:visible;
    }
    .sigma-middle-line { // 子标签
        position: absolute;
        top: -17px;
        height: 15px;
        text-align: center;
        /*background-color: #8c0776;*/
        border-left: 1px solid #fe5461;
        border-right: 1px solid #fe5461;
        right: 0;
        z-index: 1;
        font-size: 12px;
        line-height: 15px;
        &:before {
            content: '';
            display: block;
            height: 1px;
            width: 100%;
            background-color: #fe5461;/*颜色需与主题bai大背景色一致*/
            position: relative;
            top: 7px; /*调节线高*/
            left: 0;
        }
    }
    .sigma-line-text{
        display: inline-block;
        background: #fff;
        color: #454545;
        padding: 0 2px 0 2px;
        position: relative;
        font-weight: 500;
    }
    .iconxiuxizhong {
        font-size: 13px;
    }
</style>
