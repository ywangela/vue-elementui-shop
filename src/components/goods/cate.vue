<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加分类区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable"
      >
        <!-- 是否有效列 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:green"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="warning"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="success" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"  
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" >
            <!-- 级联选择器 -->
            <!-- options:用来指定数据源 -->
            <!-- props:用来指定配置对象 -->
             <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChanged"
                clearable>
             </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类的数据
      cateList: [],
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          //  表示将当前列定义为模板列
          type: "template",
          //   表示当前这一列使用模板名称 作用域插槽为isok
          template: "isok"
        },
        {
          label: "排序",
          //  表示将当前列定义为模板列
          type: "template",
          //   表示当前这一列使用模板名称 作用域插槽为isok
          template: "order"
        },
        {
          label: "操作",
          //  表示将当前列定义为模板列
          type: "template",
          //   表示当前这一列使用模板名称 作用域插槽为isok
          template: "opt"
        }
      ],
      //   控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
    //   添加分类表单数据对象
      addCateForm:{
        // 将要添加的分类的名称
         cat_name:'',
        //  父级分类的id
         cat_pid:0,
        //  分类的登记，默认要添加的是1级分类
         cat_level:0
      },
    //   添加分类表单数据验证规则
      addCateFormRules:{
          cat_name:[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ]
      },
        // 父级分类的列表
        parentCateList:[],
        // 指定级联选择器的配置对象
        cascaderProps:{
          expandTrigger: 'hover' ,
          value:'cat_id',
          label:'cat_name',
          children:'children',
          checkStrictly:true
        },
        // 选中的父级分类的id数组
        selectedKeys:[]
    }
  },
  created() {
    //   获取所有的商品分类数据
    this.getCateList();
  },
  methods: {
    //   获取所有的商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      //    console.log(res)
      if (res.meta.status !== 200) this.$message.error("获取商品分类失败！");
      this.cateList = res.data;
    //   console.log(this.cateList);
    },
    // 点击【点击分类】按钮，弹出对应的对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true;
     
    },
    // 获取父级分类的数据列表
   async getParentCateList(){
     const {data:res} = await  this.$http.get('categories',{
            params:{type:2}
        })
        if(res.meta.status !== 200) this.$message.error('获取父级分类数据失败！')

        // console.log(res.data)
        this.parentCateList = res.data
    },
    // 级联选择器中的选择项发生变化时，触发该函数
    parentCateChanged(){
        // console.log(this.selectedKeys)
        // 如果selectedKeys数组中的length大于0，说明了选中的父级分类
        // 反之，就说明没有选中任何父级分类 此时默认是一级分类

        // 选择selectedKeys的最后一项作为新加分类的父级分类
        if(this.selectedKeys.length > 0){
            // 父级分类的id
           this.addCateForm.cat_pid  =  this.selectedKeys[this.selectedKeys.length-1]
            // 为当前分类的等级赋值
           this.addCateForm.cat_level = this.selectedKeys.length
           return 
        }else {
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        }

       
    },
    // 测试代码，查看在级联选择中选择选项后，值的变化是否正确
    addCate(){
        // console.log(this.addCateForm)
        // 表单预验证
        this.$refs.addCateFormRef.validate(async valid => {
          if(!valid) return
          const {data:res} = await this.$http.post('categories',this.addCateForm)
          
        //   console.log(res.meta.status)
          if(res.meta.status !== 201) {
              this.$message.error('添加分类失败！')
          }

          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDialogVisible = false
      
      })
    },
    // 关闭添加分类对话框，数据清除
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
};
</script>

<style scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
    width: 100%;
}
</style>
