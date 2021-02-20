<!--
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-02-18 17:37:06
 * @LastEditors: mintZ
 * @LastEditTime: 2021-02-20 15:23:21
-->
<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/images/logo.png" />
      </div>
      <div class="login_form">
        <!-- 登录表单区域 -->
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input
              type="username"
              placeholder="用户名"
              prefix-icon="el-icon-user-solid"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="form_item">
            <el-button type="primary" @click="submit">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          {
            required: true, message: '请输入用户名', trigger: 'blur',
          },
          {
            min: 3, max: 50, message: '用户名必须多于3位', trigger: 'blur',
          },
        ],
        password: [
          {
            required: true, message: '请输入密码', trigger: 'blur',
          },
          {
            min: 6, max: 50, message: '密码长度必须多于6位', trigger: 'blur',
          },
        ],
      },
    };
  },

  components: {},

  computed: {},

  mounted: {},

  methods: {
    resetForm() {
      // 点击充值按钮，重置登录表单
      this.$refs.loginFormRef.resetFields();
    },
    submit() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data } = await this.$http.post('login', this.loginForm);
        console.log(data);
        if (data.meta.status === 200) {
          this.$message.success('登录成功');
          /**
           * 1.将登录成功之后的token，保存到客户端的sessionStorage中
           *   1.1项目中除了登录之外的其他API接口，必须在登录之后才能访问
           *   1.2token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
           * 2.通过编程式导航跳转到后台主页，路由地址是/home
           */
          window.sessionStorage.setItem('token', data.data.token);
          this.$router.push('/home');
        } else {
          this.$message.error('登录失败');
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 1%;
    .avatar_box {
      width: 130px;
      height: 130px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 50%;
      padding: 10px;
      transform: translate(0, -50%);
      border: 1px solid #eee;
      box-shadow: 0 0 10px #ddd;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: relative;
      top: -50px;
      padding: 0 20px;
      .form_item {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
