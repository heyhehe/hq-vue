<template>
  <div class="page-account">
    <div v-if="showI18n" class="page-account-header">
      <i-header-i18n />
    </div>
    <div class="page-account-container">
      <div class="page-account-top">
        <div class="page-account-top-logo">
          <!-- <img src="@/assets/images/logo-small.png" alt="logo" /> -->
          <h1>自在天</h1>
        </div>
        <div class="page-account-top-desc">
          <!-- iView Admin Pro 企业级中台前端/设计解决方案 -->
        </div>
      </div>

      <!-- <Tabs value="name1">
        <TabPane label="账户登入" name="name1">标签一的内容</TabPane>
        <TabPane label="手机号登入" name="name2">标签二的内容</TabPane>
      </Tabs> -->

      <Login @on-submit="handleSubmit">
        <UserName name="username" value="17684388925" />
        <Password name="password" value="123456" enter-to-submit />
        <div class="page-account-auto-login">
          <Checkbox v-model="autoLogin" size="large">{{
            $t("page.login.remember")
          }}</Checkbox>
          <router-link
            class="page-account-register"
            :to="{ name: 'register' }"
            >{{ $t("page.login.signup") }}</router-link
          >
        </div>
        <Submit>{{ $t("page.login.submit") }}</Submit>
      </Login>
      <!-- <div class="page-account-other">
        <span>{{ $t("page.login.other") }}</span>
        <img src="@/assets/svg/icon-social-wechat.svg" alt="wechat" />
        <img src="@/assets/svg/icon-social-qq.svg" alt="qq" />
        <img src="@/assets/svg/icon-social-weibo.svg" alt="weibo" />
       
      </div> -->
    </div>
    <i-copyright />
  </div>
</template>
<script>
import iCopyright from "@/components/copyright";
import { mapActions } from "vuex";
import mixins from "../mixins";
import md5 from "md5";

export default {
  mixins: [mixins],
  components: { iCopyright },
  data() {
    return {
      autoLogin: true,
    };
  },
  methods: {
    ...mapActions("admin/account", ["login"]),
    ...mapActions(["getuserlogin"]),
    //    ...mapActions(['getVuex']), this.getVuex('传递参数')
    /**
     * @description 登录
     * 表单校验已有 iView Pro 自动完成，如有需要修改，请阅读 iView Pro 文档
     */
    handleSubmit(valid, values) {
      if (valid) {
        // const { username, password } = values;
        let password = md5(values.password);
        let username = values.username;
        this.login({
          username,
          password,
        }).then(() => {
          this.getuserlogin()
            .then(() => {
              this.$Message.success("登入成功");
              // 重定向对象不存在则返回顶层路径
              this.$router.replace(this.$route.query.redirect || "/");
            })
            .catch((error) => {
              this.$Message.error(error);
            });
        });
      }
    },
  },
};
</script>
