<template>
  <div class="home-container">
    <el-container class="el-container">
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse?'64px':'250px'" class="el-aside">
        <!-- 导航菜单 -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#20222A"
          text-color="#fff"
          active-text-color="#009688"
          :collapse-transition="false"
          :collapse="isCollapse"
          router
          :default-active="defaultPath"
          :unique-opened="true"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveDefaultPath('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                {{subItem.authName}}
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部区域 -->
        <el-header class="el-header">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link avatar-box">
              <el-row class="demo-avatar demo-basic">
                <el-col>
                  <div class="demo-basic--circle">
                    <div class="block">
                      <el-avatar size="small" :src="circleUrl"></el-avatar>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="welcome">首页</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <!-- 主体区域 -->
        <el-main class="el-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  created() {
    this.getMenuList()
    this.defaultPath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      //是否展开收起侧边栏
      isCollapse: false,
      // 侧边栏数据
      menuList: [],
      // 图标数据
      iconList: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-danju',
        '101': 'iconfont icon-lock_fill',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      //被激活的链接地址
      defaultPath: '',
      // 头像地址
      circleUrl:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  methods: {
    //保存链接的激活状态
    saveDefaultPath(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      this.defaultPath = activePath;
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    handleCommand(command) {
      if (command == 'logout') {
        window.sessionStorage.clear()
        this.$router.push('/login')
      }else if(command == 'welcome'){
        this.defaultPath = ''
        window.sessionStorage.removeItem('activePath')
        this.$router.push('/welcome')
      }
    },
    //侧边栏展开收起按钮
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  height: 100%;
  width: 100%;
  .el-container {
    height: 100%;
    width: 100%;
    .el-aside {
      background-color: #20222a;
      .el-menu-vertical-demo {
        border-right: none;
      }
      .iconfont {
        margin-right: 10px;
      }
    }
    .el-header {
      display: flex;
      justify-content: space-between;
      padding: 15px 40px 15px 0;
      box-sizing: border-box;
      .avatar-box {
        display: flex;
        .el-icon-arrow-down {
          display: flex;
          align-items: center;
        }
      }
      .toggle-button {
        width: 50px;
        text-align: center;
        cursor: pointer;
      }
    }
    .el-main {
      background-color: #fafafa;
    }
  }
}
</style>
