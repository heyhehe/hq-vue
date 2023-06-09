const pre = '/exception/';

export default {
    path: '/exception',
    title: '异常页面',
    header: 'home',
    custom: 'iconfont iconpingtaiguanli',
    children: [
        {
            path: `${pre}403`,
            title: '403'
        },
        {
            path: `${pre}404`,
            title: '404'
        },
        {
            path: `${pre}500`,
            title: '500'
        }
    ]
}
