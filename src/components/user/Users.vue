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
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表区-->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
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
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!--删除按钮-->
            <el-tooltip effect="dark" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="small" @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!--分配角色按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="small "></el-button>
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

    <!--添加用户对话框-->
    <!--在这里监听表单的重置  绑定 @close 进行操作-->
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
    <!--应该用户对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFromRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input><!--使用disabled来禁用-->
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
  </div>
</template>

<script>
export default {
  name: "Users",
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
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      // 添加用户的表单数据
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      userList: [],
      total: 0,
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户的对话框显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息duix
      editFrom: {},
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
      // 修改表单的验证规则对象
      editFromRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
           { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur"}
        ]
      }
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
    // 监听添加用户对话框的关闭事件，只要触发就关闭，进行重置
    addDialogClosed() {
      this.$refs.addFromRef.resetFields();
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
          this.$message.success("添加用户成功");
        }
        console.log(res);
        console.log(res.meta.status);
        // 当判断成功的时候，添加隐藏用户框
        this.addDialogVisible = false;
        // 重新获取用户数据
        this.getUsersList();
      });
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id)
      console.log({ data: res })
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.editFrom = res.data;
      this.editDialogVisible = true;
    },
    // 点击取消重置
    editDialogClosed() {
      this.$refs.editFromRef.resetFields()
    },
    // 修改用户信息点击提交
    editUserInfo() {
      this.$refs.editFromRef.validate(async valid => {
        if(!valid) return
        // 发起用户信息的修改请求
        // async 和 await  是为了简化prosime网络请求
        const {data: res} = await this.$http.put('users/' + this.editFrom.id, {
          email: this.editFrom.email,
          mobile: this.editFrom.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('更新用户信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUsersList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 根据id删除用户信息
    async removeUserById(id) {
      // 询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消删除，则返回值为字符串 cancel
        if(confirmResult !== 'confirm') {
          return this.$message.info('你已经取消删除！')
        }
        const {data: res} = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('已取消删除')
        }
        this.$message.success('删除用户成功')
        this.getUsersList()
    },
    // 箭头pagesize的改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUsersList();
      console.log(newSize)
    },
    // 箭头页码值得改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUsersList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>

