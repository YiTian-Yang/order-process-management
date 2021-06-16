<template>
  <div v-loading="listLoading" class="app-container">
    <div class="filter-container">
      <YangButton v-if="roleType" :button-type="'ADD'" @buttonClick="handleCreate" />
      <YangButton v-if="roleType" :button-type="'DEL'" @buttonClick="delUserMod" />
      <YangButton :button-type="'LOOKFOR'" @buttonClick="showSearchUser" />
      <YangButton :button-type="'COMMIT'" @buttonClick="commmitSearchUser" />
    </div>
    <el-table
      ref="personInfo"
      height="calc(100vh - 325px)"
      :data="tableList"
      element-loading-text="Loading"
      border
      stripe
      size="medium"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :row-style="rowStyle()"
    >
      <el-table-column type="selection" align="center" fixed width="50" />
      <el-table-column v-if="roleType" label="操作" width="180" align="center" fixed>
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="handleClick(scope.row)">编辑</el-button>
          <el-button type="text" size="medium" style="color: red" @click="delUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="ID" sortable>
        <template slot-scope="scope">{{ scope.row.userId }}</template>
      </el-table-column>
      <el-table-column prop="userName" label="姓名" sortable>
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>
      <el-table-column prop="userQqNum " label="QQ号" sortable>
        <template slot-scope="scope">{{ scope.row.userQqNum }}</template>
      </el-table-column>
      <el-table-column prop="userEmail " label="邮箱" sortable>
        <template slot-scope="scope">{{ scope.row.userEmail }}</template>
      </el-table-column>
      <el-table-column prop="userPhone" label="电话" sortable>
        <template slot-scope="scope">{{ scope.row.userPhone }}</template>
      </el-table-column>
      <el-table-column prop="userDepart" label="部门" sortable>
        <template slot-scope="scope">{{ scope.row.userDepart }}</template>
      </el-table-column>
      <el-table-column prop="post" label="职位" sortable>
        <template slot-scope="scope">{{ scope.row.userType }}</template>
      </el-table-column>
    </el-table>
    <el-dialog title="查找" :visible.sync="showSearch">
      <el-form
        :model="searchList"
        label-position="right"
        label-width="30%"
        style="width: 80%"
      >
        <el-form-item label="姓名">
          <el-input v-model="searchList.userName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSearch = false">取消</el-button>
        <el-button type="primary" @click="getOneUser">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="fromTitle" :visible.sync="dialogFormVisible">
      <el-form
        :model="temp"
        label-position="right"
        label-width="30%"
        style="width: 80%"
        placeholder="请选择"
      >
        <el-form-item label="ID" required>
          <el-input v-model="temp.userId" :disabled="buttonFlag" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="用户名" required>
          <el-input v-model="temp.userName" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="QQ号">
          <el-input v-model="temp.userQqNum" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="temp.userEmail" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="temp.userPhone" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="部门" required>
          <el-select v-model="temp.userDepart" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in depart"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" required>
          <el-select v-model="temp.userType" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="buttonFlag" label="密码" required>
          <el-input v-model="temp.userPassword" size="medium" placeholder="请输入" type="password" />
        </el-form-item>
        <el-form-item v-if="!buttonFlag" label="密码">
          <el-input v-model="temp.userPassword" size="medium" placeholder="请输入" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
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
import { getPersonInfo, addPersonInfo, updatePersonInfo, deletePersonInfo } from '@/api/personInfo'
export default {
  name: 'PersonInfo',
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
      fromTitle: '',
      type: [{
        value: '超级管理员',
        label: '超级管理员'
      }, {
        value: '技术主管',
        label: '技术主管'
      }, {
        value: '销售',
        label: '销售'
      }, {
        value: '检测员',
        label: '检测员'
      }],
      depart: [{
        value: '管理者',
        label: '管理者'
      }, {
        value: '科研部',
        label: '科研部'
      }, {
        value: '市场部',
        label: '市场部'
      }, {
        value: '化学实验室',
        label: '化学实验室'
      }, {
        value: '物理实验室',
        label: '物理实验室'
      }, {
        value: '剖析实验室',
        label: '剖析实验室'
      }],
      dialogStatus: '',
      buttonFlag: true,
      total: 1,
      delList: [],
      roleType: false
    }
  },
  created() {
    this.fetchData()
    if (localStorage.getItem('userType') === '超级管理员') {
      this.roleType = true
    }
  },
  activated() {
    this.tableDoLayout()
  },
  methods: {
    tableDoLayout() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.personInfo.doLayout()
        })
      }, 0)
    },
    fetchData() {
      this.listLoading = true
      getPersonInfo({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        userName: ''
      }, 'GET').then((response) => {
        this.tableList = response.data
        this.total = response.count
        this.listLoading = false
        this.tableDoLayout()
      })
    },
    handleCreate() {
      this.temp = {
        userId: '',
        userName: '',
        userQqNum: '',
        userEmail: '',
        userPhone: '',
        userDepart: '',
        userType: ''
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
      deletePersonInfo(this.delList, 'POST').then((response) => {
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
        userName: ''
      }
    },
    commmitSearchUser() {
      this.fetchData()
    },
    download() {

    },
    handleClick(row) {
      this.dialogFormVisible = true
      this.fromTitle = '编辑'
      this.buttonFlag = true
      this.dialogStatus = 'update'
      this.temp = {
        userId: row.userId === undefined ? '' : row.userId,
        userName: row.userName === undefined ? '' : row.userName,
        userQqNum: row.userQqNum === undefined ? '' : row.userQqNum,
        userEmail: row.userEmail === undefined ? '' : row.userEmail,
        userPhone: row.userPhone === undefined ? '' : row.userPhone,
        userDepart: row.userDepart === undefined ? '' : row.userDepart,
        userType: row.userType === undefined ? '' : row.userType,
        Id: row.Id === undefined ? '' : row.Id
      }
    },
    delUser(user) {
      this.$confirm('确认删除该用户?', '提示', {
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
      deletePersonInfo([params], 'POST').then((response) => {
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
      getPersonInfo({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        userName: this.searchList.userName
      }, 'GET').then((response) => {
        this.tableList = response.data
        this.total = response.count
        this.listLoading = false
        this.showSearch = false
      })
    },
    handleSelectionChange(val) {
      // 每次清空数组
      this.delList = []
      // 遍历循环对象，得到userId
      for (let i = 0; i < val.length; i++) {
        // 推送进删除数组中
        this.delList.push({ Id: val[i].Id })
      }
    },
    createData() {
      if (!this.temp.userId) {
        this.$message({
          type: 'error',
          message: '请输入用户ID'
        })
        return
      }
      if (!this.temp.userName) {
        this.$message({
          type: 'error',
          message: '请输入用户名字'
        })
        return
      }
      if (!this.temp.userDepart) {
        this.$message({
          type: 'error',
          message: '请选择用户部门'
        })
        return
      }
      if (!this.temp.userType) {
        this.$message({
          type: 'error',
          message: '请输入用户职位'
        })
        return
      }
      if (!this.temp.userType) {
        this.$message({
          type: 'error',
          message: '请输入用户职位'
        })
        return
      }
      if (!this.temp.userPassword) {
        this.$message({
          type: 'error',
          message: '请输入用户密码'
        })
        return
      }
      addPersonInfo(this.temp, 'POST').then((response) => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '新增用户成功'
        })
      })
    },
    updateData() {
      if (!this.temp.userName) {
        this.$message({
          type: 'error',
          message: '请输入用户名字'
        })
        return
      }
      if (!this.temp.userDepart) {
        this.$message({
          type: 'error',
          message: '请选择用户部门'
        })
        return
      }
      if (!this.temp.userType) {
        this.$message({
          type: 'error',
          message: '请输入用户职位'
        })
        return
      }
      if (!this.temp.userType) {
        this.$message({
          type: 'error',
          message: '请输入用户职位'
        })
        return
      }
      updatePersonInfo(this.temp, 'POST').then((response) => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '编辑用户成功'
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
