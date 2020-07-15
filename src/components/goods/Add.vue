<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片试图-->
    <el-card>
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>
      <!--步骤条区域-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--tab栏区域-->
      <!--el-tabs只能拥有el-tab-pane-->
      <el-form :model="addForm" :rules="addFromRules" ref="addFormRef"
                label-width="100px" label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabsLeave"
          @tab-click="tabsClick"
        >
          <!--为before-leave绑定到activeName和oldActiveName-->
          <el-tab-pane label="基本信息aaa" name="0">
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
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :props="cateProps"
                :options="catelist"
                @change="handleChanged"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--渲染表单的item项-->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb, i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--action 表示图片上传到的后台Api地址,要进行动态绑定：action才能在data里面自定义-->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器-->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--图片预览-->
    <el-dialog title="图片预览" :visible.sync="PathDialogVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: "Add",
  data() {
    return {
      activeIndex: "0",
      // 这是添加商品的表单对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      // 表单的验证规则对象
      addFromRules: {
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
      // 商品参数列表
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 这是动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的api地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件的headers请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      // 控制图片预览的显示与隐藏
      PathDialogVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  methods: {
    async getCateList() {
      // 获取所以商品参数列表
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }

      this.catelist = res.data;
      console.log(this.catelist);
    },
    // 级联选择器的选中项变化触发这个函数 判断数组的操作
    // 级联选择器的选择的范围控制
    handleChanged() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabsLeave(activeName, oldActiveName) {
      // activeName  即将进入标签的名字 oldActiveName是即将离开标签的名字
      // oldActiveName 等于0 或 this.addFrom.goods_cat的数组长度不等于3 则直接返回错误
      // 如果等于3 不做任何处理，不等于3就禁止返回
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    async tabsClick() {
      // console.log(this.activeIndex)
      // 证明访问的是动态参数面板
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
          return this.$message.error("访问参数面板失败");
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
        console.log(res.data);
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败");
        }
        this.onlyTableData = res.data;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.PathDialogVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // console.log(file)
      // 1.获取将要删除的临时图片路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);
      // 3.调用数组的splice方法，把图片信息对象从pics数组中排除
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      //  1.先拼接，得到一个图片信息对象
      const picsInfo = { pic: response.data.tmp_path };
      //  2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picsInfo);
      console.log(this.addForm);
    },
    // 添加商品的点击事件
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的业务逻辑
        // lodash cloneDeep()
        // 将数组变成字符串，重新定义一个from 来接收新的深拷贝this.addFrom
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 1.处理动态参数
        this.manyTableData.forEach(item  => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 2.处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 最终提交的是from不是addfrom
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起请求添加商品
        const {data:res} = await this.$http.post('goods', form)
        console.log({data:res})
        if(res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
       // 商品名称必须唯一
      })
    }
  }
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 10px 0 10px 0;
}
.el-checkbox {
  margin: 0 5px 0 0;
}
.previewImg {
  width: 100% ;
}
.btnAdd {
  margin-top: 20px;
}
</style>
