import request from '@/plugins/request';
export default {
    data() {
        return {
            // data: '张'
        }
    },
    methods: {
        queryTable(option) {
            return request({
                url: "/guowei/queryTable",
                method: "post",
                data: option
            })
        },
        queryAction(option) {
            return request({
                url: "/guowei/queryAction",
                method: "post",
                data: option
            })
        },
        addRec(options) {
            return request({
                url: "/guowei/addRec",
                method: "post",
                data: options
            })
        },
        updateRec(options) {
            return request({
                url: "/guowei/updateRec",
                method: "post",
                data: options
            })
        },
        deleteRec(option) {
            return request({
                url: "/guowei/deleteRec",
                method: "post",
                data: option
            })
        },
        // 写sql 执行  option 代表 select * from 表
        execute(option) {
            return request({
                url: "/guowei/execute",
                method: "post",
                data: {data:option}
            })
        },
        
        // 向后台发送请求获取数据
        getbackenddata(url,option,parameter='post'){
            return request({
                url: url,
                method: parameter,
                data: option
            })
        },
        // 表格渲染
        querydata(option) {
            return request({
                url: "/guowei/querydata",
                method: "post",
                data: option
            })
        },
    }
}