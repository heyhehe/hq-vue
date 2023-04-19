const pre = '/editor/';

export default {
    path: '/editor',
    title: '编辑器',
    header: 'home',
    // custom: 'i-icon-demo i-icon-demo-editor',
    custom: 'iconfont iconpingtaiguanli',
    children: [
        {
            path: `${pre}quill`,
            title: 'Quill'
        },
       
    ]
}
