<template>
  <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
    <!--内容主体区-->
    <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addFrom.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addFrom.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addFrom.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addFrom.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!--底部区-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUsers">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "UserAdd",
  data() {
    // 验证邮箱的自定义规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 验证规则名称名称对象
      addFromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "请取用户名范围是3到10个名字之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 15,
            message: "请输入密码范围是8到15个字母、数字、符号",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
    }
  },
  methods: {
    init() {
      this.addDialogVisible = true
    },
    // 点击按钮添加新用户,.validate函数
    addUsers() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return {};
        // 如果通过了，就直接发起添加的请求
        const { data: res } = await this.$http.post("users", this.addFrom);
        console.log(this.addFrom);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        } else {
          this.$message({
          message: '添加用户成功',
          type: 'success',
          duration: 500,
          onClose: () => {
            this.addDialogVisible = false
            this.$emit('refreshDataList')
          }
        })
      }
        // console.log(res);
        // console.log(res.meta.status);
      });
    },
    // 监听添加用户对话框的关闭事件，只要触发就关闭，进行重置
    addDialogClosed() {
      this.$refs.addFromRef.resetFields();
    },
  }
}
</script>
