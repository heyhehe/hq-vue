import request from "@/plugins/request";

export function AccountLogin(data) {
    // egg  router.get('/api/system/system/usergroup/page',controller.eggcase.index2)
    return request({
        url: "/api/system/system/usergroup/page",
        method: "get",
        //   params: { data: 11111 },
    })
    
    
    // .then((res) => {
    //     console.log(res, 55555555555555);
    // });
}