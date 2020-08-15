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
    <cate-remove-cate v-if="cateRemove" ref="removeCate" @refreshDataList="getCateList"></cate-remove-cate>
    <!--编辑对话框-->
    <cate-show v-if="showEdit" ref="editShow" @refreshDataList="getCateList"></cate-show>
  </div>
</template>

<script>
import CateShow from './Cate/Cate-show'
import CateRemoveCate from './Cate/Cate-removeCate'

export default {
  name: "Cate",
  components: {
    CateShow,
    CateRemoveCate
  },
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
      showEdit: false,
      cateRemove: false
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
      // 然后在展示出对话框
      this.cateRemove = true
      this.$nextTick(() => {
        this.$refs.removeCate.init()
      })
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
      this.showEdit = true
       this.$nextTick(() => {
        this.$refs.editShow.editCateFrom.editCateFromId = cateList.cat_id
        this.$refs.editShow.editCateFrom.editCateFromName = cateList.cat_name
        this.$refs.editShow.init()
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
