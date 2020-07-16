<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片试图-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--订单列表数据-->
      <el-table :data="ordersList" border script>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClicked"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgerssBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分页区-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--修改用户对话框-->
    <el-dialog title="修改地址" :visible.sync="modifyDialogVisible" width="50%" @close="modifyClose">
      <el-form :model="modifyFrom" :rules="modifyRules" ref="modifyFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="modifyFrom1">
          <el-cascader :options="cityData" v-model="modifyFrom.modifyFrom1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="modifyFrom2">
          <el-input v-model="modifyFrom.modifyFrom2"></el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--展示物流地理位置对话框-->
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
  </div>
</template>

<script>
import cityData from "./citydata";

export default {
  name: "orders",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 获取数据列表
      ordersList: [],
      // 控制修改地址的显示与隐藏
      modifyDialogVisible: false,
      // 数据对象
      modifyFrom: {
        modifyFrom1: [],
        modifyFrom2: ""
      },
      // 校验规则对象
      modifyRules: {
        modifyFrom1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        modifyFrom2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      cityData,
      // 控制物流对话的显示与隐藏
      progerssDialogVisible: false,
      //
      progerssEd: []

    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      console.log(res.data);
      this.total = res.data.total;
      this.ordersList = res.data.goods;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrdersList();
    },
    // 修改地址的对话框显示与隐藏
    editClicked() {
      this.modifyDialogVisible = true;
    },
    // 表单关闭重置
    modifyClose() {
      this.$refs.modifyFormRef.resetFields();
    },
    async showProgerssBox() {
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      if(res.meta.status !== 200) {
        return this.$message.error('查询物流进度失败')
      }

      this.progerssEd = res.data
     this.progerssDialogVisible = true
     console.log(this.progerssEd)
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

.el-table {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
