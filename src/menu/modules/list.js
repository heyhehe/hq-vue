const pre = '/list/';

export default {
    path: '/list',
    title: '列表页面',
    header: 'home',
    custom: 'iconfont iconpingtaiguanli',
    children: [
        {
            path: `${pre}basic-list`,
            title: '基础列表'
        },
        {
            path: `${pre}card-list`,
            title: '卡片列表'
        },
        {
            path: `${pre}user-list`,
            title: '用户列表'
        },
        {
            path: `${pre}goods-list`,
            title: '商品列表'
        },
        {
            path: `${pre}table-list`,
            title: '查询表格'
        }
    ]
}
