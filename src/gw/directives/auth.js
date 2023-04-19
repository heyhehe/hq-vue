
import router from './../../router'
import store from './../../store'
// 权限指令  传递v-auth 里的内容
function install(Vue, options = {}) {
    Vue.directive(options.name || 'auth', {
        inserted(el, binding) {

            function checkAction(action) {
                // debugger
                let pageId = router.history.current.path
                // console.log(router)
                let pagePermission = store.getters.userInfo.role.permissions
                let resArr = pagePermission.filter(item => {
                    // console.log(item.actionList,action.join(","));
                    // v-auth="'高级'"
                    return item.permissionId == pageId && item.actionList.includes(action)
                    
                    // 针对数组
                    // if (item.permissionId == pageId ) {
                    //     for (let i = 0; i < item.actionList.length; i++) {
                    //     //    console.log(item.actionList[i]);
                    //         if (action.indexOf(item.actionList[i]) > -1) {
                    //             return item
                    //         }
                    //     }
                    // }
                })
                // console.log(resArr);
                if (resArr.length > 0) {
                    return true
                } else {
                    return false
                }
            }

            if (!checkAction(binding.value)) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    })
}

export default { install }