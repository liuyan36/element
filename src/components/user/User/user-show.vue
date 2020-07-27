<template>
  <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
    <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="70px">
      <el-form-item label="用户名">
        <el-input v-model="editFrom.username" disabled></el-input>
        <!--使用disabled来禁用-->
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editFrom.email"></el-input>
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="editFrom.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUserInfo">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "userShow",
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
      // 控制修改用户的对话框显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editFrom: {},
      // 修改表单的验证规则对象
      editFromRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 编辑用户的Id
      showId: ''
    }
  },
  methods: {
    init() {
      this.editDialogVisible = true
      this.showEditDialog()
    },
    // 展示编辑用户的对话框
    async showEditDialog() {
      const { data: res } = await this.$http.get("users/" + this.showId);
      console.log({ data: res });
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.editFrom = res.data;
    },
    // 修改用户信息点击提交
    editUserInfo() {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return;
        // 发起用户信息的修改请求
        // async 和 await  是为了简化prosime网络请求
        const { data: res } = await this.$http.put(
          "users/" + this.editFrom.id,
          {
            email: this.editFrom.email,
            mobile: this.editFrom.mobile
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("更新用户信息失败！");
        }
        // 提示修改成功
        this.$message({
          message: '更新用户信息成功！',
          type: 'success',
          duration: 500,
          onClose: () => {
            this.editDialogVisible = false
            this.$emit('refreshDataList')
          }
        })
      });
    },
    // 点击取消重置
    editDialogClosed() {
      this.$refs.editFromRef.resetFields();
    },
  }
}
</script>
