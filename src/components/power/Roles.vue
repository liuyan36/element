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
                @click="showEditDialog(scope.row.id, scope.row.roleName)"
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

    <!--分配权限对话框-->
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
      editDialogVisible: false,
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
      roleId:''
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
        this.getRolesList();
      });
    },
    /// 展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.$http.put("roles/" + id);
      console.log(id);
      console.log(res);
      this.editDialogVisible = true;
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
      this.roleId = role.id
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
      this.getTerrKeys(role, this.defEdKy)
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
    // 监听分配权限对话框的关闭事件
    steRightDialogClose() {
      this.defEdKy = []
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
      this.$message.success('分配权限成功')
      // 分配完后刷新页面
      this.getRolesList()
      // 然后将其关闭
      this.steRightDialogVisible = false
     }
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
