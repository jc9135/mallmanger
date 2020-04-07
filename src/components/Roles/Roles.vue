<template>
  <div class="roles-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      <el-table :data="rolesList" border style="width: 100%" stripe>
        <el-table-column type="expand" align="center">
          <template slot-scope="scope">
            <el-row
              :class="[index1 === 0?'br-top':'','br-bottom vcenter']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="delRolesTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0?'':'br-top','vcenter']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="delRolesTag(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      @close="delRolesTag(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip content="编辑角色" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除角色" placement="top" :enterable="false">
              <el-button type="danger" @click="delRoles(scope.row)" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
            <el-tooltip content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限弹窗 -->
    <el-dialog title="分配权限" :visible.sync="setRightVisible" width="40%" @close="clearArr">
      <div>
        <el-tree
          node-key="id"
          :default-checked-keys="defKeys"
          :data="rightsList"
          :props="rightsProps"
          show-checkbox
          :default-expand-all="true"
          ref="setRightRef"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色弹窗 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="closeAddRightDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addRightForm"
        status-icon
        :rules="addRightFormRules"
        ref="addRightFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input type="text" v-model="addRightForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="text" v-model="addRightForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddRightForm">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹窗 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="closeEditRightDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editRightsForm"
        status-icon
        :rules="editRightFormRules"
        ref="editRightFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input type="text" v-model="editRightsForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="text" v-model="editRightsForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditRightForm">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //角色列表数据
      rolesList: [],
      // 分配权限弹窗显示隐藏
      setRightVisible: false,
      //添加角色弹窗显示隐藏
      addDialogVisible: false,
      //编辑角色弹窗显示隐藏
      editDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      //添加角色弹窗数据
      addRightForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色数据
      editRightsForm:{},
      //添加角色弹窗验证
      addRightFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      //编辑角色弹窗验证
      editRightFormRules:{
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      //树形结构属性绑定对象
      rightsProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中数据的数组
      defKeys: [105, 116],
      //当前角色ID
      roleId: ''
    }
  },

  created() {
    this.getRolesList()
  },

  mounted() {},

  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      this.$message.success('获取角色列表成功')
    },
    //添加角色表单提交
    async submitAddRightForm() {
      const { data: res } = await this.$http.post('roles', this.addRightForm)
      if (res.meta.status != 201) return this.$message.error('创建角色失败')
      this.getRolesList()
      this.$message.success('创建角色成功')
      this.addDialogVisible = false
    },
    //关闭添加角色弹窗
    closeAddRightDialog() {
      this.addRightForm.roleName = ''
      this.addRightForm.roleDesc = ''
      this.$refs.addRightFormRef.resetFields()
    },
    // 显示编辑角色弹窗
    async showEditDialog(id) {
      this.editDialogVisible = true
      const {data:res} = await this.$http.get('roles/' + id)
      this.editRightsForm = res.data
    },
    //提交编辑弹窗数据
    async submitEditRightForm(){
        const {data:res} = await this.$http.put(`roles/${this.editRightsForm.roleId}`,{
            roleName:this.editRightsForm.roleName,
            roleDesc:this.editRightsForm.roleDesc
        })
      if (res.meta.status != 200) return this.$message.error('编辑角色失败')
      this.$message.success('编辑角色成功')
      this.getRolesList()
      this.editDialogVisible = false
    },
    closeEditRightDialog(){
      this.$refs.editRightFormRef.resetFields()
    },
    // 删除角色
    async delRoles(data) {
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
      const { data: res } = await this.$http.delete(`roles/${data.id}`)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除用户成功')
      this.getRolesList()
    },
    // 分配角色
    async setRole(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status != 200) return this.$message.error('获取权限数据失败')
      this.rightsList = res.data
      //获取三级节点id
      this.getThreeRightsId(role, this.defKeys)
      this.setRightVisible = true
    },
    //删除权限Tag
    async delRolesTag(role, rightId) {
      const delConfirm = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (delConfirm != 'confirm') return this.$message.info('用户已取消删除')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      this.$message.info('给权限已成功删除')
      role.children = res.data
    },
    //获取三级权限id
    getThreeRightsId(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getThreeRightsId(item, arr))
    },
    //弹窗关闭清空数据
    clearArr() {
      this.defKeys = []
    },
    //提交选中的权限数据
    async setRight() {
      const keys = [
        ...this.$refs.setRightRef.getCheckedKeys(),
        ...this.$refs.setRightRef.getHalfCheckedKeys()
      ]
      const keyStrs = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keyStrs }
      )
      if (res.meta.status != 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.br-bottom {
  border-bottom: 1px solid #eee;
}
.br-top {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
