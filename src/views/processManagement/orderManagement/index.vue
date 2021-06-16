<template>
  <div class="app-container">
    <div class="filter-container">
      <YangButton v-if="roleType" :button-type="'ADD'" @buttonClick="handleCreate" />
      <YangButton v-if="roleType" :button-type="'DEL'" @buttonClick="delUserMod" />
      <YangButton :button-type="'LOOKFOR'" @buttonClick="showSearchUser" />
      <YangButton :button-type="'COMMIT'" @buttonClick="commmitSearchUser" />
    </div>
    <el-table
      ref="orderManagement"
      height="calc(100vh - 325px)"
      :data="tableList"
      element-loading-text="Loading"
      border
      stripe
      size="medium"
      highlight-current-row
      :row-style="rowStyle()"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" fixed width="50" />
      <el-table-column v-if="roleType" label="操作" width="180" align="center" fixed>
        <template slot-scope="scope">
          <el-button v-if="scope.row.orderState!=='订单完成'" type="text" size="medium" @click="handleClick(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.orderState!=='订单完成'" type="text" size="medium" style="color: red" @click="delUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="orderState" label="订单状态" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.orderState==='无状态'" style="font-size: 16px; color: #A7ADC3;">●</span>
          <span v-if="scope.row.orderState==='已下单'" style="font-size:16px; color: #A7ADC3;">●</span>
          <span v-if="scope.row.orderState==='检测中'" style="font-size: 16px; color: #FFB61B;">●</span>
          <span v-if="scope.row.orderState==='检测完毕'" style="font-size: 16px; color: #00C695;">●</span>
          <span v-if="scope.row.orderState==='订单完成'" style="font-size: 16px; color: #00C695;">●</span>
          {{ scope.row.orderState }}
        </template>
      </el-table-column>
      <el-table-column prop="orderStartTime" label="开始时间" sortable>
        <template slot-scope="scope">{{ scope.row.orderStartTime }}</template>
      </el-table-column>
      <el-table-column prop="orderEndTime" label="结束时间" sortable>
        <template slot-scope="scope">{{ scope.row.orderEndTime }}</template>
      </el-table-column>
      <el-table-column prop="orderName" label="标准名" sortable>
        <template slot-scope="scope">{{ scope.row.orderName }}</template>
      </el-table-column>
      <el-table-column prop="orderName" label="标准方法" sortable>
        <template slot-scope="scope">{{ scope.row.orderMethod }}</template>
      </el-table-column>
      <el-table-column prop="orderMethod" label="订单信息" sortable>
        <template slot-scope="scope">{{ scope.row.orderText }}</template>
      </el-table-column>
      <el-table-column prop="orderPerson" label="销售员" sortable>
        <template slot-scope="scope">{{ scope.row.orderPerson }}</template>
      </el-table-column>
      <el-table-column prop="orderText" label="客户名" sortable>
        <template slot-scope="scope">{{ scope.row.orderCustomer }}</template>
      </el-table-column>
      <el-table-column prop="orderCustomerPhone" label="客户手机号" sortable>
        <template slot-scope="scope">{{ scope.row.orderCustomerPhone }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" sortable>
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
    </el-table>
    <el-dialog :title="fromTitle" :visible.sync="dialogFormVisible">
      <el-form
        :model="temp"
        label-position="right"
        label-width="30%"
        style="width: 80%"
        placeholder="请选择"
      >
        <el-form-item label="开始时间" required>
          <el-date-picker
            v-model="temp.orderStartTime"
            type="date"
            placeholder="请输入"
            style="width:100%;"
          />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-date-picker
            v-model="temp.orderEndTime"
            type="date"
            placeholder="请输入"
            style="width:100%;"
          />
        </el-form-item>
        <el-form-item label="检测标准" required>
          <el-select v-model="temp.orderName" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in list"
              :key="item.Id"
              :label="item.libraryName"
              :value="item.libraryName"
            >
              <span style="float: left">{{ item.libraryName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.libraryMethod }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单信息">
          <el-input v-model="temp.orderText" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="客户名" required>
          <el-input v-model="temp.orderCustomer" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="客户手机号">
          <el-input v-model="temp.orderCustomerPhone" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" size="medium" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查找" :visible.sync="showSearch">
      <el-form
        :model="searchList"
        label-position="right"
        label-width="30%"
        style="width: 80%"
      >
        <el-form-item label="客户名">
          <el-input v-model="searchList.orderCustomer" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSearch = false">取消</el-button>
        <el-button type="primary" @click="getOneUser">确认</el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageIndex"
      :limit.sync="pageSize"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import YangButton from '@/components/YangButton/index'
import Pagination from '@/components/Pagination/index'
import { getLibraryInfo } from '@/api/library'
import { getOrderInfo, addOrderInfo, deleteOrderInfo, updateOrderInfo } from '@/api/order'
export default {
  name: 'OrderManagement',
  components: { YangButton, Pagination },
  data() {
    return {
      tableList: [],
      listLoading: false,
      pageSize: 20,
      pageIndex: 1,
      showSearch: false,
      searchList: {},
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      buttonFlag: true,
      total: 1,
      delList: [],
      time: '',
      fromTitle: '',
      roleType: false,
      list: []
    }
  },
  created() {
    this.getLibrary()
    this.fetchData()
    if (localStorage.getItem('userType') === '超级管理员' || localStorage.getItem('userType') === '销售') {
      this.roleType = true
    }
  },
  activated() {
    this.tableDoLayout()
    this.fetchData()
  },
  methods: {
    tableDoLayout() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.orderManagement.doLayout()
        })
      }, 0)
    },
    getLibrary() {
      this.listLoading = true
      getLibraryInfo({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        libraryName: ''
      }, 'GET').then((response) => {
        this.list = response.data
        this.listLoading = false
        this.tableDoLayout()
      })
    },
    fetchData() {
      this.listLoading = true
      getOrderInfo({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        orderCustomer: '',
        orderState: '',
        userType: localStorage.getItem('userType')
      }, 'GET').then((response) => {
        this.tableList = response.data
        for (let i = 0; i < this.tableList.length; i++) {
          if (this.tableList[i].orderState === 0) {
            this.tableList[i].orderState = '无状态'
          }
          if (this.tableList[i].orderState === 1) {
            this.tableList[i].orderState = '已下单'
          }
          if (this.tableList[i].orderState === 2) {
            this.tableList[i].orderState = '检测中'
          }
          if (this.tableList[i].orderState === 3) {
            this.tableList[i].orderState = '检测完毕'
          }
          if (this.tableList[i].orderState === 4) {
            this.tableList[i].orderState = '订单完成'
          }
        }
        this.total = response.count
        this.listLoading = false
        this.tableDoLayout()
      })
    },
    handleCreate() {
      this.temp = {
        orderStartTime: '',
        orderEndTime: '',
        orderName: '',
        orderCustomer: '',
        orderCustomerPhone: '',
        remark: '',
        orderText: '',
        orderMethod: '',
        orderState: 1,
        orderPerson: localStorage.getItem('userName')
      }
      this.buttonFlag = false
      this.dialogFormVisible = true
      this.fromTitle = '新增'
      this.dialogStatus = 'create'
    },
    delUserMod() {
      if (this.delList.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择删除项'
        })
        return
      }
      for (let i = 0; i < this.delList.length; i++) {
        if (this.delList[i].orderState === '订单完成') {
          this.$message({
            type: 'error',
            message: '订单完成的不能删除'
          })
          return
        }
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        iconClass: 'el-icon-warning-outline'
      }).then(() => {
        this.doDealMore()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doDealMore() {
      deleteOrderInfo(this.delList, 'POST').then((response) => {
        this.listLoading = false
        this.showSearch = false
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.fetchData()
      })
    },
    showSearchUser() {
      this.showSearch = true
      this.searchList = {
        orderCustomer: ''
      }
    },
    commmitSearchUser() {
      this.fetchData()
      this.getLibrary()
    },
    download() {

    },
    handleClick(row) {
      this.dialogFormVisible = true
      this.fromTitle = '编辑'
      this.buttonFlag = true
      this.dialogStatus = 'update'
      this.temp = {
        orderStartTime: row.orderStartTime === undefined ? '' : row.orderStartTime,
        orderEndTime: row.orderEndTime === undefined ? '' : row.orderEndTime,
        orderName: row.orderName === undefined ? '' : row.orderName,
        orderPerson: localStorage.getItem('userName'),
        orderCustomer: row.orderCustomer === undefined ? '' : row.orderCustomer,
        orderCustomerPhone: row.orderCustomerPhone === undefined ? '' : row.orderCustomerPhone,
        remark: row.remark === undefined ? '' : row.remark,
        orderText: row.orderText === undefined ? '' : row.orderText,
        Id: row.Id === undefined ? '' : row.Id
      }
      if (row.orderState === '已下单') {
        this.temp.orderState = 1
      }
      if (row.orderState === '检测中') {
        this.temp.orderState = 2
      }
      if (row.orderState === '检测完毕') {
        this.temp.orderState = 3
      }
    },
    delUser(user) {
      this.$confirm('确认删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        iconClass: 'el-icon-warning-outline'
      }).then(() => {
        this.doDeal(user)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doDeal(user) {
      const params = {
        Id: user.Id
      }
      deleteOrderInfo([params], 'POST').then((response) => {
        this.listLoading = false
        this.showSearch = false
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.fetchData()
      })
    },
    getOneUser() {
      this.listLoading = true
      getOrderInfo({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        orderCustomer: this.searchList.orderCustomer,
        orderState: '',
        userType: localStorage.getItem('userType')
      }, 'GET').then((response) => {
        this.tableList = response.data
        for (let i = 0; i < this.tableList.length; i++) {
          if (this.tableList[i].orderState === 0) {
            this.tableList[i].orderState = '无状态'
          }
          if (this.tableList[i].orderState === 1) {
            this.tableList[i].orderState = '已下单'
          }
          if (this.tableList[i].orderState === 2) {
            this.tableList[i].orderState = '检测中'
          }
          if (this.tableList[i].orderState === 3) {
            this.tableList[i].orderState = '检测完毕'
          }
          if (this.tableList[i].orderState === 4) {
            this.tableList[i].orderState = '订单完成'
          }
        }
        this.total = response.count
        this.listLoading = false
        this.showSearch = false
        this.tableDoLayout()
      })
    },
    handleSelectionChange(val) {
      // 每次清空数组
      this.delList = []
      // 遍历循环对象，得到userId
      for (let i = 0; i < val.length; i++) {
        // 推送进删除数组中
        this.delList.push({ Id: val[i].Id, orderState: val[i].orderState })
      }
    },
    createData() {
      if (!this.temp.orderStartTime) {
        this.$message({
          type: 'error',
          message: '请输入订单开始时间'
        })
        return
      }
      if (!this.temp.orderEndTime) {
        this.$message({
          type: 'error',
          message: '请输入订单结束时间'
        })
        return
      }
      const startTime = parseInt(this.$moment(JSON.parse(JSON.stringify(this.temp.orderStartTime))).format('YYYYMMDD'))
      const endTime = parseInt(this.$moment(JSON.parse(JSON.stringify(this.temp.orderEndTime))).format('YYYYMMDD'))
      if (endTime <= startTime) {
        this.$message({
          type: 'error',
          message: '订单开始时间不得晚于结束时间'
        })
        return
      }
      if (!this.temp.orderName) {
        this.$message({
          type: 'error',
          message: '请输入检测内容'
        })
        return
      }
      if (!this.temp.orderCustomer) {
        this.$message({
          type: 'error',
          message: '请输入客户名称'
        })
        return
      }
      this.temp.orderStartTime = this.$moment(this.temp.orderStartTime).format('YYYY-MM-DD')
      this.temp.orderEndTime = this.$moment(this.temp.orderEndTime).format('YYYY-MM-DD')
      addOrderInfo(this.temp, 'POST').then((response) => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '新增订单成功'
        })
      })
    },
    updateData() {
      if (!this.temp.orderStartTime) {
        this.$message({
          type: 'error',
          message: '请输入订单开始时间'
        })
        return
      }
      if (!this.temp.orderEndTime) {
        this.$message({
          type: 'error',
          message: '请输入订单结束时间'
        })
        return
      }
      const startTime = parseInt(this.$moment(JSON.parse(JSON.stringify(this.temp.orderStartTime))).format('YYYYMMDD'))
      const endTime = parseInt(this.$moment(JSON.parse(JSON.stringify(this.temp.orderEndTime))).format('YYYYMMDD'))
      if (endTime <= startTime) {
        this.$message({
          type: 'error',
          message: '订单开始时间不得晚于结束时间'
        })
        return
      }
      if (!this.temp.orderName) {
        this.$message({
          type: 'error',
          message: '请输入检测内容'
        })
        return
      }
      if (!this.temp.orderCustomer) {
        this.$message({
          type: 'error',
          message: '请输入客户名称'
        })
        return
      }
      updateOrderInfo(this.temp, 'POST').then((response) => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '编辑订单成功'
        })
      })
    },
    rowStyle() {
      return {
        height: '67px'
      }
    }
  }
}
</script>

<style scoped>

</style>
