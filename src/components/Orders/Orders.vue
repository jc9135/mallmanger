<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="orderList" style="width: 100%" border>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column align="center" prop="order_number" label="订单编号"></el-table-column>
        <el-table-column align="center" prop="order_price" label="订单价格" width="120px"></el-table-column>
        <el-table-column align="center" label="是否付款" width="90px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="is_send" label="是否发货" width="90px"></el-table-column>
        <el-table-column align="center" label="下单时间" width="160px">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120px">
          <template slot-scope="scope">
            <el-tooltip content="编辑商品" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip content="删除商品" placement="top" :enterable="false">
              <el-button type="success" @click="delgoods(scope.row)" icon="el-icon-location" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
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
        pagesize: 5,
        pagenum: 1
      },
      total: 0,
      orderList: []
    }
  },

  created() {
    this.getOrderList()
  },

  mounted() {},

  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) return this.$message.error('获取订单列表失败')
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    clearSearchInput() {
      this.queryInfo.query = ''
      this.getOrderList()
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getOrderList()
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getOrderList()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
