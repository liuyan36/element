<template>
  <el-dialog title="提示" :visible.sync="rolesDialogVisible" width="50%" @close="rolesDialogClosed">
    <el-form :model="rolesFrom" ref="rolesFromRef" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="rolesFrom.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="rolesFrom.roleDesc"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="rolesDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRoles">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "rolesadd",
  data() {
    return {
      // 添加权限角色数据
      rolesFrom: {
        roleId: "",
        roleName: "",
        roleDesc: ""
      },
      // 点击添加对话框的显示与隐藏
      rolesDialogVisible: false,
    }
  },
  methods: {
    init() {
      this.rolesDialogVisible = true
    },
    // 添加用户成功
    addRoles() {
      this.$refs.rolesFromRef.validate(async valid => {
        if (!valid) return {};
        const { data: res } = await this.$http.post("roles", this.rolesFrom);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        } else {
          this.$message({
            message: '添加用户成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.rolesDialogVisible = false
              this.$emit('refreshDataList')
            }
          });
        }
      });
    },
    // 对话框消失就重置内容
    rolesDialogClosed() {
      this.$refs.rolesFromRef.resetFields();
    },
  }
}
</script>

<style lang="less" scoped>

</style>
