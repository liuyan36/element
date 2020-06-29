<template>
  <div class="login_class">
    <div class="login_box">
      <!--头像区-->
        <div class="avatar_box">
          <img src="../assets/logo.png" alt="">
        </div>
        <!--表单区-->
        <!--使用：model是script中的数据对象-->
        <!--:rules="loginFromRules" 验证规则对象-->
        <!--重置，给表单添加一个ref引用，在ref中取任意名字来适用表单重置名字-->
        <el-form ref="loginFromRef" class="login_for" :model="loginFrom" :rules="loginFromRules">
          <!--用户区-->
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-user" v-model="loginFrom.username"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <!--加入prefix-icon 是前面加入图标-->
            <!--使用v-model绑点数据中需要的部分-->
            <el-input prefix-icon="iconfont icon-3702mima" v-model="loginFrom.password" type="password"></el-input>
          </el-form-item>
          <!--按钮-->
          <el-form-item class="btns">
            <el-button :plain="true" type="success" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginFrom">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单绑定数据对象
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFromRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个名称', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入合格密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个数字、字母、符号', trigger: 'blur' }
        ]

      }
    }
  },
  methods: {
    // 点击重置表单
    resetLoginFrom () {
      // 拿到ref中对应的refs中的对象，使用from表单的resetFields进行重置
      this.$refs.loginFromRef.resetFields()
    },
    login () {
      // 先获取表单是引用对象，然后拿到表单的引用对象实现validate进行表单校验，第一个形参是布尔值，判断布尔值就可以实现验证是否通过
      // 先判断vaild是否为true 等于true就发起请求
      this.$refs.loginFromRef.validate(async vaild => {
        // 不等于直接拒绝
        if (!vaild) return
        // eslint-disable-next-line no-unused-vars
        const { data: res } = await this.$http.post('login', this.loginFrom)
        // 我们根据res中meta属性status 来判断是不是200，不是200就判断失败
        // 加载弹窗组件， 使用this.$message来显示弹窗 后面的error是来表示错误之类的
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        console.log(res)
        // 将服务器中的登录成功后的token，保存到客户端的 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 通过编程式导航跳转到后台页面，然后push的是跳转到当时的页面home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
.login_class {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); /*默认中间*/
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;

  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 5px;
  background-color: #eee;
}

.login_for {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
