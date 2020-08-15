<template>
  <el-dialog title="物流进度" :visible.sync="progerssDialogVisible" width="50%">
      <!--时间线-->
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in progerssEd"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
      </el-timeline-item>
    </el-timeline>
    <span slot="footer" class="dialog-footer">
      <el-button @click="progerssDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="progerssDialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "orders-item",
  data() {
    return {
      progerssDialogVisible: false,
      progerssEd: []
    }
  },
  methods: {
    init() {
      this.progerssDialogVisible = true
      this.showProgerssBox()
    },
    async showProgerssBox() {
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      if(res.meta.status !== 200) {
        return this.$message.error('查询物流进度失败')
      }

     this.progerssEd = res.data
     this.progerssDialogVisible = true
     console.log(this.progerssEd)
    },
  }
}
</script>
