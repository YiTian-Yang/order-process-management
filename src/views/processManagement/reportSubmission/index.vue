<template>
  <div class="app-container">
    <div class="filter-container">
      <YangButton :button-type="'COMMIT'" @buttonClick="fetchData" />
    </div>
    <el-table
      ref="detectionResult"
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
          <el-button v-if="scope.row.taskState!=='检测中'" type="text" size="medium" @click="completeTask(scope.row)">完成订单</el-button>
          <el-button v-if="scope.row.taskState!=='检测中'" type="text" size="medium" @click="resetTask(scope.row)">重新检测</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="taskState" label="订单状态" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.taskState==='检测中'" style="font-size: 16px; color: #FFB61B;">●</span>
          <span v-if="scope.row.taskState==='检测完毕'" style="font-size: 16px; color: #00C695;">●</span>
          <span v-if="scope.row.taskState==='订单完成'" style="font-size: 16px; color: #00C695;">●</span>
          {{ scope.row.taskState }}
        </template>
      </el-table-column>
      <el-table-column prop="taskStartTime" label="开始时间" sortable>
        <template slot-scope="scope">{{ scope.row.taskStartTime }}</template>
      </el-table-column>
      <el-table-column prop="taskEndTime" label="结束时间" sortable>
        <template slot-scope="scope">{{ scope.row.taskEndTime }}</template>
      </el-table-column>
      <el-table-column prop="taskName" label="标准名" sortable>
        <template slot-scope="scope">{{ scope.row.taskName }}</template>
      </el-table-column>
      <el-table-column prop="taskMethod" label="标准方法" sortable>
        <template slot-scope="scope">{{ scope.row.taskMethod }}</template>
      </el-table-column>
      <el-table-column prop="taskText" label="订单信息" sortable>
        <template slot-scope="scope">{{ scope.row.taskText }}</template>
      </el-table-column>
      <el-table-column prop="taskChairman" label="订单负责人" sortable>
        <template slot-scope="scope">{{ scope.row.taskChairman }}</template>
      </el-table-column>
      <el-table-column prop="taskResult" label="实验结果" sortable>
        <template slot-scope="scope">{{ scope.row.taskResult }}</template>
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
            disabled
            style="width:100%;"
          />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-date-picker
            v-model="temp.taskEndTime"
            type="date"
            placeholder="请输入"
            disabled
            style="width:100%;"
          />
        </el-form-item>
        <el-form-item label="检测标准" required>
          <el-input v-model="temp.taskName" size="medium" placeholder="请输入" disabled />
        </el-form-item>
        <el-form-item label="检测方法" required>
          <el-input v-model="temp.taskMethod" size="medium" placeholder="请输入" disabled />
        </el-form-item>
        <el-form-item label="订单负责人" required>
          <el-input v-model="temp.taskChairman" size="medium" placeholder="请输入" disabled />
        </el-form-item>
        <el-form-item label="检测信息">
          <el-input v-model="temp.taskText" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="检测结果" required>
          <el-input v-model="temp.taskResult" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="检测备注">
          <el-input v-model="temp.taskName" size="medium" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确认</el-button>
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
import { getTaskInfo } from '@/api/detectionResult'
import { updateOrderInfo } from '@/api/reportSubmission'

export default {
  name: 'DetectionResult',
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
      time: '',
      fromTitle: '',
      roleType: true,
      orderId: 0
    }
  },
  created() {
    this.fetchData()
  },
  activated() {
    this.fetchData()
    this.tableDoLayout()
  },
  methods: {
    tableDoLayout() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.detectionResult.doLayout()
        })
      }, 0)
    },
    fetchData() {
      this.listLoading = true
      getTaskInfo({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        userType: localStorage.getItem('userType'),
        userName: localStorage.getItem('userName')
      }, 'GET').then((response) => {
        this.tableList = response.data
        for (let i = 0; i < this.tableList.length; i++) {
          if (this.tableList[i].taskState === 0) {
            this.tableList[i].taskState = '无状态'
          }
          if (this.tableList[i].taskState === 1) {
            this.tableList[i].taskState = '检测中'
          }
          if (this.tableList[i].taskState === 2) {
            this.tableList[i].taskState = '检测完毕'
          }
          if (this.tableList[i].taskState === 3) {
            this.tableList[i].taskState = '订单完成'
          }
        }
        this.total = response.count
        this.listLoading = false
        this.tableDoLayout()
      })
    },
    commmitSearchUser() {
      this.fetchData()
      this.getPerson()
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
    updateData() {
      updateOrderInfo(this.temp, 'POST').then((response) => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '更改状态成功'
        })
      })
    },
    rowStyle() {
      return {
        height: '67px'
      }
    },
    completeTask(user) {
      this.$confirm('确认完成订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        iconClass: 'el-icon-warning-outline'
      }).then(() => {
        this.temp = {
          orderState: 4,
          taskState: 3,
          taskId: user.taskId,
          Id: user.Id
        }
        this.updateData(user)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消完成订单'
        })
      })
    },
    resetTask(user) {
      console.log(user)
      this.$confirm('确认重新检测?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        iconClass: 'el-icon-warning-outline'
      }).then(() => {
        this.temp = {
          orderState: 2,
          taskState: 1,
          taskId: user.taskId,
          Id: user.Id
        }
        this.updateData(user)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重新检测'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
