<template>
  <div>
    <ul>
      <li><h3 @click="users">用户列表</h3></li>
      <li><h3 @click="rights">权限管理</h3></li>
      <li><h3 @click="goods">商品管理</h3></li>
      <li><h3 @click="orders">订单管理</h3></li>
      <li><h3 @click="reports">数据统计</h3></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  methods: {
    users() {
      this.$router.push('/users')
    },
    rights() {
      this.$router.push('/rights')
    },
    goods() {
      this.$router.push('/goods')
    },
    orders() {
      this.$router.push('/orders')
    },
    reports() {
      this.$router.push('/reports')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
