<template>
  <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form :model="editCateFrom" :rules="editCateRules" ref="editCateFromRef" label-width="100px">
        <el-form-item label="分类昵称" prop="editCateFromName">
          <el-input v-model="editCateFrom.editCateFromName"></el-input>
          <!--使用disabled来禁用-->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo()">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  name: "CateShow",
  data() {
    return {
      // 点击编辑对话框的控制与隐藏
      editCateDialogVisible: false,
      // 查询到的用户规则
      editCateFrom: {
        editCateFromId: 0,
        editCateFromName: ''
      },
      // 添加编辑表单的规则对象
      editCateRules: {
        editCateFromName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
    }
  },
  methods: {
    init() {
      this.editCateDialogVisible = true
      this.editCateInfo()
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

        this.$message({
            message: '更新成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.editCateDialogVisible = false
              this.$emit('refreshDataList')
            }
          })
      })
    }
  }
}
</script>

<style scoped>

</style>
