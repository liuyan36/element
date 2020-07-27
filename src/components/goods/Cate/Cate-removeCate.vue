<template>
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
</template>

<script>
export default {
  name: "CateRemoveCate",
  data() {
    return {
      // 点击添加对话框的控制与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单对象
      addCateFrom: {
        // 添加将要分类的昵称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认是一级为0
        cat_level: 0
      },
      // 添加分类表单的规则对象
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      // 选择父级id的数组
      selectionKeys: [],
      // 用来指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
    }
  },
  methods: {
    init() {
      // 先获取父级分类列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 添加对话框关闭时重置表单的操作
    CatedDialogVisible() {
      this.$refs.addCateFromRef.resetFields()
      this.selectionKeys = []
      this.addCateFrom.cat_level = 0
      this.addCateFrom.cat_pid = 0
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
    // 添加分类成功
    addCate() {
      this.$refs.addCateFromRef.validate(async valid => {
        if(!valid) {
          return this.$message.error('校验失败')
        }
        const {data: res} = await this.$http.post('categories', this.addCateFrom)
        if(res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message({
          message: '添加分类成功',
          type: 'success',
          duration: 500,
          onClose: () => {
            this.addCateDialogVisible = false
            this.$emit('refreshDataList')
          }
        })
      })
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
  }
}
</script>
