<template>
<!-- 每个el-container会被解析成class类名的 -->
    <el-container>
        <!-- 头部区域 -->
      <el-header>
          <div class="header-l">
            <img src="@/assets/img/systemLogo.png" alt="">
            <span>电商后台管理系统</span>
          </div>
          <div class="header-r">
            <el-button type="info" @click="logout">退出</el-button>
          </div>         
      </el-header>

        <!-- 页面主体区域 -->
      <el-container>
          <!-- 页面侧边栏 -->
        <el-aside :width="isCollapse ? '64px' :'200px'">
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- 侧边栏菜单区域 -->
            <!-- unique-opened和collapse见Element-UI官网 -->
            <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#409eff" 
      :unique-opened="true" 
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath">
      <!-- 一级菜单区域 -->
      <!-- ElementUI模板中的index是字符串类型，所以我们需要将其item.id数值
      转换为字符串类型；
      并且，index值如果是相同的，则点击第一个菜单栏，剩下的其他菜单全部跟着展开
      ，效果不好，所以index需要动态绑定，且index值要是不同的 -->
      <el-submenu :index="item.id+''" v-for="item in menuList" 
      :key="item.id"  :childMenuItem="item">
          <!-- 一级菜单的模板区域 -->
        <template slot="title">
            <!-- 1）图标 -->
          <i  :class="iconsObj[item.id]"></i>
            <!-- 2）文本 -->
          <span>{{item.authName}}</span>
        </template>

          <!-- 二级菜单 -->
          <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" 
          :key="subItem.id" @click="saveNavState('/' + subItem.path)">
            <template slot="title">
              <!-- 1）图标 -->
              <i class="el-icon-menu"></i>
              <!-- 2）文本 -->
              <span>{{subItem.authName}}</span>
        </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
        </el-aside>

          <!-- 右侧内容主体 -->
        <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>
</template>

<script>


export default {
    data(){
      return {
        //  左侧菜单数据 
        menuList:[],
        // 定义一个图标对象(一级菜单for循环，都是相同的图标，所以我们需要动态获取)
        iconsObj:{
            // 这些数字都是对应的一级菜单中的id值，作为唯一的key值
            // 属性值：是图标类名
            '125':'iconfont icon-user',
            '103':'iconfont icon-tijikongjian',
            '101':'iconfont icon-shangpin',
            '102':'iconfont icon-danju',
            '145':'iconfont icon-baobiao'

        },
        // 左侧菜单栏是否折叠
        isCollapse:false,
        // 保存被激活的链接地址
         activePath:''
      }
     
    },
    // 在该组件创建的时候，就去调数据
    created () {
        this.getMenuList()
        this.activePath = sessionStorage.getItem('activePath')
    },
    methods: {
        // 头部的退出按钮
        logout(){
            // 1)首先，清空token
            sessionStorage.clear();
            // 2)其次，强制跳转到login登录页面
            this.$router.push('/login');
        },

        //  获取所有的菜单数据
       async getMenuList(){
            // this.$http 就是axios
            const res = await this.$http.get('menus')
            // console.log(res)
            // 如果获取数据没有成功的话，跳出错误型弹框
           if(res.status !== 200)  this.$message.error(res.data.meta.msg)
           this.menuList = res.data.data
          //  console.log(this.menuList)
        },

        // 实现左侧菜单的折叠与展开
        toggleCollapse(){
             this.isCollapse = !this.isCollapse
        },
        // 保持链接的激活状态
        saveNavState(activePath){
           sessionStorage.setItem('activePath',activePath)
           this.activePath = activePath
        }
    }
    
}
</script>

<style scoped>
.el-container {
    height: 100%;
   
}
.el-header {
  height: 40px;
  padding-left: 0; /* el-header标签元素原本设置了padding*/
  background-color: #373d41;

  display: flex;
  justify-content: space-between;
  align-items: center;

  color: #fff;
  font-size: 20px;
}
.el-header .header-l {
  display: flex;
  align-items: center;
}
.el-header .header-l span {
    margin-left: 10px;
}

.el-aside {
    background-color: #333744;
}
.el-aside  .toggle-button {
    background-color: #4a5064;
    color:#fff;
    font-size: 10px;
    /* height: 24px; */
    line-height: 24px;
    text-align: center;
    letter-spacing: 1px;
    cursor: pointer; 
}
.el-aside .el-menu {
    border-right: none;
}
.el-aside .iconfont {
    margin-right: 10px;
}



.el-main {
    background-color: #eaedf1;
}

</style>