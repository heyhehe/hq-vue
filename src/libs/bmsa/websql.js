import Vue from 'vue'
const appName = require('./consts.js')
const websql = function() {
    if (window.openDatabase) {
        let db = openDatabase('layout49', '1.0', 'table layout setting', 200 * 1024 * 1024)
        Vue.prototype.$db = db
        if (!db) {
            console.log('数据库创建失败！')
        } else {
            console.log('本地数据库创建成功！')
            db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS tableBaseLayout (layout, name, isDefault, page, froze, column, query,queryOrder, search, date)') // 保存表格布局相关信息
                tx.executeSql('CREATE TABLE IF NOT EXISTS layout (id unique, layout, tableBase)') // 保存路由名称与表格名称，字段对应关系
                tx.executeSql('CREATE TABLE IF NOT EXISTS global (system, size, color, theme, siderTheme, headerTheme)') // 保存全局变量，表格大小、主题色，主题
                tx.executeSql('CREATE TABLE IF NOT EXISTS billLayout (name, layout)') // 保存bill表单，表单名字、布局
                tx.executeSql('SELECT * FROM global', [], function(tx, results) {
                    var len = results.rows.length
                    if (!len) {
                        tx.executeSql('insert into global (system, size, color, siderTheme, headerTheme) values (?, ?, ?, ?, ?)', [appName.default.SystemName, 'mini', 1, 'dark', 'light'])
                    }
                })
            })
        }
    } else {
        console.log('不支持 web Sql')
    }
}
export default websql
