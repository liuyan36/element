<template>
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


</template>

<script>
export default {
  name: "GoodsEdit",
  data() {
    return {
      // 控制编辑商品信息对话框显示与隐藏
      editDialogVisible: false,
      // 根据商品ID获取商品信息
      GoodsById: {},
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
      },
      GoodId: ''
    }
  },
  methods: {
    init() {
      this.editDialogVisible = true
      this.editGoods()
    },
    async editGoods() {
      const { data: res } = await this.$http.get(`goods/${this.GoodId}`);
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.status + ' : 获取商品信息失败！');
      }

      this.GoodsById = res.data;
      console.log(this.GoodsById);
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
        this.$message({
          message: '修改商品信息成功！',
          type: 'success',
          duration: 500,
          onClose: () => {
            this.editDialogVisible = false
            this.$emit('refreshDataList')
          }
        })
        this.queryInfo.pagenum = 1;
      });
    }
  }
}
</script>
