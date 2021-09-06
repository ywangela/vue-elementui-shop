<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!--选择商品分类区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器区域 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 【添加参数】的按钮 -->
          <el-button type="primary" :disabled="isBtnDisable"
            @click="addAttrDialogVisible = true">添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe class="attrTable">
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                   <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index"
                   closable>
                       {{item}}
                   </el-tag>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                 @click="showEditDialog(scope.row.attr_id)" >修改</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                 @click="removeParams(scope.row.attr_id)" >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 【添加属性】的按钮 -->
          <el-button type="primary" :disabled="isBtnDisable"
           @click="addAttrDialogVisible = true" >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe class="attrTable">
            <!-- 展开列 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  @click="showEditDialog(scope.row.attr_id)">修改</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  @click="removeParams(scope.row.attr_id)">删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addAttrDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
    <!-- 添加参数的表单区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>



    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editAttrDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
    <!-- 修改参数的表单区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有商品分类列表
      catelist: [],
      //   级联选择框的配置对象
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //   级联选择框双向绑定的数据
      selectedCateKeys: [],
      //   tab页签区域  被激活的tab页签的名称
      activeName: "many",
      //   动态参数的数据
      manyTableData: [],
      //   静态属性的数据
      onlyTableData: [],
      //   控制添加动态参数or静态属性的对话框的显示与隐藏
      addAttrDialogVisible:false,
      //   添加参数的表单数据对象
      addForm:{
          attr_name:'',
      },
      // 添加表单的验证规则对象
      addFormRules:{
          attr_name:[
              { required: true, message: '请输入参数名称', trigger: 'blur' }
          ]
      },
    //  控制修改对话框的显示与隐藏
       editAttrDialogVisible:false,
    // 修改参数的表单数据对象
      editForm:{
        attr_name:'',
      }, 
    //   修改参数的表单数据验证规则
    editFormRules:{
         attr_name:[
              { required: true, message: '请输入参数名称', trigger: 'blur' }
          ]
    } 
    };
  },
  computed: {
    //   如果按钮需要被禁用，则返回true；否则返回false
    // 如果在级联选择器中选择了三级分类，则按钮可用；否则按钮禁用
    isBtnDisable() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态参数/静态属性计算标题的文本
    titleText(){
        if(this.activeName === 'many'){
            return '动态参数'
        }
        return '静态属性'
    }
  },
  created() {
    // 获取所有商品分类列表数据
    this.getCateList();
  },
  methods: {
    // 获取所有商品分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      // console.log(res)

      if (res.meta.status !== 200) this.$message.error("获取商品分类失败！");
      this.catelist = res.data;
      //   console.log(this.catelist);
    },
    // 级联选择框中选择项变化时，调用该函数
    async handleChange() {
      this.getParamsData();
    },
    // tab点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    // 级联选择框选择三级分类，或者tab切换，都会触发该函数，获取对应的参数数据
    async getParamsData() {
      //   console.log(this.selectedCateKeys);
      // 说明选中的是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }

      // 说明选中的是三级分类
      //   console.log(this.selectedCateKeys);
      //   根据所选分类的id，和当前所处的面板（当前所处的tab页签），获取所有的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );

      if (res.meta.status !== 200) this.$message.error("获取参数列表失败！");
    //   console.log(res.data);


    // 把动态参数下的选项对象转换成数组形式
    res.data.forEach(item => {
        item.attr_vals =item.attr_vals ? item.attr_vals.split(' ') : []
    })
    console.log(res.data);

      //   判断获取到的是动态参数中的数据，还是静态属性中的数据
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 监听添加参数对话框的关闭  数据清除
    addDialogClosed(){
        this.$refs.addFormRef.resetFields()
    },
    // 点击【确定】，添加参数
    addParams(){
    //   表单数据的预验证
      this.$refs.addFormRef.validate(async valid => {
          if(!valid) return
        const {data:res} =await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name:this.addForm.attr_name,
            attr_sel:this.activeName
          })
        //   console.log(res);
        if(res.meta.status !== 201) this.$message.error('添加'+this.titleText+'失败！')

        // 添加参数成功
        this.$message.success('添加'+this.titleText+'成功！')
        this.getParamsData()
        this.addAttrDialogVisible = false
          
      })
    },
    // 点击按钮，展示修改对话框
   async showEditDialog(attr_id){

    const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
        params:{
            attr_sel:this.activeName
        }
      })

      if(res.meta.status !== 200){
          this.$message.error('获取参数信息失败！')
      }

      this.editForm = res.data





      this.editAttrDialogVisible = true
    },
    // 关闭修改属性对话框  表单数据重置
    editDialogClosed(){
       this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数
    editParams(){
      this.$refs.editFormRef.validate(async valid => {
          if(!valid) return 
           const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
            attr_name:this.editForm.attr_name,
            attr_sel:this.activeName
      })
        // console.log(res)
        // console.log(this.activeName);
        // console.log(this.editForm.attr_id)
      if(res.meta.status !== 200){
          this.$message.error('修改参数失败！')
      }

      this.$message.success('修改参数成功！')
      this.getParamsData()
      this.editAttrDialogVisible = false

      })
    },
    // 根据id删除对应的参数项
   async removeParams(attr_id){
        // 是否确认删除
    const confirmRes = await  this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        
        // 若用户取消了删除的操作
        if(confirmRes !== 'confirm'){
            return this.$message.info('已取消删除！')
        }

        // 用户确认删除
      const {data:res} = await  this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)

      if(res.meta.status !== 200) this.$message.error('删除参数失败！')

      this.$message.success('删除参数成功！')
      this.getParamsData()

    }

  }
};
</script>

<style scoped>
.cat-opt {
  margin-top: 10px;
}

.attrTable {
  margin-top: 15px;
}
</style>
