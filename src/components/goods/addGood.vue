<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加商品卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 在tab区域外部包裹一层表单区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab区域 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 【基本信息】Tab中内容 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 只允许选择三级分类-->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 【商品参数】Tab中内容 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, index) in item.attr_vals"
                  :label="cb"
                  :key="index"
                  border
                  id="el-checkbox"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 【商品属性】Tab中内容 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 【商品图片】Tab中内容 -->
          <el-tab-pane label="商品图片" name="3">
            <!--action表示图片要上传到的后台api地址  -->
            <!-- headers表示为图片的请求加上请求头 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>

          <!-- 【商品内容】Tab中内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 【图片上传】tab区域 —— 图片预览效果对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <!-- 主体区域 -->
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from "loadsh"

export default {
  data() {
    return {
      // 步骤条活跃项，默认为第一个
      activeIndex: "0",
      //   添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 上传图片的数组
        pics: [],
        // 商品内容
        goods_introduce:'',
        attrs:[]
      },
      // 添加商品的表单数据验证规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      // 获取商品所有分类列表
      catelist: [],
      //   级联选择器的规则
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        //    hover时触发子菜单
        expandTrigger: "hover"
      },
      //    获取动态参数列表数据
      manyTableData: [],
      //    获取静态属性列表数据
      onlyTableData: [],
      //   上传图片的时候，因为没有用axios请求，所以需要自己手动在请求头添加Authorization：token；否则图片无法上传成功
      headerObj: {
        Authorization: sessionStorage.getItem("token")
      },
      // 获取预览图片的绝对地址
      previewPath: "",
      //   控制图片预览对话框的显示与隐藏
      previewVisible:false,
      
    };
  },
  computed: {
    //   三级分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        // goods_cat表示选中的一级、二级、三级分类的id的数组，我们只想获取三级分类id
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  created() {
    //   获取商品所有分类数据
    this.getCateList();
  },
  methods: {
    //   获取商品所有分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }

      this.catelist = res.data;
      //   console.log("所有商品分类", this.catelist);
    },
    // 级联选择器选中项变化，会触发该函数
    handleChange() {
      //    没有选中三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
      console.log(this.addForm.goods_cat);
    },
    // 阻止标签页的切换
    beforeTabLeave(activeName, oldActiveName) {
      //   console.log('即将进入的标签页:'+activeName);
      //   console.log('即将离开的标签页:'+oldActiveName);

      //当前tab页如果处于第一个，并且该页面未选择三级分类的话，不能切换到其他tab页
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    // tab被选中的时候，触发该函数
    async tabClicked() {
      // 当前被激活的tab页签序号
      // console.log(this.activeIndex);

      // 如果你当前点击的activeIndex值为'1'的话，表示
      // 你进入了【商品参数】tab  访问的是动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );

        if (res.meta.status !== 200) {
          this.$message.error("获取动态参数列表失败！");
        }
        // 把字符串转化成数组
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });

        this.manyTableData = res.data;
        console.log(res.data);
      }
      if (this.activeIndex === "2") {
        // 表示进入了【商品属性】tab内容

        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );

        if (res.meta.status !== 200) {
          this.$message.error("获取静态属性失败！");
        }

        this.onlyTableData = res.data;
        console.log(res.data);
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      //   console.log(file);
      // 1）获取图片的完整路径
      this.previewPath = file.response.data.url;
      //   2）展示图片预览对话框
      this.previewVisible = true
    },
    // 移除图片时，触发该函数
    handleRemove(file) {
      //    console.log(file);
      //    1）获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      //    2）从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);
      //    3）调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1);

      // 测试代码
      // console.log(this.addForm);
    },
    // 只要图片上传成功，就会回调该函数
    handleSuccess(response, file, fileList) {
      // 获得服务器返回的响应对象
      //   console.log(response)
      //    1）拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //    2）将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    // 添加商品
     add(){
    //    console.log(this.addForm)

    // 对表单进行预校验
      this.$refs.addFormRef.validate(async valid => {
          if(!valid){
              return this.$message.error('请填写必要的表单项！')
          }

        //   执行必要的业务逻辑
        // 把数组转换成字符串，以“，”分割

        // 注意！！！ 不要直接赋值，因为这改变了数组的类型，会影响element组件中用到的地方（因为使用的时候用的是数组的形式 结果你现在将数组转成字符串类型，会报错！！！
        // 所以，进行深拷贝
        const form = _.cloneDeep(this.addForm)
        // console.log(form);
        form.goods_cat = form.goods_cat.join(',')
        // console.log(form);

        // 处理动态参数和静态属性
        this.manyTableData.forEach(item => {
            const newInfo = {
                attr_id:item.attr_id,
                attr_value:item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
        })
         this.onlyTableData.forEach(item => {
            const newInfo = {
                attr_id:item.attr_id,
                attr_value:item.attr_vals
            }           
            this.addForm.attrs.push(newInfo)
        })
        
        form.attrs = this.addForm.attrs
        console.log(form)



        // 进行请求
      const {data:res} =  await this.$http.post('goods',form)
      
      if(res.meta.status !== 201){
          return this.$message.error('添加商品失败！')
      }

      this.$message.success('添加商品成功！')
      this.$router.push('/goods')
      
      })
    }
  }
};
</script>

<style scoped>
#el-checkbox {
  margin: 0 8px 0 0 !important;
}

.previewImg {
    width: 100%;
    height: 100%;
}

.addBtn {
    margin-top: 15px;
}
</style>
