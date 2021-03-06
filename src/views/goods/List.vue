<!--
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-03-05 20:41:00
 * @LastEditors: mintZ
 * @LastEditTime: 2021-03-05 22:34:17
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear='getGoodList'
          >
          <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label='商品名称' prop="goods_name"></el-table-column>
        <el-table-column label='商品价格(元)' prop="goods_price" width="95px"></el-table-column>
        <el-table-column label='商品重量' prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label='创建时间' prop="add_time" width="140px">
          <template slot-scope="scope">
            <!-- 调用过滤器 -->
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="130px">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
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
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0,
    };
  },
  methods: {
    async getGoodList() {
      const { data } = await this.$http.get(
        'goods',
        { params: this.queryInfo },
      );
      if (data.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！');
      }
      this.$message.success('获取商品列表成功！');
      console.log(data.data);
      this.goodslist = data.data.goods;
      this.total = data.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodList();
    },
    async removeById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).catch((err) => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除！');
      }
      const { data } = await this.$http.delete(`goods/${id}`);
      if (data.meta.status !== 200) {
        return this.$message.error('删除失败！');
      }
      this.$message.success('删除成功！');
      this.getGoodList();
    },
    goAddPage() {
      this.$router.push('/goods/add');
    },
  },
  created() {
    this.getGoodList();
  },
};

</script>
<style lang='scss' scoped>
</style>
