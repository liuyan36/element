<template>
  <el-dialog title="分配权限" :visible.sync="steRightDialogVisible" width="50%" @close="steRightDialogClose">
    <!--树形控件, 通过冒号data指定数据源，tongg冒号props属性绑定对象-->
    <!--show-checkbox{复选框可选择的} node-key="id"{唯一的可选值框}-->
    <!--default-checked-keys 默认勾选的树形组件-->
    <el-tree :data="rightsList" :props="terrProps"
              show-checkbox node-key="id" default-expand-all
              :default-checked-keys="defEdKy" ref="terrRef"></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="steRightDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRightDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 控制对话框的显示与隐藏
      steRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      // 树形控件的绑定对象
      terrProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defEdKy: [],
      // 当前即将分配权限的角色id
      roleId:'',
      roles: {}
    }
  },
  methods: {
    init() {
      this.steRightDialogVisible = true
      this.showSteRightDia()
    },
      // 展示分配权限对话框
    async showSteRightDia() {
      // 获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      // 获取到的权限数据保存到data中
      this.rightsList = res.data;
      console.log(this.rightsList);
      // 获取三级权限的id
      // 从创建defEdKy 然后传入role，然后递归传入到defEdKy中
      this.getTerrKeys(this.roles, this.defEdKy)
      this.steRightDialogVisible = true;
    },
    // 通过递归的形式，将获取角色下的三级权限的id，并保存到defEdKy数组中，
    getTerrKeys(node, arr) {
      // 如果当前节点不包含children属性，则是三级权限
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getTerrKeys(item, arr)
      })
    },
    // 点击为角色分配权限
    async allotRightDialog() {
      const keys = [
        ...this.$refs.terrRef.getCheckedKeys(),
        ...this.$refs.terrRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      // 拿到接口数据后 判断status来进行，失败就弹出失败
      if(res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message({
        message: '分配权限成功',
        type: 'success',
        duration: 500,
        onClose: () => {
          this.steRightDialogVisible = false
          this.$emit('refreshDataList')
        }
      })
     },
    // 监听分配权限对话框的关闭事件
    steRightDialogClose() {
      this.defEdKy = []
    },
  }
}
</script>

<style lang="less" scoped>

</style>
