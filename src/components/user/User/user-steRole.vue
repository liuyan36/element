<template>
  <el-dialog title="分配角色" :visible.sync="steRoleDialogVisible" width="50%" @close="staRoleDialogClose">
    <div>
      <p>当前的用户：{{userinfo.username}}</p>
      <p>当前的角色：{{userinfo.role_name}}</p>
      <p>分配新角色:
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="steRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="seveRoleInfo">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "userSteRole",
  data() {
    return {
      // 控制分配角色对话框的显示与隐藏
      steRoleDialogVisible: false,
      // 需要分配的角色信息
      userinfo: {},
      // 已选中的角色id值
      selectedRoleId: '',
      //所有角色的数据列表
      rolesList: [],
    }
  },
  methods: {
    init() {
      this.steRoleDialogVisible = true
      this.steRole()
    },
    async steRole() {
      // 在展示对话框之前，获取所有角色列表
      const {data: res} = await this.$http.get('roles')
      console.log(res.data)
      if(res.meta.status !== 200) {
        return this.$message.error('获取角色列表')
      }

      this.rolesList = res.data
    },
    // 点击按钮分配角色
    async seveRoleInfo() {
      if(!this.selectedRoleId) {
        return this.$message.error('请选择一个分配角色')
      }
      const {data:res} = await this.$http.put(`users/${this.userinfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if(res.meta.status !== 200) {
        return this.$message.error('更新分配角色失败')
      }
      this.$message({
        message: '分配角色成功',
        type: 'success',
        duration: 500,
        onClose: () => {
            this.steRoleDialogVisible = false
            this.$emit('refreshDataList')
          }
      })
    },
    // 分配角色对话框的关闭事件
    staRoleDialogClose() {
      this.selectedRoleId = '',
      this.userinfo = {}
    }
  }
}
</script>

<style scoped>

</style>
