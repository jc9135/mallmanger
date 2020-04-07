<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="clearSearchInput"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 搜索按钮 -->
          <el-button type="primary" @click="addGoodspage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column align="center" prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="goods_price" label="商品价格（元）" width="120px"></el-table-column>
        <el-table-column align="center" prop="goods_weight" label="商品重量" width="90px"></el-table-column>
        <el-table-column align="center" label="创建时间" width="160px">
          <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120px">
          <template slot-scope="scope">
            <el-tooltip content="编辑商品" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip content="删除商品" placement="top" :enterable="false">
              <el-button type="danger" @click="delgoods(scope.row)" icon="el-icon-delete" circle></el-button>
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
        background
      ></el-pagination>
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
        pagesize: 5
      },
      goodsList: [],
      total: 0
    }
  },

  created() {
    this.getGoodsList()
  },

  mounted() {},

  methods: {
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getGoodsList()
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getGoodsList()
    },
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    addGoodspage() {
      this.$router.push('/goods/add')
    },
    clearSearchInput() {
      this.queryInfo.query = ''
      this.getGoodsList()
    },
    async delgoods(data) {
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
      const { data: res } = await this.$http.delete(`goods/${data.goods_id}`)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除用户成功')
      this.getGoodsList()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
