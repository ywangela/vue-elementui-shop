<template>
    <div>
       <!-- 面包屑导航区域 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
       <!-- 卡片视图区域 -->
        <el-card class="box-card">
          <!-- 搜索与添加区域 -->
          <el-row :gutter="20">
              <el-col :span="8">
                      <el-input placeholder="请输入内容" v-model="queryInfo.query" 
                      clearable @clear="getUserList">
                         <el-button slot="append" icon="el-icon-search"
                         @click="getUserList()"></el-button>
                      </el-input>
              </el-col>
              <el-col :span="4">
                      <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
              </el-col>
          </el-row>

         <!-- 添加用户弹出框 -->
         <el-dialog
           title="添加用户"
           :visible.sync="addDialogVisible"
           width="50%"
           @close="addDialogClosed">
           <!-- 内容主体区域 -->
          <el-form :model="newUser" :rules="rules" ref="addFormRef" label-width="70px" >
           <el-form-item label="用户名" prop="username">
             <el-input v-model="newUser.username"></el-input>
           </el-form-item>
           <el-form-item label="密码" prop="password" type="password">
             <el-input v-model="newUser.password"></el-input>
           </el-form-item>
           <el-form-item label="邮箱" prop="email">
             <el-input v-model="newUser.email"></el-input>
           </el-form-item>
           <el-form-item label="手机" prop="mobile">
             <el-input v-model="newUser.mobile"></el-input>
           </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNewUser()" >确 定</el-button>
         </span>
        </el-dialog>
 

          <!-- 用户列表区域 -->
          <el-table :data="userList" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="姓名" prop="username"></el-table-column>
              <el-table-column label="邮箱" prop="email"></el-table-column>
              <el-table-column label="电话" prop="mobile"></el-table-column>
              <el-table-column label="角色" prop="role_name"></el-table-column>
              <el-table-column label="状态" >
                  <template slot-scope="scope">
                    <!-- {{scope.row}} -->
                    <!-- 将开关是否开启与mg_state做双向数据绑定，互相改变值 -->
                    <el-switch v-model="scope.row.mg_state"
                     @change="userStateChanged(scope.row)">
                     </el-switch>
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="180px">
                   <template slot-scope="scope">
                       <!-- 修改按钮 -->
                       <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                       <!-- 删除按钮 -->
                       <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                       <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                   </template>
              </el-table-column>  
          </el-table>

          <!-- 分页区域 -->
           <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="queryInfo.pagenum"
             :page-sizes="[1, 2, 5, 10]"
             :page-size="queryInfo.pagesize"
             layout="total, sizes, prev, pager, next, jumper"
             :total="total">
           </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // 获取用户列表的参数对象
            queryInfo:{
                query:'',
                // 当前的页数
                pagenum:1,
                // 当前每页显示多少条数据
                pagesize:2
            },
            userList:[],
            // 总数据
            total:0,
            // 添加用户对话框是否显示，默认隐藏
            addDialogVisible:false,
            // 添加用户的表单数据
            newUser:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            // 添加用户对话框汇中的表单验证规则
            rules: {
              username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
              ],
              password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
              ],
              email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
              ],
              mobile: [
                { required: true, message: '请输入手机', trigger: 'blur' },
              ],
            }
        }
    },
    created () {
        this.getUserList()
        
    },
    methods: {
        // 获得用户列表数据
       async getUserList(){
          const res = await this.$http.get('users',{params:this.queryInfo})
          const finalRes = res.data
        //   console.log(finalRes)
          if(finalRes.meta.status !== 200) this.$message.error('获取用户列表失败！')
          this.userList = finalRes.data.users
          this.total = finalRes.data.total
     
     },
    //  监听switch开关状态的改变
      async userStateChanged(userinfo){
    //    console.log(userinfo)
    // 路径是动态的，所以可用模板字符串（即反引号），且可进行变量拼接
      // 把状态同步到服务器中 通过put请求方式修改服务器中的数据！！！
        const re = await this.$http.put(`users/${userinfo.id}/state/${userinfo.ms_state}`)
        const res = re.data
        console.log(res);
        if(res.meta.status !== 200) {
            userinfo.ms_state = !userinfo.ms_state // 把状态同步到服务器中
            this.$message.error('更新用户状态失败')
        }
        this.$message.success('更新用户状态成功！')
    },
    //  监听pagesize改变的事件,pagesize改变的时候，上面的表格中的数据也会随之变化
      handleSizeChange(newSize){
        //   console.log("pagesize:"+newSize)
          this.queryInfo.pagesize = newSize
          this.getUserList() // pagesize改变，重新请求数据 ！！！
      },
    //  监听页码值改变的事件,pagenum改变的时候，上面的表格中的数据也会随之变化
      handleCurrentChange(newPage){
        //   console.log("pagenum:"+newPage)
          this.queryInfo.pagenum = newPage
          this.getUserList() // pagesize改变，重新请求数据 ！！！
      },
    //   在添加用户弹框中点击【添加】按钮，加入到数据中
       addNewUser(){
        // 在增加表单之前，先进行表单的预验证，只要表单数据填写正确，才可以发送数据给到服务器
      this.$refs.addFormRef.validate(valid => {
        // console.log(valid)
        if(!valid) return
        // 否则就是预校验成功，可以发起添加用户的网络请求
          // const re =await this.$http.post('users',{params:this.newUser})
          // const res = re.data
          // console.log(res);
      })
      

    },
    // 关闭添加用户对话框的时候，清除之前填的数据（防止再次点击【添加用户按钮】时，弹框中
    // 还有上一次的数据
    addDialogClosed(){
      // 通过ref拿到表单的引用，然后调用表单的resetFields()方法来重置表单
        this.$refs.addFormRef.resetFields()
    }

    }
    
}
</script>

<style scoped>
.el-card {
    box-shadow: 0 1px 1px rgba(0,0,0, .5) ;
}

.el-table {
    margin-top: 15px;
    font-size: 12px;
}

.el-pagination {
    margin-top: 10px;
}
</style>