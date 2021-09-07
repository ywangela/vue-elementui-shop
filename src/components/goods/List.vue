<template>
    <div>
         <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品列表表格区域 -->
      <el-table :data="goodslist" border stripe >
          <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="90px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="200px">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" >
            <!-- 用作用域插槽接收这行的数据 -->
            <template slot-scope="scope">
              <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini" >
              </el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)">
              </el-button>
            </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5,10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>

    </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            // 商品列表
            goodslist:[],
            // 商品总数
            total:0
        }
    },
    created () {
        // 获取所有的商品列表数据
        this.getGoodsList()
    },
    methods: {
        // 根据分页获取的商品列表数据
      async  getGoodsList(){
          const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status !== 200) this.$message.error('获取商品列表失败！')
             this.$message.success('获取商品列表成功！')
             console.log(res.data);
             this.goodslist = res.data.goods
             this.total = res.data.total
       
       },
    //   只要分页发生变化，就会触发该函数
    handleSizeChange(newSize){
       this.queryInfo.pagesize = newSize
       this.getGoodsList()
       console.log(newSize);
    },
    // 只要每页的数量发生变化，就会触发该函数（表格数据随之变化）
      handleCurrentChange(newPage){
         this.queryInfo.pagenum = newPage
         this.getGoodsList()
      },
    //  根据商品id删除该商品 
   async removeById(goods_id){
     const confirmRes =   await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmRes !== 'confirm'){
            return this.$message.info('已取消了删除！')
        }
        //  确认了删除
       const {data:res} =await this.$http.delete(`goods/${goods_id}`)
       if(res.meta.status !== 200) {
           this.$message.error('删除商品失败！')
       }

       this.$message.success('删除商品成功！')
       this.getGoodsList()


    },
    // 点击【添加商品】按钮，跳转到【添加商品】页面
    goAddPage(){
        this.$router.push('/goods/add')
    }
        
    }
}
</script>

<style scoped>
.box-card {
    margin-top: 15px;
}

.el-table {
    margin-top: 15px;
}
</style>