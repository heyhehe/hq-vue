<template>
    <GlobalFooter class="i-copyright" :links="links" :copyright="copyright" />
</template>
<script>
    export default {
        name: 'i-copyright',
        data () {
            return {
                links: [
                      {
                        title: 'git',
                        key: 'git',
                        href: 'https://git.bingocloudos.net/users/sign_in',
                        blankTarget: true
                    },
                    {
                        title: 'Outlook Web App',
                        key: 'Outlook Web Ap',
                        href: 'https://bjmail.bingosoft.net/owa/auth/logon.aspx?replaceCurrent=1&url=https%3a%2f%2fbjmail.bingosoft.net%2fowa%2f',
                        blankTarget: true
                    },
                  
                    {
                        title: 'iviewui官网',
                        key: 'iviewui官网',
                        href: 'http://v1.iviewui.com/',
                        blankTarget: true
                    }, 
                    {
                        title: '品高资源库',
                        key: '品高资源库',
                        href: 'http://172.20.30.85:30021/',
                        blankTarget: true
                    }, 
                    {
                        title: 'vxe-table',
                        key: 'vxe-table',
                        href: 'https://xuliangzhan_admin.gitee.io/vxe-table/v3/#/table/start/install',
                        blankTarget: true
                    }, 
                    {
                        title: '数字智能',
                        key: '数字智能',
                        href: 'http://okr-prod.bingocloudos.net/',
                        blankTarget: true
                    },
                   
                ],
                copyright: '·········填写日报·········'
            }
        }
    }
</script>
<style lang="less">
    .i-copyright{
        flex: 0 0 auto;
        &-hidden{
            display: none;
        }
    }
</style>
