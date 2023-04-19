const pre = '/search/';

export default {
    path: '/search',
    title: '搜索页面',
    header: 'home',
    custom: 'iconfont iconpingtaiguanli',
    children: [
        {
            path: `${pre}search-article`,
            title: '搜索列表（文章）'
        },
        {
            path: `${pre}search-projects`,
            title: '搜索列表（项目）'
        },
        {
            path: `${pre}search-apps`,
            title: '搜索列表（应用）'
        }
    ]
}
