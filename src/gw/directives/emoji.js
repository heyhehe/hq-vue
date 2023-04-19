export default {
    install(Vue) {
        Vue.directive('emoji', {
            bind: function (el, binding, vnode) {
                let findEle = (parent, type) => {
                    return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type)
                  }
                  
                  const trigger = (el, type) => {
                    const e = document.createEvent('HTMLEvents')
                    e.initEvent(type, true, true)
                    el.dispatchEvent(e)
                  }

                // 正则规则可根据需求自定义
                var regRule = /(^\s*)|(\s*$)/g
                let $inp = findEle(el, 'input')
                el.$inp = $inp
                $inp.handle = function () {
                  let val = $inp.value
                  $inp.value = val.replace(regRule, '')
            
                  trigger($inp, 'input')
                }
                $inp.addEventListener('keyup', $inp.handle)
              },
              unbind: function (el) {
                el.$inp.removeEventListener('keyup', el.$inp.handle)
              },
        })
    },
}
