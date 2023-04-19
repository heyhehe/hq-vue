import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

// 货币格式化 3位加 , 号 
Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})


// 日期格式化
Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})


// 根据身份证号码判断男女 
Vue.filter('sexIdcardFilter', function (value) {
  if (!value) {
    return '传递的参数必须是18位身份证字符串'
  } else {
    let data = value.toString().substr(16, 1) % 2 === 1 ? '男' : '女'
    return data
  }
})

// 身份证号脱敏('331082199708094687' 转换成 '33108219********87') 第8位开始替换8个 
Vue.filter('IDcardHide', function (str) {
  let data = str.toString().replace(/(\d{8})\d{8}(\d*)/, '$1********$2')
  return data
})

// 手机号脱敏('13912345678' 转换成 '139****5678') 第3位开始替换4个
Vue.filter('telHide', function (str) {
  let data = str.toString().replace(/(\d{3})\d{4}(\d*)/, '$1****$2')
  return data
})

// 姓名脱敏(小明 转换成 *明   李小明 转换成 李*明   欧阳小明 转换成 欧**明)
Vue.filter('nameHide', function (name) {
  if (name.length === 2) {
    return new Array(name.length).join('*') + name.substr(-1)
  } else {
    return (
      name.substr(0, 1) + new Array(name.length - 1).join('*') + name.substr(-1)
    )
  }
})




