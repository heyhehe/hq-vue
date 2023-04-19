// 页面获取焦点
directives: {
    focus: {
        // 指令的定义
        inserted: function (el) {
            console.log(el)
            //   在这里打印出el看看传过来的el到底是什么，以下代码就是为了判断是不是绑定到了我想绑定的元素上
            console.log(el.tagName);
            if (el.tagName.toLocaleLowerCase() == 'input') {
                el.focus()
            } else {
                if (el.getElementsByTagName('input')) {
                    el.getElementsByTagName('input')[0].focus()
                }
            }
        }
    },
    emoji: {
        bind: function (el, binding, vnode) {
            let findEle = (parent, type) => {
                return parent.tagName.toLowerCase() === type
                    ? parent
                    : parent.querySelector(type);
            };

            const trigger = (el, type) => {
                const e = document.createEvent("HTMLEvents");
                e.initEvent(type, true, true);
                el.dispatchEvent(e);
            };

            // 正则规则可根据需求自定义
            var regRule = /(^\s*)|(\s*$)/g;
            let $inp = findEle(el, "input");
            el.$inp = $inp;
            $inp.handle = function () {
                let val = $inp.value;
                $inp.value = val.replace(regRule, "");

                trigger($inp, "input");
            };
            $inp.addEventListener("keyup", $inp.handle);
        },
        unbind: function (el) {
            el.$inp.removeEventListener("keyup", el.$inp.handle);
        },
    },
},