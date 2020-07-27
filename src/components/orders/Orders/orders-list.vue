<template>
  <el-dialog title="修改地址" :visible.sync="modifyDialogVisible" width="50%" @close="modifyClose">
    <el-form :model="modifyFrom" :rules="modifyRules" ref="modifyFormRef" label-width="100px">
      <el-form-item label="省市区/县" prop="modifyFrom1">
        <el-cascader :options="cityData" v-model="modifyFrom.modifyFrom1"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="modifyFrom2">
        <el-input v-model="modifyFrom.modifyFrom2"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="modifyDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="modifyDialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import cityData from "../citydata";
export default {
  name: "ordersList",
  data() {
    return {
      modifyDialogVisible: false,
      // 数据对象
      modifyFrom: {
        modifyFrom1: [],
        modifyFrom2: ""
      },
      cityData,
      // 校验规则对象
      modifyRules: {
        modifyFrom1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        modifyFrom2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
    }
  },
  methods: {
    init() {
      this.modifyDialogVisible = true
    },
    // 表单关闭重置
    modifyClose() {
      this.$refs.modifyFormRef.resetFields();
    },
  }
}
</script>
