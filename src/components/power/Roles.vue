<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区域 -->
        <el-row style="margin-bottom:15px">
            <el-col>
                <el-button type="primary">添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 角色列表区域 -->
        <el-table :data="rolelist" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand" >
              <template slot-scope="scope">
                <!-- <pre>{{scope.row}}</pre> -->
                 <el-row v-for="(item1,index1) in scope.row.children" 
                         :key="item1.id"
                          :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter'] " 
                          style="margin:0 50px;" >
                    <!-- 渲染一级权限 -->
                    <el-col :span="5" >
                        <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染二级权限和三级权限 -->
                    <el-col :span="19">
                      <!-- 通过for循环来嵌套渲染二级权限 -->
                      <el-row v-for="(item2,index2) in item1.children" :key="item2.id"
                            :class="[ index2 === 0 ? '' : 'bdtop','vcenter'] " >
                          <el-col :span="6">
                              <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!-- 三级权限 -->
                          <el-col :span="18">
                              <el-tag type="warning" v-for="item3 in item2.children"
                              :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                                  {{item3.authName}}
                             </el-tag>
                          </el-col>
                      </el-row>
                    </el-col>
                </el-row>
              </template>
          </el-table-column> 
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" >
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="showEditDialog(scope.row)">编辑</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="removeUserById(scope.row.id)">删除</el-button>
                <!-- 分配角色按钮 -->
                    <el-button type="warning" icon="el-icon-setting" size="mini"
                    @click="showSetRightDialog(scope.row)">分配权限</el-button>
              </template>
          </el-table-column>
        </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="30%" @close="setRightDialogClosed">
        <!-- 权限的树形控件 -->
        <el-tree :data="rightsList" 
                 :props="treeProps" 
                 show-checkbox
                 node-key="id" 
                 default-expand-all 
                 :default-checked-keys="defkeys"
                  ref="treeRef">
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
   </el-dialog>


    </div>
</template>

<script>
export default {
    data () {
        return {
            // 所有角色列表数据
            rolelist:[],
            // 控制分配权限的对话框是否显示  默认隐藏
            setRightDialogVisible:false,
            // 所有权限数据
            rightsList:[],
            // 树形控件的属性绑定对象
            treeProps:{
                children:'children',  /* 父子嵌套是用children标识的 */
                label:'authName'
            },
            // 树形控件中 默认选中的节点id值数组
            defkeys:[],
            // 当前即将分配权限的角色id
            roleId:''
        }
    },
    created () {
        // 获取所有角色列表
        this.getRolesList()
    },
    methods: {
        // 获取所有角色列表
      async getRolesList(){
          const {data:res} =  await this.$http.get('roles')
        //   console.log(res)
        if(res.meta.status !== 200) this.$message.error('获取角色列表失败！')

        this.rolelist = res.data
        // console.log(this.rolelist)
        },
        // 根据id删除对应的权限
      async removeRightById(role,rightid){
        // 弹框提示用户是否要删除
      const confirmRes =  await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmRes !== 'confirm') this.$message.info('取消了删除')
        // 用户想删除该权限
        // 删除服务器中的权限 发起删除请求
          const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
        //   console.log(res)
        if(res.meta.status !== 200) return this.$message.error('删除权限失败！')
        // 3）刷新数据 不建议这样刷新数据，因为会造成组件(整个列表的刷新)的完全渲染，导致删除之后，
        // 权限区域就被合上了，体验不好
        //   this.getRolesList()
        //  推荐做法 ！！！ 赋值
        // console.log(res)
        role.children = res.data
      },
    //   显示分配权限对话框
     async showSetRightDialog(role){
         this.roleId = role.id
        // 获取所有权限的数据
        const {data:res} = await this.$http.get('rights/tree')
        // console.log(res)
        if(res.meta.status !== 200) this.$message.error('获取权限数据失败！')

        // 把获取到的权限数据保存到data中的rightsList中
        this.rightsList = res.data
        // console.log(this.rightsList)
        
        //  递归获取所有三级节点的id
        this.getLeafKeys(role,this.defkeys)

        // 点击【分配权限】按钮时，对应的弹框要跳出
        this.setRightDialogVisible = true
      },
    //   通过递归，获取角色下所有三级权限的id，并保存到defKeys数组中
      getLeafKeys(node,arr){
        //   如果当前node节点不包含children属性，则是三级节点
        if(!node.children){
            return arr.push(node.id)
        }

        node.children.forEach(item => {
            this.getLeafKeys(item,arr)
        })
      },
    //   监听分配权限对话框中的关闭事件
    setRightDialogClosed(){
        this.defkeys = []
    },
    // 为角色分配权限
    async allotRights(){
        const keys = [
            ...this.$refs.treeRef.
            getCheckedKeys(),
            ...this.$refs.treeRef.
            getHalfCheckedKeys(),
        ]
        // console.log(keys)

        const idStr = keys.join(',')
        const {data:res} = await  this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        // console.log(res)

        if(res.meta.status !== 200) this.$message.error('分配权限失败！')
        this.$message.success('分配权限成功！')
        this.getRolesList()
        this.setRightDialogVisible = false
    }
    }
}
</script>

<style scoped>
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>