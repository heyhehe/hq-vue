// 注册全局方法
exports.install = function (Vue, options) {
    Vue.prototype.$back = function () { //全局函数1
        console.log('xxx');
    };

    // 浏览器存储
    Vue.prototype.$localStorageSet = function (key, value) { //全局函数1
        let type = Object.prototype.toString.call(value).replace(/\[object (\w+)\]/, "$1").toLowerCase()
        if (type !== 'string') value = JSON.stringify(value);
        localStorage.setItem(key, value)
    };
    // 浏览器获取
    Vue.prototype.$localStorageGet = function (key) { //全局函数1
        let value = localStorage.getItem(key)
        let type = Object.prototype.toString.call(value).replace(/\[object (\w+)\]/, "$1").toLowerCase()

        if (type === 'string') {
            value = JSON.parse(value);
        }
        return value
    };
    //  浏览器移除
    Vue.prototype.$localStorageRemove = function (key) { //全局函数1
        localStorage.removeItem(key)
    };

    // sessionStorage 存贮
    Vue.prototype.$sessionStorageSet= function(key, value) {
        let type = Object.prototype.toString.call(value).replace(/\[object (\w+)\]/, "$1").toLowerCase()
        if (type !== 'string') value = JSON.stringify(value);
        sessionStorage.setItem(key, value)
        // * @param {String} key  属性
        // * @param {*} value 值
    }

    // sessionStorage 获取
    Vue.prototype.$sessionStorageGet= function(key) {

        let value = sessionStorage.getItem(key)
        let type = Object.prototype.toString.call(value).replace(/\[object (\w+)\]/, "$1").toLowerCase()

        if (type === 'string') {
            value = JSON.parse(value);
        }
        return value
    };

    // sessionStorage 删除
    Vue.prototype.$sessionStorageRemove= function(key) {
        sessionStorage.removeItem(key)
        // @param {String} key  属性
    };

    // sessionStorage 存贮某一段时间失效
    Vue.prototype.$sessionStorageSetExpire= function(key, value, expire) {
        if (typeof (value) === 'object') value = JSON.stringify(value);
        sessionStorage.setItem(key, value);
        setTimeout(() => {
            sessionStorage.removeItem(key)
        }, expire)

        /*
        1 秒=1000 毫秒
        7 天 = 604800000 毫秒
        3 天 = 259200000 毫秒
        1 天 = 86400000  毫秒
        @param {String} key  属性
        @param {*} value 存贮值
        @param { number } expire 过期时间,毫秒数
        */
    };

}






/*
var goBack = function() {
    xxx
}
export default goBack;


main.js中引入并定义
import goBack from '../static/js/goBack';
Vue.prototype.$back = goBack; //用$与组件内自定义的函数区分，其他符号也可以


组件中使用
go: function() {
      this.$back();
    }
*/