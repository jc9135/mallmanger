<template>
  <div class="users-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="clearSearchInput"
          >
            <el-button slot="append" icon="el-icon-search" @click="getTableData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 搜索按钮 -->
          <el-button type="primary" @click="addUserDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column align="center" prop="username" label="昵称"></el-table-column>
        <el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
        <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
        <el-table-column align="center" prop="role_name" label="职位"></el-table-column>
        <el-table-column align="center" prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="switchChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑用户" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" @click="delUser(scope.row)" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="closeAddUserDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addUserForm"
        status-icon
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input type="text" v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddUserForm">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹窗 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="closeEditUserDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editUserForm"
        status-icon
        :rules="editUserFormRules"
        ref="editUserFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input type="text" disabled v-model="editUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="editUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input type="text" v-model="editUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submiteditUserForm">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹窗 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="40%"
      @close="closeSetRoleDialog"
      :close-on-click-modal="false"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitsetRoleForm">确 定</el-button>
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //邮箱自定义校验
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          callback()
        }
        callback(new Error('邮箱格式不正确'))
      }, 1000)
    }
    // 自定义手机号校验
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        // 验证手机的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          callback()
        }
        callback(new Error('手机号格式不正确'))
      }, 1000)
    }
    return {
      //删除confirm
      delConfirmVisible: false,
      //添加用户弹窗表单验证
      addUserFormRules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //编辑用户弹窗表单验证
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //添加用户弹窗表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //编辑用户弹窗表单数据
      editUserForm: {},
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: '',
      //添加弹窗显示控制
      addDialogVisible: false,
      //编辑用户弹窗显示控制
      editDialogVisible: false,
      //分配角色弹窗显示控制
      setRoleDialogVisible: false,
      // 搜索数据
      queryInfo: {
        // 搜索内容
        query: '',
        //当前页码
        pagenum: 1,
        //每页显示条数
        pagesize: 2
      },
      // 表格数据
      tableData: [],
      // 数据总条数
      total: 0
    }
  },

  created() {
    this.getTableData()
  },
  mounted() {},

  methods: {
    //显示添加用户弹窗
    addUserDialog() {
      this.addDialogVisible = true
    },
    async delUser(data) {
      const delConfirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (delConfirm != 'confirm') return this.$message.info('用户已取消删除')
      const { data: res } = await this.$http.delete(`users/${data.id}`)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除用户成功')
      this.getTableData()
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getTableData()
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getTableData()
    },
    async getTableData() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status != 200)
        return this.$message.error('获取用户列表失败！')
      this.tableData = res.data.users
      this.total = res.data.total
    },
    async switchChange(data) {
      const { data: res } = await this.$http.put(
        `users/${data.id}/state/${data.mg_state}`
      )
      if (res.meta.status != 200)
        return this.$message.error('设置用户状态失败！')
      this.$message.success('设置用户状态成功！')
    },
    clearSearchInput() {
      this.getTableData()
    },
    async submitAddUserForm() {
      const { data: res } = await this.$http.post('users', this.addUserForm)
      if (res.meta.status != 201) return this.$message.error('用户创建失败')
      this.$message.success('用户创建成功')
      this.getTableData()
      this.addDialogVisible = false
    },
    closeAddUserDialog() {
      this.$refs.addUserFormRef.resetFields()
    },
    closeEditUserDialog() {
      this.$refs.editUserFormRef.resetFields()
    },
    closeSetRoleDialog() {
      // this.$refs.setRoleFormRef.resetFields()
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status != 200) return this.$message.error('查询失败')
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    submiteditUserForm() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'users/' + this.editUserForm.id,
            { email: this.editUserForm.email, mobile: this.editUserForm.mobile }
          )
          if (res.meta.status != 200)
            return this.$message.error('更新用户信息失败')
          this.editDialogVisible = false
          this.getTableData()
          this.$message.success('更新用户信息成功')
        }
      })
    },
    async setRole(rowData) {
      this.userInfo = rowData
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) return this.$message.error('获取角色信息失败')
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async submitsetRoleForm() {
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status != 200) return this.$message.error('设置角色失败')

      this.setRoleDialogVisible = false
      this.getTableData()
      this.$message.success('设置角色成功')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
