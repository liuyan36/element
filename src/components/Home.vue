<template>
  <el-container class="home-container">
    <!--头部区-->
    <el-header>
      <div class="home-box">
        <img src="../assets/img/gongjian.jpg" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--主体区-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px': '200px'"><!--动态绑定isCollapse是否是true，是true的时候是200px不是是64px-->
        <div class="toggin-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单区-->
        <el-menu background-color="#333744" text-color="#fff"
                 active-text-color="#409EFF" unique-opened :collapse="isCollapse"
                 :collapse-transition="false" router
                 :default-active="activePath"><!--修改点击颜色,动态绑定collapse来显示是否展开，
                 关闭折叠动画,加入router属性开启侧边栏路由，在由二级菜单中通过'/' + subItem.path来跳转地址-->
          <!--一级菜单-->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
            <!--一级菜单模板-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>

            <!--二级菜单模板-->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
                            @click="saveNavState('/' + subItem.path)">
                <!--二级图标-->
                <i class="el-icon-menu"></i>
                {{subItem.authName}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体并将其设置新的vue组件Welcome-->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 图标
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-lock_fill',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 被激活的连接地址
      activePath: ''
    }
  },
  created() {
    this.getWenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 先将token清空然后重定位置login
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getWenuList() {
      // 获取所有的菜单
      const {data: res} = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.status)
      console.log(res.data)
      this.menuList = res.data
    },
    toggleCollapse() {
      // 点击按钮切换菜单的折叠与展开
      this.isCollapse = !this.isCollapse
    },
      // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
};
</script>

<style lang="less" scoped>

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  > div {
    display: flex;
    align-items: center;
    > img {
      width: 60px;
      border-radius: 50%;
    }
    span {
      padding-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eeee;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 8px;
}
.toggin-button {
  background-color: #4A5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
