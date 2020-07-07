<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色对象</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--添加角色按钮区-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="rolesDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!--角色按钮区-->
      <el-table :data="roleList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
           <template slot-scope="scope">
             <pre>
               {{scope.row}}
             </pre>
           </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id, scope.row.roleName)">编辑</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeRolesById(scope.row.id)"
              >删除</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加角色对话框-->
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

    <!--修改用户对话框-->
    <el-dialog title="修改用户权限" :visible.sync="editDialogVisible" width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 添加权限角色数据
      rolesFrom: {
        roleId: "",
        roleName: "",
        roleDesc: ""
      },
      // 点击添加对话框的显示与隐藏
      rolesDialogVisible: false,
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status !== 200) {
        return this.$message.error("获取列表数据失败！");
      }

      this.roleList = res.data;
    },
    // 对话框消失就重置内容
    rolesDialogClosed() {
      this.$refs.rolesFromRef.resetFields();
    },
    // 添加用户成功
    addRoles() {
      this.$refs.rolesFromRef.validate(async valid => {
        if (!valid) return {};
        const { data: res } = await this.$http.post("roles", this.rolesFrom);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        } else {
          this.$message.success("添加用户成功");
        }
        console.log(res);
        this.rolesDialogVisible = false;
        this.getRoleList();
      });
    },
    /// 展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id)
      const {data: res} = await this.$http.put('roles/' + id)
      console.log(id)
      console.log(res)
      this.editDialogVisible = true
    },
    // 根据id删除该用户
    async removeRolesById(id) {
      const confirmResilt = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // console.log(confirmResilt)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      if (confirmResilt !== "confirm") {
        return this.$message.info("你已经取消删除！");
      }

      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        this.$message.error("已取消删除");
      }
      this.$message.success("删除用户成功");
      this.getRoleList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
