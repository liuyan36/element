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
          <el-button type="primary" @click="rolesAdd">添加角色</el-button>
        </el-col>
      </el-row>

      <!--角色按钮区-->
      <el-table :data="roleList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!--在这个地方使用for循环来进来使用，用key来保证id的唯一性-->
            <el-row
              :class="['dbbottom', i1 === 0 ? 'dbtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级三级权限-->
              <el-col :span="19">
                <!--通过for 循环嵌套二级菜单-->
                <el-row
                  :class="[i2 === 0 ? '': 'dbtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!--左侧-->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>
               {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
              >编辑</el-button>
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
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSteRightDia(scope.row)"
              >分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加角色对话框-->
    <roles-add v-if="roleAdd" ref="addRoles" @refreshDataList="getRolesList"></roles-add>

    <!--修改用户对话框-->
    <roles-show v-if="roleShow" ref="showRole"  @refreshDataList="getRolesList"></roles-show>
    <!--分配权限对话框-->
    <roles-sta v-if="roleSta" ref="staRole" @refreshDataList="getRolesList"></roles-sta>
  </div>
</template>

<script>
import RolesAdd from './Roles/roles-add'
import RolesShow from './Roles/roles-show'
import RolesSta from './Roles/roles-staRoles'

export default {
  name: "Roles",
  components: {
    RolesAdd,
    RolesShow,
    RolesSta
  },
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 点击添加对话框的显示与隐藏
      roleAdd: false,
      // 控制修改对话框的显示与隐藏
      roleShow: false,
      // 控制对话框的显示与隐藏
      roleSta: false
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status !== 200) {
        return this.$message.error("获取列表数据失败！");
      }

      this.roleList = res.data;
    },
    // 添加按钮操作
    rolesAdd() {
      this.roleAdd = true
      this.$nextTick(() => {
        this.$refs.addRoles.init()
      })
    },
    // 根据id删除该用户
    async removeRolesById(id) {
      const confirmResult = await this.$confirm(
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
      if (confirmResult !== "confirm") {
        return this.$message.info("你已经取消删除！");
      }

      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        this.$message.error("已取消删除");
      }
      this.$message.success("删除用户成功");
      this.getRolesList();
    },
    // 根据id删除对应权限
    async removeRightById(role, rightId) {
      // 弹框是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      // 不建议直接调用页面函数，会产生翻转效果
      // 自动合并，把服务器最新权限重新赋值给childern
      // this.getRolesList()
      role.children = res.data;
    },
    // 展示分配权限对话框
    async showSteRightDia(role) {
      this.roleSta = true
      this.$nextTick(() => {
        this.$refs.staRole.roles = role
        this.$refs.staRole.roleId = role.id
        this.$refs.staRole.init()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(roleList) {
      console.log(roleList)
      this.roleShow = true
      this.$nextTick(() => {
        this.$refs.showRole.editRolesFrom.editRolesFromId = roleList.id
        this.$refs.showRole.editRolesFrom.editRolesFromName = roleList.roleName
        this.$refs.showRole.editRolesFrom.editRolesFromDesc = roleList.roleDesc
        this.$refs.showRole.init()
      })
    },
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.dbtop {
  border-top: 1px solid #eee;
}

.dbbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
