<!--
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-03-03 21:54:05
 * @LastEditors: mintZ
 * @LastEditTime: 2021-03-04 16:48:37
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type='primary' @click="showAddCateDialog">添加分类</el-button>
       <!-- 表格 -->
      <tree-table
      :data='cateList'
      :columns='columns'
      :selection-type='false'
      :expand-type='false'
      show-index
      index-text='#'
      border
      :show-row-hover='false'
      style="margin-top:15px;"
      >
        <template slot-scope="scope" slot="isok">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size='mini' v-if='scope.row.cat_level === 0'>一级</el-tag>
          <el-tag size='mini' type='success' v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size='mini' type='danger' v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type='primary' icon='el-icon-edit' size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size='mini'>删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
    title="提示"
    :visible.sync="addCateDialogVisible"
    width="40%"
    @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
      ref="addCateFormRef"
      :model="addCateForm"
      :rules="addCateFormRules"
      label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" prop="cat_name">
          <el-cascader
          v-model="selectedKeys"
          :options="parentCateList"
          :props="cascaderProps"
          @change="parentCateChanged"
          style='width:100%;'
          clearable
          change-on-select
          ref='cascader'
          show-all-levels>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 总数据
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok',
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order',
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt',
        },
      ],
      addCateDialogVisible: false,
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true,
      },
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  watch: {
    selectedKeys() {
      if (this.$refs.cascader) {
        this.$refs.cascader.dropDownVisible = false;
      }
    },
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get('categories', { params: this.queryInfo });
      if (data.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！');
      }
      console.log(data.data);
      // 把数据列表，赋值给cateList
      this.cateList = data.data.result;
      // 为总数据条数
      this.total = data.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    async showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      const { data } = await this.$http.get('categories', { params: { type: 2 } });
      if (data.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！');
      }
      console.log(data.data);
      this.parentCateList = data.data;
    },
    parentCateChanged() {
      // 选择项发生变化
      console.log(this.selectedKeys);
      // 如果selectedKeys数组的length大于0，证明选中的各父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0;
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data } = await this.$http.post('categories', this.addCateForm);
        if (data.meta.status !== 201) {
          return this.$message.error('添加分类失败！');
        }
        this.$message.success('添加分类成功！');
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
  },
};

</script>
<style lang='scss' scoped>
</style>
