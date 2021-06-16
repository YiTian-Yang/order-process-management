<template>
  <div class="app-container">
    <div class="filter-container">
      <YangButton :button-type="'LOOKFOR'" @buttonClick="showSearchUser" />
      <YangButton :button-type="'COMMIT'" @buttonClick="commmitSearchUser" />
    </div>
    <el-table
      ref="taskDecomposition"
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
          <el-button v-if="scope.row.orderState!=='订单完成'" type="text" size="medium" @click="handleClick(scope.row)">分解任务</el-button>
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
      <el-table-column prop="orderMethod" label="标准方法" sortable>
        <template slot-scope="scope">{{ scope.row.orderMethod }}</template>
      </el-table-column>
      <el-table-column prop="orderText" label="订单信息" sortable>
        <template slot-scope="scope">{{ scope.row.orderText }}</template>
      </el-table-column>
      <el-table-column prop="orderCustomer" label="客户名" sortable>
        <template slot-scope="scope">{{ scope.row.orderCustomer }}</template>
      </el-table-column>
      <el-table-column prop="orderPerson" label="销售员" sortable>
        <template slot-scope="scope">{{ scope.row.orderPerson }}</template>
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
            v-model="temp.taskStartTime"
            type="date"
            placeholder="请输入"
            style="width:100%;"
            disabled
          />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-date-picker
            v-model="temp.taskEndTime"
            type="date"
            placeholder="请输入"
            style="width:100%;"
            disabled
          />
        </el-form-item>
        <el-form-item label="检测标准" required>
          <el-select v-model="temp.taskName" placeholder="请选择" style="width: 100%" disabled>
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
        <el-form-item label="选择检测员" required>
          <el-select v-model="temp.taskPerson" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in personList"
              :key="item.userName"
              :label="item.userName"
              :value="item.userName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检测信息">
          <el-input v-model="temp.taskText" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" size="medium" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createTaskDecomposition">确认</el-button>
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
import { getOrderInfo, getPersonInfo, taskDecomposition, updateOrder } from '@/api/taskDecomposition'
import { getLibraryInfo } from '@/api/library'
export default {
  name: 'TaskDecomposition',
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
      list: [],
      personList: [],
      orderId: 0
    }
  },
  created() {
    this.getPerson()
    this.fetchData()
    if (localStorage.getItem('userType') === '超级管理员' || localStorage.getItem('userType') === '技术主管') {
      this.roleType = true
    }
  },
  activated() {
    this.fetchData()
    this.tableDoLayout()
  },
  methods: {
    tableDoLayout() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.taskDecomposition.doLayout()
        })
      }, 0)
    },
    getPerson() {
      this.listLoading = true
      getPersonInfo({}, 'GET').then((response) => {
        this.personList = response.data
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
        orderState: ''
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
    showSearchUser() {
      this.showSearch = true
      this.searchList = {
        orderCustomer: ''
      }
    },
    commmitSearchUser() {
      this.fetchData()
      this.getPerson()
    },
    handleClick(row) {
      this.dialogFormVisible = true
      this.fromTitle = '分解任务'
      this.buttonFlag = true
      this.dialogStatus = 'update'
      this.temp = {
        taskStartTime: row.orderStartTime === undefined ? '' : row.orderStartTime,
        taskEndTime: row.orderEndTime === undefined ? '' : row.orderEndTime,
        taskPerson: undefined,
        taskChairman: localStorage.getItem('userName'),
        taskName: row.orderName === undefined ? '' : row.orderName,
        taskMethod: row.orderMethod === undefined ? '' : row.orderMethod,
        orderCustomerPhone: row.orderCustomerPhone === undefined ? '' : row.orderCustomerPhone,
        remark: row.remark === undefined ? '' : row.remark,
        taskText: row.userEmail === undefined ? '' : row.orderText,
        taskId: row.Id === undefined ? '' : row.Id,
        taskState: 1
      }
      this.orderId = row.Id
    },
    getOneUser() {
      this.listLoading = true
      getOrderInfo({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        orderCustomer: this.searchList.orderCustomer,
        orderState: ''
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
    createTaskDecomposition() {
      if (!this.temp.taskStartTime) {
        this.$message({
          type: 'error',
          message: '请输入订单开始时间'
        })
        return
      }
      if (!this.temp.taskEndTime) {
        this.$message({
          type: 'error',
          message: '请输入订单结束时间'
        })
        return
      }
      const startTime = parseInt(this.$moment(JSON.parse(JSON.stringify(this.temp.taskStartTime))).format('YYYYMMDD'))
      const endTime = parseInt(this.$moment(JSON.parse(JSON.stringify(this.temp.taskEndTime))).format('YYYYMMDD'))
      if (endTime <= startTime) {
        this.$message({
          type: 'error',
          message: '订单开始时间不得晚于结束时间'
        })
        return
      }
      if (!this.temp.taskPerson) {
        this.$message({
          type: 'error',
          message: '请选择检测员'
        })
        return
      }
      const params = { Id: this.orderId }
      updateOrder(params, 'POST').then((response) => {

      })
      taskDecomposition(this.temp, 'POST').then((response) => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '指派任务成功'
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
