import request from '@/plugins/request';

export function AccountLogin (data) {
    //    /api/auth/login
    return request({
        url: '/api/iview/auth/login',
        method: 'post',
        data
    });
}

export function AccountRegister (data) {
    return request({
        url: '/api/register',
        method: 'post',
        data
    });
}

export function getInfo(params) {
    return request({
        url:'/api/user/info',
        method: 'get',
    })
    
}

// 获取用户信息
export function getuser(params) {
    return request({
        url:'/api/iview/auth/getuser',
        method: 'post',
        data:params
    })
    
}
