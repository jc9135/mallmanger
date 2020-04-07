<template>
  <div class="rights-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border style="width: 100%" stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180" align="center"></el-table-column>
        <el-table-column prop="path" label="路径" align="center"></el-table-column>
        <el-table-column  label="权限等级" align="center">
          <template  slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level == 2">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //权限列表数据
      rightsList: []
    }
  },

  created() {
    this.getRightList()
  },

  mounted() {},

  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status != 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
      this.total = res.data.total
      this.$message.success('获取权限列表成功')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
