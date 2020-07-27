<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card class="box-card">
      <!--搜索框-->
      <el-row :gutter="20">
        <!--分栏操作-->
        <el-col :span="7">
          <!--文本框数据搜索，第一步v-model绑定获取列表参数的queryInfo.query其中query是输入搜索的关键字-->
          <!--使用clearable来进行输入框清理，然后使用@clear是当点击清理文本框的时候同时将数据刷新到原始状态-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
            <!--第二步 绑定全局数据 @click="getUsersList"来进行搜索-->
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserList">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表区-->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-tooltip effect="dark" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <!--删除按钮-->
            <el-tooltip effect="dark" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!--分配角色按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="small"
                        @click="steRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--应该用户对话框-->
    <user-show v-if="userShow" ref="showUser" @refreshDataList="getUsersList"></user-show>
    <!--添加用户对话框-->
    <add-user-list v-if="addUser" ref="userAdd" @refreshDataList="getUsersList"></add-user-list>
    <!--分配角色对话框-->
    <ste-role v-if="SteRole" ref="RoleSte" @refreshDataList="getUsersList"></ste-role>
  </div>
</template>

<script>
import UserShow from './User/user-show'
import AddUserList from './User/user-add'
import steRole from './User/user-steRole'

export default {
  name: "Users",
  components: {
    UserShow,
    AddUserList,
    steRole
  },
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户的对话框显示与隐藏
      addUser: false,
      // 控制修改用户的对话框显示与隐藏
      userShow: false,
      // 控制分配角色对话框的显示与隐藏
      SteRole: false,
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      console.log({ data: res });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 箭头swich开关状态的改变
    async userStateChange(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    // 添加用户的对话框显示与隐藏
    addUserList() {
      this.addUser = true
      this.$nextTick(() => {
        this.$refs.userAdd.init()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(userList) {
     // console.log(userList)
      this.userShow = true
      this.$nextTick(() => {
        this.$refs.showUser.showId = userList.id
        this.$refs.showUser.init()
      })
    },
    // 根据id删除用户信息
    async removeUserById(id) {
      // 询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("你已经取消删除！");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        this.$message.error("已取消删除");
      }
      this.$message.success("删除用户成功");
      this.getUsersList();
    },
    // 箭头pagesize的改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUsersList();
      console.log(newSize);
    },
    // 箭头页码值得改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUsersList();
    },
    // 展示分配角色的对话框
    steRole(userinfo) {
      console.log(userinfo)
      this.SteRole = true
      this.$nextTick(() => {
        this.$refs.RoleSte.userinfo = userinfo
        this.$refs.RoleSte.init()
      })
    }
  }
};
</script>

<style lang="less" scoped>
</style>

