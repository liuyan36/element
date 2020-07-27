<template>
  <el-dialog title="修改用户权限" :visible.sync="editRolesDialogVisible" width="50%">
    <el-form :model="editRolesFrom" ref="editRolesRef" :rules="editRolesRules" label-width="100px">
      <el-form-item label="分类昵称" prop="editRolesFromName">
        <el-input v-model="editRolesFrom.editRolesFromName"></el-input>
        <!--使用disabled来禁用-->
      </el-form-item>

      <el-form-item label="角色描述" prop="editRolesFromDesc">
        <el-input v-model="editRolesFrom.editRolesFromDesc"></el-input>
        <!--使用disabled来禁用-->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editRolesDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editRolesInfo">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 控制修改对话框的显示与隐藏
      editRolesDialogVisible: false,
      // 编辑修改用户规则
      editRolesFrom: {
        editRolesFromId: 0,
        editRolesFromName: '',
        editRolesFromDesc: ''
      },
      // 添加编辑表单的规则对象
      editRolesRules: {
        editRolesFromName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
    }
  },
  methods: {
    init() {
      this.editRolesDialogVisible = true
    },
    // 提交并修改用户对话的内容
    editRolesInfo() {
       this.$refs.editRolesRef.validate(async valid => {
         const {data: res} = await this.$http.put('roles/' + this.editRolesFrom.editRolesFromId, {
           roleName: this.editRolesFrom.editRolesFromName,
           roleDesc: this.editRolesFrom.editRolesFromDesc
         })
         console.log({data: res})

         if(res.meta.status !== 200) {
           return this.$message.error('修改用户权限失败')
         }

         this.$message({
           message: '修改用户成功',
           type: 'success',
           duration: 500,
           onClose: () => {
             this.editRolesDialogVisible = false
             this.$emit('refreshDataList')
           }
         })
       })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
