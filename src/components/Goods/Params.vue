<template>
  <div class="params-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            :options="selectOptions"
            :props="addProps"
            v-model="addModel"
            @change="parentCateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabChange">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if=" scope.row.inputVisible"
                  v-model=" scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-tooltip content="编辑分类" placement="top" :enterable="false">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row)"
                    circle
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="删除分类" placement="top" :enterable="false">
                  <el-button type="danger" @click="delParams(scope.row)" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if=" scope.row.inputVisible"
                  v-model=" scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
              </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-tooltip content="编辑分类" placement="top" :enterable="false">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row)"
                    circle
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="删除分类" placement="top" :enterable="false">
                  <el-button type="danger" @click="delParams(scope.row)" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 新增参数弹窗 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="closeaddParamsDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addParamsForm"
        status-icon
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input type="text" v-model="addParamsForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitaddParamsForm">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--修改参数弹窗 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="closeeditParamsDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editParamsForm"
        status-icon
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input type="text" v-model="editParamsForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submiteditParamsForm">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //下拉数据
      selectOptions: [],
      //下拉的数据绑定
      addModel: [],
      //下拉数据配置对象
      addProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //tab切换页
      activeName: 'many',
      //动态参数表单数据
      manyTableData: [],
      //静态属性表单数据
      onlyTableData: [],
      //添加参数弹窗显示隐藏
      addDialogVisible: false,
      //添加参数表单
      addParamsForm: {
        attr_name: ''
      },
      // 添加表单验证
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改弹窗显示隐藏
      editDialogVisible: false,
      //修改弹窗表单数据
      editParamsForm: {
        attr_name: ''
      },
      // 修改弹窗表单验证
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getCateList()
  },

  mounted() {},

  methods: {
    async parentCateChange() {
      if (this.addModel.length != 3) {
        this.addModel = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status != 200) return this.$message.error('获取分类数据失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.trim() ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveTagDate(row)
    },
    async saveTagDate(row){
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories?type=3')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.selectOptions = res.data
    },
    tabChange() {
      if (this.addModel.length === 3) {
        this.parentCateChange()
      }
    },
    closeaddParamsDialog() {
      this.$refs.addParamsFormRef.resetFields()
    },
    async submitaddParamsForm() {
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName
        }
      )
      if (res.meta.status != 201) return this.$message.error('添加参数失败')
      this.addDialogVisible = false
      this.parentCateChange()
    },
    async showEditDialog(row) {
      console.log(row)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${row.attr_id}`
      )
      if (res.meta.status != 200) return this.$message.error('获取参数失败')
      this.editParamsForm = res.data
      this.editDialogVisible = true
    },
    closeeditParamsDialog() {
      this.$refs.editParamsFormRef.resetFields()
    },
    submiteditParamsForm() {
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status != 200) return this.$message.error('更新参数失败')
        this.parentCateChange()
        this.editDialogVisible = false
      })
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveTagDate(row)
    },
    async delParams(row){
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
      // 删除的业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${row.attr_id}`
      )
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除分类成功')
      console.log(res)
      this.parentCateChange()
    }
  },
  computed: {
    isDisabled() {
      if (this.addModel.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的Id
    cateId() {
      if (this.addModel.length === 3) {
        return this.addModel[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态参数'
    }
  }
}
</script>
<style lang="scss" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tabs {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.input-new-tag {
  width: 100px;
}
</style>
