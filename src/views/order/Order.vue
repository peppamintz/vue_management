<!--
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-03-07 09:23:19
 * @LastEditors: mintZ
 * @LastEditTime: 2021-03-07 14:50:09
-->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>

        <!-- 订单列表数据 -->
        <el-table :data="orderlist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status">
            <template slot-scope='scope'>
              <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send">
            <template slot-scope="scope">
              <template>
                {{scope.row.is_send}}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template slot-scope="scope">
              {{scope.row.create_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="addressVisible = true"></el-button>
              <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
      </el-pagination>
    </el-card>
    <el-dialog
    title="修改地址"
    :visible.sync="addressVisible"
    width="50%"
    @close="addressDialogClosed"
    >
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
          size="large"
          :options="options"
          v-model="addressForm.address1"
          :props="{ expandTrigger: 'hover' }"
          style="width:100%"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog
    title="物流进展"
    :visible.sync="progressVisible"
    width="50%"
    :before-close="handleClose">
      <el-timeline>
        <el-timeline-item
        v-for="(activity, index) in progressInfo"
        :key="index"
        :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data';

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: '0',
      orderlist: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      options: regionData,
      progressInfo: [
        {
          context: '活动按期开始',
          time: '2018-04-15',
        },
        {
          context: '通过审核',
          time: '2018-04-13',
        },
        {
          context: '创建成功',
          time: '2018-04-11',
        },
      ],
      progressVisible: false,
    };
  },
  methods: {
    async getOrderList() {
      let { data } = await this.$http.get(
        'orders',
        { params: this.queryInfo },
      );
      if (data.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！');
      }
      console.log(data);
      this.total = data.data.total;
      this.orderlist = data.data.goods;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getOrderList();
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    showProgressBox() {
      this.progressVisible = true;
    },
  },
  created() {
    this.getOrderList();
  },
};

</script>
<style lang='scss' scoped>
</style>
