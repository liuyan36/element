<template>
    <el-dialog
      :title="'添加' + titleText "
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogColsed"
    >
      <!--添加参数对话框-->
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsInfo">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  name: "paramsAdd",
  data() {
    return {
      addDialogVisible: false,
      // 级联选择框双向绑定到的数组
      selectCateList: [],
      // 这是被激活的页签名称
      activeName: "many",
      // 这是添加表单的数据对象
      addFrom: {
        attr_name: ""
      },
      // 验证表单的验证规则的对象
      addFromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
    }
  },
  computed: {
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
      this.addDialogVisible = true
    },
    // 点击按钮添加参数
    addParamsInfo() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeName
          }
        );
        console.log({ data: res });
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message({
          message: '添加成功',
          type: 'success',
          onClose: () => {
            this.addDialogVisible = false
            this.$emit('refreshDataList')
          }
        })
      });
    },
    // 监听对话框关闭重置
    addDialogColsed() {
      this.$refs.addFromRef.resetFields();
    },
  }
}
</script>

<style lang="less" scoped>

</style>
