<template>
  <el-dialog
      :title="'修改' + titleText "
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogColsed"
    >
      <!--修改参数对话框-->
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  name: "paramsShow",
  data() {
    return {
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 级联选择框双向绑定到的数组
      selectCateList: [],
      // 修改的表单数据对象
      editFrom: {},
      // 这是被激活的页签名称
      activeName: "many",
      // 修改表单的规则对象
      editFromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      attr_id: 0
    }
  },
  computed: {
    // 分类id的获取方法
    cateId() {
      if (this.selectCateList.length === 3) {
        return this.selectCateList[2];
      }
      return null;
    },
    // 计算当前文本标题
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  },
  methods: {
    init() {
      this.editDialogVisible = true
      this.showEditDialog()
    },
    async showEditDialog() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${this.attr_id}`,
        {
          parasm: { attr_sel: this.activeName }
        }
      );
      console.log({ data: res })
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败");
      }
      this.editFrom = res.data;
      this.editDialogVisible = true
    },
    // 点击按钮修改操作
    editParams() {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return;

        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败");
        }

        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 500,
          onClose: () => {
            this.editDialogVisible = false
            this.$emit('refreshDataList')
          }
        })
      });
    },
    // 重置修改的表单操作
    editDialogColsed() {
      this.$refs.editFromRef.resetFields();
    },
  }
}
</script>

<style lang="less" scoped>

</style>
