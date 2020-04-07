<template>
  <div class="categories-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        ref="cateTableRef"
        sum-text="sum"
        :show-index="true"
        index-text="#"
        :data="categoriesList"
        :columns="cateColumns"
        border
        :selection-type="false"
        :expand-type="false"
      >
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:green;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <template slot="index" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opation" slot-scope="scope">
          <el-tooltip content="编辑分类" placement="top" :enterable="false">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.cat_id)"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除分类" placement="top" :enterable="false">
            <el-button type="danger" @click="delCate(scope.row)" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </template>
      </tree-table>
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
      <!-- 新增分类弹窗 -->
      <el-dialog
        title="新增分类"
        :visible.sync="addDialogVisible"
        width="40%"
        @close="closeAddCateDialog"
        :close-on-click-modal="false"
      >
        <el-form
          :model="addCateForm"
          status-icon
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input type="text" v-model="addCateForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <div class="block">
              <el-cascader
                :options="selectOptions"
                :props="addProps"
                v-model="addModel"
                :clearable="true"
                @change="parentCateChange"
              ></el-cascader>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddCateForm">确 定</el-button>
          <el-button @click="addDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类弹窗 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="editDialogVisible"
        width="40%"
        @close="closeEditCateDialog"
        :close-on-click-modal="false"
      >
        <el-form
          :model="editCateForm"
          status-icon
          :rules="editCateFormRules"
          ref="editCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input type="text" v-model="editCateForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditCateForm">确 定</el-button>
          <el-button @click="editDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表格列定义
      cateColumns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isOk',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '排序',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'index',
          prop: 'cat_level'
        },
        {
          label: '操作',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'opation',
          prop: 'cat_level'
        }
      ],
      //新增弹窗显示隐藏
      addDialogVisible: false,
      //新增弹窗表单数据
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 下拉框配置对象
      addProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //选中的下拉数据
      addModel: [],
      //下拉框数据
      selectOptions: [],
      //新增弹窗表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 编辑弹窗显示隐藏
      editDialogVisible: false,
      //编辑弹窗表单数据
      editCateForm: {},
      //编辑弹窗验证
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //商品分类数据
      categoriesList: [],
      //分页数据
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //分页数据总条数
      total: 0
    }
  },

  created() {
    this.getCategoriesList()
  },

  mounted() {},

  methods: {
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getCategoriesList()
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getCategoriesList()
    },
    async getCategoriesList() {
      const { data: res } = await this.$http.get(
        `categories?type=${this.queryInfo.type}&pagenum=${this.queryInfo.pagenum}&pagesize=${this.queryInfo.pagesize}`
      )
      if (res.meta.status != 200)
        return this.$message.error('获取商品分类数据失败')
      this.categoriesList = res.data.result
      this.total = res.data.total
      this.$message.success('获取商品分类数据成功')
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.editCateForm = res.data
      this.editDialogVisible = true
    },
    async delCate(row) {
      const delConfirm = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (delConfirm != 'confirm') return this.$message.info('用户已取消删除')
      const { data: res } = await this.$http.delete('categories/' + row.cat_id)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除分类成功')
      this.getCategoriesList()
    },
    closeEditCateDialog() {
      this.$refs.editCateFormRef.resetFields()
    },
    async submitEditCateForm() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'categories/' + this.editCateForm.cat_id,
            { cat_name: this.editCateForm.cat_name }
          )
          if (res.meta.status != 200) return this.$message.error(res.meta.msg)
          this.$message.success('编辑分类成功')
          this.getCategoriesList()
          this.editDialogVisible = false
        }
      })
    },
    async addCate() {
      const { data: res } = await this.$http.get('categories?type=2')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      console.log(res.data)
      this.selectOptions = res.data
      this.addDialogVisible = true
    },
    closeAddCateDialog() {
      this.$refs.addCateFormRef.resetFields()
      },
    submitAddCateForm(){
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'categories',this.addCateForm)
          if (res.meta.status != 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加分类成功')
          this.getCategoriesList()
          this.addDialogVisible = false
        }
      })
    },
    parentCateChange(){
      if(this.addModel.length>0){
        this.addCateForm.cat_pid =this.addModel[this.addModel.length-1]
        this.addCateForm.cat_level =this.addModel.length
        return
      }else {
        this.addCateForm.cat_pid =0
        this.addCateForm.cat_level =0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-button {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
