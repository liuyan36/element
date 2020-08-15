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
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="queryOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--订单列表数据-->
      <el-table :data="ordersList" border script>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户ID" prop="user_id"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="收货地址" prop="order_fapiao_title"></el-table-column>
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
    <orders-list v-if="listAbord" ref="abordList" @refreshDataList="getOrdersList"></orders-list>
    <!--展示物流地理位置对话框-->
    <orders-item v-if="proGerss" ref="gerssPro" @refreshDataList="getOrdersList"></orders-item>
  </div>
</template>

<script>
import ordersList from './Orders/orders-list'
import ordersItem from './Orders/orders-positioning'

export default {
  name: "orders",
  components: {
    ordersList,
    ordersItem
  },
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
      listAbord: false,
      proGerss: false,
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
      this.listAbord = true
      this.$nextTick(() => {
        this.$refs.abordList.init()
      })
    },
    showProgerssBox() {
      console.log('1111')
      this.proGerss = true
      this.$nextTick(() => {
        this.$refs.gerssPro.init()
      })
    },
     // 搜索框按钮点击事件
    async queryOrderList() {
      this.queryInfo.pagenum = 1;
      this.getOrderList();
    },
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
