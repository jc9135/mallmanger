<template>
  <div class="login-container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单区域 -->
      <el-form class="login_form" :model="loginForm" :rules="rules"  ref="ruleForm">
        <!-- 用户名区域 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录输入框数据
      loginForm: {
        username: '',
        password: ''
      },
      //登录校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('login',this.loginForm)
          console.log(res)
          if(res.meta.status == 400) return this.$message.error(res.meta.msg)
          window.sessionStorage.setItem('token',res.data.token)
          this.$message.success('登录成功!');
          this.$router.push('/home')
        } else {
          this.$message.error('登录失败!!')
          return false
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    border-radius: 5px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    .avatar_box {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      border: 1px solid #ccc;
      padding: 10px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
