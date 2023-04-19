// Vue
import Vue from 'vue'
import App from './App'

// 全局过滤器
import './gw/utils/vue/filter.js'

// 注册全局方法
import global from './gw/utils/global/fun.js'; 
Vue.use(global);
import methods from './gw/utils/mixin/methods.js'; 
Vue.mixin(methods);


import Direction from 'vue-direction-key'
Vue.use(Direction)

// 配置
import Setting from './setting'

// 混合
import mixinApp from '@/mixins/app'

// 插件
import plugins from '@/plugins'

// store
import store from '@/store/index'

// iView 和 iView Pro
import ViewUI from 'view-design'
import iViewPro from '@/libs/iview-pro/iview-pro.min.js'

//引入阿里巴巴图标库
import '@/assets/fonts/iconfont.css' // 图标字体
import '@/assets/fonts/iconfont.js' // 图标字体

// 引入 vue-lottie
import lottie from 'vue-lottie'
Vue.component('lottie', lottie)

// 菜单和路由
import router from './router'
import menuHeader from '@/menu/header'
import menuSider from '@/menu/sider'
import { frameInRoutes } from '@/router/routes'

// 多语言
import i18n from '@/i18n'

// 方法
import { getHeaderName, getMenuSider, getSiderSubmenu } from '@/libs/system'

// 内置组件
import iLink from '@/components/link'
import iFrame from '@/components/frame'

// LicenseManager.setLicenseKey(
//     'CompanyName=Beijing Pinggaohuihuang Tech Co.,Ltd.,LicensedGroup=bingosoft,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-007490,ExpiryDate=24_March_2021_[v2]_MTYxNjU0NDAwMDAwMA==38a589ee2417bc0f1ebceb2d931693e1'
// )
// if (window) window.$t = (key, value) => i18n.t(key, value)

// 使用样式，修改主题可以在 styles 目录下创建新的主题包并修改 iView 默认的 less 变量
// 参考 https://www.iviewui.com/docs/guide/theme
import './styles/index.less'
import './libs/iview-pro/iview-pro.css'

if (window) window.$t = (key, value) => i18n.t(key, value)
export const eventBus = new Vue()
Vue.use(plugins)

Vue.use(ViewUI, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(iViewPro)
Vue.component('i-link', iLink)
Vue.component('i-frame', iFrame)

//web sql
import websql from '@/libs/bmsa/websql'
Vue.use(websql)
//引入全局常量
import consts from '@/libs/bmsa/consts'
Vue.prototype.Global = consts

new Vue({
    mixins: [mixinApp],
    router,
    store,
    i18n,
    render: (h) => h(App),
    created() {
        // 处理路由 得到每一级的路由设置
        this.$store.commit('admin/page/init', frameInRoutes)
        // 设置顶栏菜单
        this.$store.commit('admin/menu/setHeader', menuHeader)
        // 加载用户登录的数据
        this.$store.dispatch('admin/account/load')
        // 初始化全屏监听
        this.$store.dispatch('admin/layout/listenFullscreen')
    },
    watch: {
        // 监听路由 控制侧边栏显示 标记当前顶栏菜单（如需要）
        $route(to, from) {
            let path = to.matched[to.matched.length - 1].path
            if (!Setting.dynamicSiderMenu) {
                let headerName = getHeaderName(path, menuSider)
                if (headerName === null) {
                    path = to.path
                    headerName = getHeaderName(path, menuSider)
                }
                headerName = 'home'
                // 在 404 时，是没有 headerName 的
                if (headerName !== null) {
                    this.$store.commit('admin/menu/setHeaderName', headerName)
                    this.$store.commit('admin/menu/setMenuSider', menuSider)

                    const filterMenuSider = getMenuSider(menuSider, headerName)
                    this.$store.commit('admin/menu/setSider', filterMenuSider)
                    this.$store.commit('admin/menu/setActivePath', to.path)

                    const openNames = getSiderSubmenu(path, menuSider)
                    this.$store.commit('admin/menu/setOpenNames', openNames)
                }
            }
            this.appRouteChange(to, from)
        }
    }
}).$mount('#app')
