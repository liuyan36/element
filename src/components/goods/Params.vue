<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--警告提示栏-->
      <el-alert title="警告提示的文案" type="warning" show-icon :closable="false"></el-alert>
      <!--级联选择框-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!--选择商品分类的联级选择框-->
          <el-cascader
            expand-trigger="hover"
            v-model="selectCateList"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!--tab页签区-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <!--添加动态参数的按钮-->
          <!--通过计算属性声明isBtnDialog属性返回的布尔值来控制按钮的启动和关闭-->
          <el-button type="primary" :disabled="isBtnDialog" @click="addParams">添加参数</el-button>
          <!--动态参数的数据源-->
          <el-table :data="manyTableData" border stript>
            <!--展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--循环渲染tag标签-->
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                        @close="handleClose(index, scope.row)">{{item}}</el-tag>
                <!--输入文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!--添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteDialog(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <!--添加静态属性的按钮-->
          <el-button type="primary" :disabled="isBtnDialog" @click="addDialogVisible = true">添加属性</el-button>
          <!--静态属性的数据源和表格-->
          <el-table :data="onlyTableData" border stript>
            <!--展开行-->
                        <el-table-column type="expand">
              <template slot-scope="scope">
                <!--循环渲染tag标签-->
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                        @close="handleClose(index, scope.row)">{{item}}</el-tag>
                <!--输入文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!--添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteDialog(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数的对话框-->
    <params-add v-if="paramAdd" ref="AddParams" @refreshDataList="getCateList"></params-add>
     <!--修改参数的对话框-->
    <el-dialog
      :title="'修改' + titleText "
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogColsed"
    >
      <!--添加参数对话框-->
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import paramsAdd from './Params/params-add'

export default {
  name: "params",
  components: {
    paramsAdd
  },
  data() {
    return {
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 级联选择框双向绑定到的数组
      selectCateList: [],
      // 这是被激活的页签名称
      activeName: "many",
      // 这是动态参数的数据
      manyTableData: [],
      // 这是静态属性的数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      paramAdd: false,
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的表单数据对象
      editFrom: {},
      // 修改表单的规则对象
      editFromRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 如果按钮需要被禁用，则返回true否则false
    isBtnDialog() {
      // 拿到级联选择框中数组长度来判断
      if (this.selectCateList.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    // 分类id的获取方法
    cateId() {
      if (this.selectCateList.length === 3) {
        return this.selectCateList[2];
      }
      return null;
    },
    // 计算当前文本标题
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cateList = res.data;
      console.log(this.cateList);
    },
    // 级联选择框选中项变化的函数
    handleChange() {
      this.getParamsData();
    },
    // tabs页签点击的处理函数
    handleTabClick() {
      this.getParamsData();
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 证明选择的不是三级分类
      if (this.selectCateList.length !== 3) {
        // 当选择的不是第三级分类的时候清空表格内部的数据
        this.selectCateList = []
        this.manyTableData = []
        this.onlyTableData = []
        return;
      }
      // 根据所选的id获取索取面板获取对象参数
      // 无论是获取面板还是参数都会重新打印然后获取出来
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 每次循环的文本框输入的值
        item.inputValue = ''
      });
      console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 点击按钮展示修改对话框
    async showEditDialog(cateList) {
      console.log(cateList)
      this.paramShow = true
      this.$nextTick(() => {
        this.$refs.showParams.selectCateList = this.selectCateList
        this.$refs.showParams.attr_id = cateList.attr_id
        this.$refs.showParams.init()
      })
      },
     async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          parasm: { attr_sel: this.activeName }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败");
      }
      this.editFrom = res.data;

      this.editDialogVisible = true;
    },
    // 重置修改的表单操作
    editDialogColsed() {
      this.$refs.editFromRef.resetFields();
    },
    // 点击按钮修改操作
    editParams() {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return;

        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败");
        }
        this.$message.success("修改成功");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // 删除操作
    async deleteDialog(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // console.log(confirmResilt)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("你已经取消删除！");
      }

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      console.log({ data: res });
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getParamsData();
    },
    // 文本框失去焦点或按下enter都会触发效果
    async handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return  证明输入的内容做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 需要发起请求保存这次操作，提交到服务器保存
      this.attrActiveLisr(row)
    },
    // 将对attr_vals的操作保存到数据库
    async attrActiveLisr(row) {
      const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })

      // 开始进行判断 保存是否成功
      if(res.meta.status !== 200) {
        return this.$message.error('请求参数失败')
      }
      this.$message.success('请求参数成功')
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法作用，当页面元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 删除对应的参数可选性
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.attrActiveLisr(row)
    },
    addParams() {
      this.paramAdd = true
      this.$nextTick(() => {
        this.$refs.AddParams.selectCateList = this.selectCateList
        this.$refs.AddParams.init()
      })
    }
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
