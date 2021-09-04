<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
           <img  src="@/assets/img/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form :model="loginForm" :rules="loginFormRules" label-width="0px" 
      class="form-box" ref="loginFormRef">
        <!-- 用户名 -->
        <!-- 通过prop属性指定验证规则 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" 
                    placeholder="请输入用户名"
                    prefix-icon="iconfont icon-user">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item  prop="password">
          <el-input  v-model="loginForm.password"
                     placeholder="请输入密码"
                     prefix-icon="iconfont icon-3702mima"
                     type="password">
           </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns" >
           <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>  
</template>

<script>
export default {
    data(){
      return {
        // 这是登录表单的数据绑定对象
        loginForm:{
          username:'admin',
          password:'123456'
        },
        // 这是表单的验证规则对象
        loginFormRules:{
          // 验证用户名是否合法
          username:[
            // 必填项，当元素失焦时，出现提示信息
             { required: true, message: '请输入用户名', trigger: 'blur' },
            //  定义用户名的长度
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          // 验证密码是否合法
          password:[
             { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      // 点击【重置】按钮，重置登录表单
      resetLoginForm(){
        // console.log(this);
        this.$refs.loginFormRef.resetFields();
      },
      login(){
        this.$refs.loginFormRef.validate(async valid => {
          // console.log(valid);

          // 根据预验证的结果来决定是否发起请求
          // 预验证失败
          if(!valid) return;
          // 预验证成功 发起请求
          // 调用post方法，就会请求login地址，且携带一些参数
          // 将data中的loginForm对象（包含用户名和密码）作为参数传递
          // 返回的结果，即result是一个promise
         const result = await this.$http.post("login",this.loginForm);
         const data= result.data
         console.log(data.meta.status);
         if(data.meta.status !== 200) {
            //  console.log(this.$message);
            this.$message.error('登录失败！')
         }
            // console.log('登录成功！')
            this.$message.success('登录成功！')
            // 1)将登录成功之后的token，保存到客户端的sessionStorage中
            //    a.项目中除了登录之外的其他api接口，必须在登录之后才能访问；
            //    b.token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
                //  console.log(data);
                 sessionStorage.setItem('token',data.data.token)

            // 2) 通过编程式导航跳转到后台主页，路由地址是/home
                this.$router.push('/home');

        })
      }
    }
}
</script>

<style scoped>
  .login-container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login-box {
    width: 400px;
    height: 350px;
    background-color: #fff;
    border-radius: 12px;
    /* box-shadow: 1px 1px rgba(100, 100, 100, .5); */

    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }

 /* 头像区域 */
  .avatar-box{
     width: 130px;
     height: 130px;
     padding: 10px;
     background-color: white;
     border: 1px solid #eee;
     border-radius: 50%;
     /* box-shadow: 0 0 10px #ddd; */

     position: absolute;
     left: 50%;
     transform: translate(-50%,-50%);
  }
  .avatar-box img {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: #eee;
  }

  /* 表单区域 */
  .form-box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

</style>