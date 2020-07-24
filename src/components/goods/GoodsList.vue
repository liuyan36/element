<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片试图区-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--table表格区-->
      <el-table :data="GoodsList" border stript>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品昵称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
        <el-table-column label="是否热销产品" width="120px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_promote === false">否</el-tag>
            <el-tag v-else>是</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="热销品数量" prop="hot_mumber" width="105px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.upd_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editGoods(scope.row.goods_id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteDialog(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--修改参数对话框-->
       <!-- 编辑商品信息对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="editDialogClosed"
    >
      <!-- 修改商品表单区域 -->
      <el-form :model="GoodsById" :rules="GoodsByIdRuls" ref="GoodsByIdRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="GoodsById.goods_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input type="number" v-model.number="GoodsById.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input type="number" v-model.number="GoodsById.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input type="number" v-model.number="GoodsById.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GoodsList",
  data() {
    return {
      // 获取列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表,
      GoodsList: [],
      // 商品参数列表
      goodsProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 根据商品ID获取商品信息
      GoodsById: {},
      // 总数据条数
      total: 0,
      // 控制编辑商品信息对话框显示与隐藏
      editDialogVisible: false,
      // 编辑并提交表单用户
       // 编辑商品信息校验规则
      GoodsByIdRuls: {
        goods_name: [
          { required: true, message: '请填写商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', min: 0, message: '不能小于0', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { type: 'number', min: 0, message: '不能小于0', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { type: 'number', min: 0, message: '不能小于0', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 根据分页获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      this.$message.success("获取参数列表成功");
      console.log(res.data);
      this.GoodsList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除按钮的操作
    async deleteDialog(id) {
      console.log(id)
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
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

      const {data: res} = await this.$http.delete(`goods/${id}`)
      if(res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    },
    async editGoods(id) {
      const { data: res } = await this.$http.get(`goods/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.status + ' : 获取商品信息失败！');
      }
      // console.log(res);
      this.GoodsById = res.data;
      // console.log(this.GoodsById);
      this.editDialogVisible = true;
    },
    // 编辑商品对话框关闭
    editDialogClosed() {
      this.$refs.GoodsByIdRef.clearValidate();
      this.GoodsById = {};
    },
    // 提交表单修改信息
    editDialogBtn() {
      // 表单预验证
      this.$refs.GoodsByIdRef.validate(async valid => {
        if (!valid) return null;
        // 验证通过，发起修改请求
        const editForm = {};
        editForm.goods_name = this.GoodsById.goods_name;
        editForm.goods_price = this.GoodsById.goods_price + '';
        editForm.goods_number = this.GoodsById.goods_number + '';
        editForm.goods_weight = this.GoodsById.goods_weight;
        editForm.goods_cat = this.GoodsById.goods_cat;
        // console.log(editForm);
        const { data: res } = await this.$http.put(
          `goods/${this.GoodsById.goods_id}`,
          editForm
        );
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.status + ' : 修改商品信息失败！');
        }
        // console.log(res);
        // 修改成功
        this.$message.success('修改商品信息成功！');
        this.queryInfo.pagenum = 1;
        // 重新读取商品信息列表
        this.getGoodsList();
        // 关闭对话框
        this.editDialogVisible = false;
      });
    }
  }
}
</script>

<style lang="less" scoped>
</style>
