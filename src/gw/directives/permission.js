export default {

    install(Vue) {
        Vue.directive('permission', {
            inserted: function (el, binding) {
                let permission = binding.value // 获取到 v-permission的值
                if (permission) {
                    let hasPermission = checkArray(permission)
                    if (!hasPermission) {
                        // 没有权限 移除Dom元素
                        el.parentNode && el.parentNode.removeChild(el)
                    }
                }
                function checkArray(key) {
                    let arr = ['1', '2', '3', '4']
                    let index = arr.indexOf(key)
                    if (index > -1) {
                        return true // 有权限
                    } else {
                        return false // 无权限
                    }
                }
            }


        })
    }

}

// 自定义一个权限指令，对需要权限判断的 Dom 进行显示隐藏。
// 思路：
// 自定义一个权限数组
// 判断用户的权限是否在这个数组内，如果是则显示，否则则移除 Dom