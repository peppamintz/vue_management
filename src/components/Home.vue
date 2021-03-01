<!--
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-02-20 15:26:17
 * @LastEditors: mintZ
 * @LastEditTime: 2021-02-23 17:04:05
-->
<template>
  <el-container class="home-container">
    <el-header>
      <div class="left-header">
        <img src="../assets/images/2.jpg" />
        <span>电商后台管理系统</span>
      </div>
      <button @click="logout">退出</button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition='false'
          :router='true'
        >
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children"
            :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
  <!-- <div>
    <button @click="logout">退出</button>
  </div> -->
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        102: 'iconfont icon-danju',
        101: 'iconfont icon-shangpin',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath: '',
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    async getMenuList() {
      const { data } = await this.$http.get('menus');
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      this.menuList = data.data;
      console.log('+++++++++++', data.data);
      return data.data;
    },
    // 点击按钮，折叠和展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', this.$route.path);
      this.activePath = activePath;
    },
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
};
</script>
<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  color: white;
  align-items: center;
  padding: 0 5px;
  .left-header {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
    }
    > span {
      padding: 10px;
      font-size: 20px;
    }
  }
  button {
    display: block;
    height: 35px;
    width: 50px;
    background-color: #aaa;
    color: white;
    font-size: 14px;
    border-radius: 10%;
    border: 0;
  }
}
.el-aside {
  background-color: #333744;
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    background-color: #333744;
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
