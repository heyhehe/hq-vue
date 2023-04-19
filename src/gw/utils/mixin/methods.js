import moment from 'moment'
import $ from './../../lib/jquery-3.5.1'
export default {
    data() {
        return {
            // data: '张'

        }
    },
    methods: {
        // 生成32位 字符串
        $getstr(length) {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        },
        // 判断数据类型 val 类型 输入 参数二：返回真假
        // 可判断类型：undefined、null、string、number、boolean、array、object、symbol、date、regexp、function、asyncfunction、arguments、set、map、weakset、weakmap
        $dataTypeJudge(val, type) {
            const dataType = Object.prototype.toString.call(val).replace(/\[object (\w+)\]/, "$1").toLowerCase();
            return type ? dataType === type : dataType;
        },

        $getDateTime(ns, type) {
            //非空判断
            if (!ns) {
                return ''
            }
            let myDate = new Date(ns)
            let year = myDate.getFullYear()
            let month = myDate.getMonth() + 1
            let date = myDate.getDate()
            let hour = myDate.getHours()
            let minute = myDate.getMinutes()
            let secont = myDate.getSeconds()
            function plusZero(letiable) {
                if (letiable < 10) {
                    return '0' + letiable
                } else {
                    return letiable
                }
            }
            let dateTime1 =
                year +
                '-' +
                plusZero(month) +
                '-' +
                plusZero(date) +
                ' ' +
                plusZero(hour) +
                ':' +
                plusZero(minute) +
                ':' +
                plusZero(secont)
            let dateTime2 =
                year + '-' + plusZero(month) + '-' + plusZero(date) + ' ' + plusZero(hour) + ':' + plusZero(minute)
            let time = plusZero(hour) + ':' + plusZero(minute) + ':' + plusZero(secont)
            let dates = year + '-' + plusZero(month) + '-' + plusZero(date)
            if (type == 1) {
                return dateTime1
            } else if (type == 2) {
                return dateTime2
            } else if (type == 3) {
                return time
            } else if (type == 4) {
                return dates
            } else if (!type) {
                return dateTime2
            }
        },
        /*
            * 两个参数:ns为时间戳,type(1,2,3,4)为需要返回时间格式
            * type=1:将时间戳转换成datetime格式返回 2000-01-01 10:00:00
            * type=2:将时间戳转换成datetime格式返回 2000-01-01 10:00
            * type=3:将时间戳转换成time格式返回 10:00:00
            * type=4:将时间戳转换成date格式返回 2000-01-01
            * !type:将时间戳转换成datetime格式返回 2000-01-01 10:00
            * 
         */
        // 格式化日期
        $formatDateTime(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
            return moment(dataStr).format(pattern)
        },
        // 转化 moment 对象
        $moment(pattern = new Date()) {
            return moment(pattern)
        },

        $download(path) {
            var $form = $('<form method="GET"></form>')
            $form.attr('action', path);
            $form.appendTo($('body'));
            $form.submit();

        },

        $copy(txt) {
            navigator.clipboard.writeText(txt).then(
                () => {
                    this.$notification['success']({
                        message: '成功',
                        description: '复制成功',
                    })
                },
                (err) => {
                    this.$notification['error']({
                        message: '失败',
                        description: '复制失败',
                    })
                }
            )
        },

        $air(data) {
            // 空气质量级别为一级
            // 空气质量状况属于优
            let tmp = { grade: '', status: '', data: '' }
            if (0 >= data || data <= 50) {
                tmp.grade = '一级'
                tmp.status = '优'
                tmp.data = '空气质量令人满意，基本无空气污染，各类人群可正常活动。'
            } else if (51 >= data || data <= 100) {
                tmp.grade = '二级'
                tmp.status = '良'
                tmp.data = '空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响，建议极少数异常敏感人群应减少户外活动。'

            } else if (101 >= data || data <= 150) {
                tmp.grade = '三级'
                tmp.status = '轻度污染'
                tmp.data = '易感人群症状有轻度加剧，健康人群出现刺激症状。建议儿童、老年人及心脏病、呼吸系统疾病患者应减少长时间、高强度的户外锻炼。'

            } else if (151 >= data || data <= 200) {
                tmp.grade = '四级'
                tmp.status = '中度污染'
                tmp.data = '进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响，建议疾病患者避免长时间、高强度的户外锻练，一般人群适量减少户外运动。'

            } else if (data <= 300 || data >= 201) {
                tmp.grade = '五级'
                tmp.status = '重度污染'
                tmp.data = '心脏病和肺病患者症状显著加剧，运动耐受力降低，健康人群普遍出现症状，建议儿童、老年人和心脏病、肺病患者应停留在室内，停止户外运动，一般人群减少户外运动。'


            } else if (data > 300) {
                tmp.grade = '六级'
                tmp.status = '严重污染'
                tmp.data = '健康人群运动耐受力降低，有明显强烈症状，提前出现某些疾病，建议儿童、老年人和病人应当留在室内，避免体力消耗，一般人群应避免户外活动。'
            }

            return tmp
        },

        // 浏览器存储
        // $localStorageSet(key, value) { //全局函数1
        //     let type = Object.prototype.toString.call(value).replace(/\[object (\w+)\]/, "$1").toLowerCase()
        //     if (type !== 'string') value = JSON.stringify(value);
        //     localStorage.setItem(key, value)
        // },
        // // 浏览器获取
        // $localStorageGet(key) { //全局函数1
        //     let value = localStorage.getItem(key)
        //     let type = Object.prototype.toString.call(value).replace(/\[object (\w+)\]/, "$1").toLowerCase()
        //     if (type === 'string') {
        //         value = JSON.parse(value);
        //     }
        //     return value
        // },
        // //  浏览器移除
        // $localStorageRemove(key) { //全局函数1
        //     localStorage.removeItem(key)
        // },


    }
}