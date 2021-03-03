<!--
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-02-23 14:46:00
 * @LastEditors: mintZ
 * @LastEditTime: 2021-03-03 21:35:34
-->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- <div v-for="o in 4" :key="o" class="text item">
      {{'列表内容 ' + o }}
      </div> -->
      <el-row :gutter="20">
        <el-col :span='10'>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" @clear="getUserList" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" ></el-table-column>
        <el-table-column prop="username" label="姓名" ></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="mobile" label="电话" ></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="my_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change='usreStateChanged(scope.row)'
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="small" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="small" @click='removeUserById(scope.row.id)'></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle size="small"  @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change='handleCurrentChange'
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size='queryInfo.pagesize'
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClosed"
      >
      <!-- 内容主题区域 -->
      <el-form :model="addForm" status-icon :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input type="username" v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.number="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="用户修改信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
    title="分配角色"
    :visible.sync="setRoleDialogVisible"
    width="50%"
    @close="setDialogClosed">
      <p>当前的用户：{{userInfo.username}}</p>
      <p>当前的角色：{{userInfo.role_name}}</p>
      <p>
        分配新角色：
        <el-select
        v-model="selectedRoleId"
        placeholder="请选择">
          <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error('请输入合法邮箱'));
    };
    // 自定义手机号规则
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'));
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: '0',
      dialogVisible: false,
      // 添加表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3, max: 10, message: '用户名的长度在3~10个字之间', trigger: 'blur',
          },
        ],
        password: [
          {
            required: true, message: '请输入密码', trigger: 'blur',
          },
          {
            min: 6, max: 15, message: '用户名的长度在6~10个字符之间', trigger: 'blur',
          },
        ],
        email: [
          {
            required: true, message: '请输入邮箱', trigger: 'blur',
          },
          {
            validator: checkEmail, trigger: 'blur',
          },
        ],
        mobile: [
          {
            required: true, message: '请输入手机号码', trigger: 'blur',
          },
          {
            validator: checkMobile, trigger: 'blur',
          },
        ],
      },
      editDialogVisible: false,
      setRoleDialogVisible: false,
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          {
            required: true, message: '请输入邮箱', trigger: 'blur',
          },
          {
            validator: checkEmail, trigger: 'blur',
          },
        ],
        mobile: [
          {
            required: true, message: '请输入手机号码', trigger: 'blur',
          },
          {
            validator: checkMobile, trigger: 'blur',
          },
        ],
      },
      userInfo: {},
      rolesList: [],
      selectedRoleId: '',
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data } = await this.$http.get('users', {
        params: this.queryInfo,
      });
      if (data.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！');
      }
      this.userList = data.data.users;
      this.total = data.data.total;
      console.log('test', this.total);
    },
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听switch开关状态的改变，使用put方法在服务器更新资源（客户端提供改变后的完整资源）
    async usreStateChanged(userInfo) {
      console.log(userInfo);
      const { data } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      if (data.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error('更新用户状态失败');
      }
      this.$message.success('更新用户状态成功');
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        const { data } = await this.$http.post('users', this.addForm);
        if (data.meta.status !== 201) {
          this.$message.error('添加用户失败！');
        }
        this.$message.success('添加用户成功！');
        // 隐藏添加的对话框
        this.addDialogClosed = false;
        this.getUserList();
      });
    },
    // 修改用户
    async showEditDialog(id) {
      const { data } = await this.$http.get(`users/${id}`);
      if (data.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！');
      }
      this.editForm = data.data;
      console.log('test', data);
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(
        async (valid) => {
          if (!valid) return;
          // 发起修改用户信息的数据请求
          const { data } = this.$http.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          });
          console.log('test--------------------', data);
          // if (data.meta.status !== 200) {
          //   return this.$message.error('更新用户信息失败！');
          // }
          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getUserList();
          // 提示修改成功
          this.$message.success('更新用户信息成功！');
        },
      );
    },
    async removeUserById(id) {
      // 根据Id删除对应的用户信息
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err);
      if (res !== 'confirm') {
        return this.$message.info('已取消删除');
      }
      const { data } = await this.$http.delete(`users/${id}`);
      if (data.meta.status !== 200) {
        return this.$message.error('删除用户失败');
      }
      this.$message.success('删除用户成功');
      this.getUserList();
    },
    async setRole(userInfo) {
      this.userInfo = userInfo;
      // 在展示对话框之前，获取所有角色的列表
      const { data } = await this.$http.get('roles');
      if (data.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！');
      }
      this.rolesList = data.data;
      this.setRoleDialogVisible = true;
    },
    // 点击分配角色按钮，最终确认
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！');
      }
      const { data } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId });
      if (data.meta.status !== 200) {
        return this.$message.error('更新角色失败!');
      }
      this.$message.success('更新角色成功！');
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    setDialogClosed() {
      this.selectedRoleId = '';
      this.userInfo = {};
    },
  },
};

</script>
<style lang='scss' scoped>
</style>
