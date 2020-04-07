<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :active="activeNum - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addGoodsForm"
        status-icon
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeNum"
          :before-leave="beforeTabsLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input type="text" v-model="addGoodsForm.goods_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addGoodsForm.goods_price" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addGoodsForm.goods_weight" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addGoodsForm.goods_number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="selectOptions"
                :props="addProps"
                v-model="addGoodsForm.goods_cat"
                @change="handlChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item,i) in manyTableData" :key="i">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyTableData" :key="i">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="action"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addGoods" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览弹窗 -->
    <el-dialog
      title="图片预览"
      :visible.sync="impPreViewVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <img :src="imgSrc" alt class="preViewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeNum: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        // 图片的数组
        pics: [],
        goods_introduce: ''
      },
      impPreViewVisible: false,
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
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
      manyTableData: [],
      onlyTableData: [],
      fileList: [],
      action: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      imgSrc: ''
    }
  },

  created() {
    this.getCateList()
  },

  mounted() {},

  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`)
      if (res.meta.status != 200)
        return this.$message.error('获取商品分类数据失败！')
      this.selectOptions = res.data
    },
    handlChange() {
      if (this.addModel.length != 3) {
        this.addModel = []
        return
      }
    },
    beforeTabsLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    async tabClicked() {
      if (this.activeNum === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        res.data.forEach(item => {
          if (item.attr_vals != '') {
            item.attr_vals = item.attr_vals.split(' ')
          } else {
            item.attr_vals = []
          }
        })
        this.manyTableData = res.data
      } else if (this.activeNum === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        res.data.forEach(item => {
          if (item.attr_vals != '') {
            item.attr_vals = item.attr_vals.split(' ')
          } else {
            item.attr_vals = []
          }
        })
        this.onlyTableData = res.data
      }
    },
    handlePreview(file) {
      this.imgSrc = file.response.data.url
      this.impPreViewVisible = true
    },
    handleRemove(file, fileList) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addGoodsForm.pics.splice(i, 1)
    },
    uploadSuccess(response, file, fileList) {
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push 到pics数组中
      this.addGoodsForm.pics.push(picInfo)
    },
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (valid) {
          const obj = _.cloneDeep(this.addGoodsForm)
          obj.goods_cat = obj.goods_cat.join(',')
          const { data: res } = await this.$http.post('goods', obj)
          if (res.meta.status != 201) return this.$message.error('创建商品失败')
          this.$message.success('添加商品成功！')
          this.$router.push('/goods')
        }
      })
    }
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="scss" scoped>
.el-steps {
  margin: 15px 0;
}
.preViewImg {
  width: 100%;
}
.addGoods {
  margin-top: 15px;
}
</style>
