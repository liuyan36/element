<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片试图-->
    <el-card>
      <!--添加分类-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTabel"
      >
        <!--是否有效模板-->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--排序模板-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二</el-tag>
          <el-tag v-else type="warning">三</el-tag>
        </template>
        <!--操作-->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 7, 9, 11]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--添加角色对话框-->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="CatedDialogVisible">
      <el-form :model="addCateFrom" :rules="addCateRules" ref="addCateFromRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label=" 父级分类：">
          <!--用来指定数据源-->
          <!--Props 用来指定配置对象-->
          <el-cascader
            expand-trigger="hover"
            v-model="selectionKeys"
            :props="cascaderProps"
            :options="parentCateList"
            @change="parentCateChanged"
            clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑对话框-->
    <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form :model="editCateFrom" :rules="editCateRules" ref="editCateFromRef" label-width="100px">
        <el-form-item label="分类昵称" prop="editCateFromName">
          <el-input v-model="editCateFrom.editCateFromName"></el-input>
          <!--使用disabled来禁用-->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: '3',
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类列表，默认为空
      cateList: [],
      // 总数据条数
      total: 0,
      // 点击添加对话框的控制与隐藏
      addCateDialogVisible: false,
      // 点击编辑对话框的控制与隐藏
      editCateDialogVisible: false,
      // 添加分类的表单对象
      addCateFrom: {
        // 添加将要分类的昵称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认是一级为0
        cat_level: 0

      },
      // 为table属性制作标题
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 表示当前模板
        type: 'template',
        // 表示当前使用这一列模板的名称
        template: 'isok'
      },
      {
        label: '排序',
        type: 'template',
        template: 'order'
      },
      {
        label: '操作',
        // 表示当前模板
        type: 'template',
        // 表示当前使用这一列模板的名称
        template: 'opt'
      }],
      // 添加分类表单的规则对象
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 添加编辑表单的规则对象
      editCateRules: {
        editCateFromName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 用来指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选择父级id的数组
      selectionKeys: [],
      // 查询到的用户规则
      editCateFrom: {
        editCateFromId: 0,
        editCateFromName: ''
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const {data: res} = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品失败')
      }
      console.log(res.data)
      // 数据列表赋值给cateList
      this.cateList = res.data.result
      // 总数据条数展示
      this.total = res.data.total
    },
    // 条件pagination事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 当前页码值触发事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮展示分类对话框
    showAddCateDialog() {
      // 先获取父级分类列表
      this.getParentCateList()
      // 然后在展示出对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const {data: res} = await this.$http.get('categories',{params:{type: 2}})

      if(res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectionKeys)
      // 如果selctionKeys 数组中的length 大于0，证明选中的父级分类
      // 反之， 就说明没有选择如何父级分类
      if(this.selectionKeys.length > 0) {
        // 父级的id
        this.addCateFrom.cat_pid =  this.selectionKeys[
          this.selectionKeys.length -1
        ]
        // 为当前分类的等级赋值
          this.addCateFrom.cat_level = this.selectionKeys.length
          return
      } else {
          this.addCateFrom.cat_pid = 0
        // 为当前分类的等级赋值
          this.addCateFrom.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateFromRef.validate(async valid => {
        if(!valid) {
          return this.$message.error('校验失败')
        }
        const {data: res} = await this.$http.post('categories', this.addCateFrom)
        if(res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加分类成功')
        // 添加成功刷新数据
        this.getCateList()
        // 添加成功关闭对话框
        this.addCateDialogVisible = false
      })
    },
    // 添加对话框关闭时重置表单的操作
    CatedDialogVisible() {
      this.$refs.addCateFromRef.resetFields()
      this.selectionKeys = []
      this.addCateFrom.cat_level = 0
      this.addCateFrom.cat_pid = 0
    },
    // 表格的删除功能
    async removeCate(cat_id) {
      console.log(cat_id)
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

      const { data: res } = await this.$http.delete("categories/" + cat_id)
      console.log({ data: res })
      if(res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }

      this.$message.success('删除成功')
      this.getCateList()
    },
    // 表格的编辑功能
    showEditDialog(cateList) {
      console.log(cateList)
      this.editCateFrom.editCateFromId = cateList.cat_id
      this.editCateFrom.editCateFromName = cateList.cat_name
      this.editCateDialogVisible = true
    },
    // 表格的编辑提交功能
    editCateInfo() {
      this.$refs.editCateFromRef.validate(async valid => {
        if(!valid) return ;
        //发起编辑信息的修改请求
        const {data: res } = await this.$http.put("categories/" + this.editCateFrom.editCateFromId, {
          cat_name: this.editCateFrom.editCateFromName
        })
        console.log({ data: res })

        if(res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }

        this.$message.success('更新成功')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.treeTabel {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
