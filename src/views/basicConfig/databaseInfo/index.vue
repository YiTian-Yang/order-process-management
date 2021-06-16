<template>
  <div class="app-container">
    <div class="filter-container">
      <YangButton v-if="roleType" :button-type="'ADD'" @buttonClick="handleCreate" />
      <YangButton v-if="roleType" :button-type="'DEL'" @buttonClick="delUserMod" />
      <YangButton :button-type="'LOOKFOR'" @buttonClick="showSearchUser" />
      <YangButton :button-type="'COMMIT'" @buttonClick="commmitSearchUser" />
    </div>
    <el-table
      ref="databaseInfo"
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
      <el-table-column prop="libraryId" label="标准ID" sortable>
        <template slot-scope="scope">{{ scope.row.libraryId }}</template>
      </el-table-column>
      <el-table-column prop="libraryType" label="标准类型" sortable>
        <template slot-scope="scope">{{ scope.row.libraryType }}</template>
      </el-table-column>
      <el-table-column prop="libraryName" label="标准名" sortable>
        <template slot-scope="scope">{{ scope.row.libraryName }}</template>
      </el-table-column>
      <el-table-column prop="libraryMethod" label="标准方法" sortable>
        <template slot-scope="scope">{{ scope.row.libraryMethod }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" sortable>
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column prop="libraryText" label="标准信息" sortable>
        <template slot-scope="scope">{{ scope.row.libraryText }}</template>
      </el-table-column>
      <el-table-column prop="libraryPerson" label="标准最新编辑人" sortable>
        <template slot-scope="scope">{{ scope.row.libraryPerson }}</template>
      </el-table-column>
      <el-table-column prop="libraryTime" label="标准最新编辑时间" sortable>
        <template slot-scope="scope">{{ scope.row.libraryTime }}</template>
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
        <el-form-item label="标准ID" required>
          <el-input v-model="temp.libraryId" :disabled="buttonFlag" size="medium" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="标准类型" required>
          <el-select v-model="temp.libraryType" placeholder="请选择" style="width: 100%" :disabled="buttonFlag">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标准名" required>
          <el-input v-model="temp.libraryName" size="medium" placeholder="请输入" :disabled="buttonFlag" />
        </el-form-item>
        <el-form-item label="标准方法" required>
          <el-input v-model="temp.libraryMethod" size="medium" placeholder="请输入" :disabled="buttonFlag" />
        </el-form-item>
        <el-form-item label="标准信息">
          <el-input v-model="temp.libraryText" size="medium" placeholder="请输入" />
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
        <el-form-item label="标准名">
          <el-input v-model="searchList.libraryName"/>
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
import { getLibraryInfo, addLibraryInfo, updateLibraryInfo, deleteLibraryInfo } from '@/api/library'
export default {
  name: 'DatabaseConfig',
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
      type: [{
        value: '标准',
        label: '标准'
      }, {
        value: '非标准',
        label: '非标准'
      }],
      fromTitle: '',
      roleType: false
    }
  },
  created() {
    this.fetchData()
    if (localStorage.getItem('userType') === '超级管理员' || localStorage.getItem('userType') === '技术主管') {
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
          this.$refs.databaseInfo.doLayout()
        })
      }, 0)
    },
    fetchData() {
      this.listLoading = true
      getLibraryInfo({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        libraryName: ''
      }, 'GET').then((response) => {
        this.tableList = response.data
        this.total = response.count
        this.listLoading = false
        this.tableDoLayout()
      })
    },
    getOneUser() {
      this.listLoading = true
      getLibraryInfo({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        libraryName: this.searchList.libraryName
      }, 'GET').then((response) => {
        this.tableList = response.data
        this.total = response.count
        this.listLoading = false
        this.showSearch = false
      })
    },
    delUser(user) {
      this.$confirm('确认删除该标准?', '提示', {
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
      deleteLibraryInfo([params], 'POST').then((response) => {
        this.listLoading = false
        this.showSearch = false
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.fetchData()
      })
    },
    handleCreate() {
      this.temp = {
        libraryId: '',
        libraryType: '',
        libraryName: '',
        libraryMethod: '',
        libraryText: '',
        remark: '',
        libraryTime: this.$moment().locale('zh-cn').format('YYYY-MM-DD'),
        libraryPerson: localStorage.getItem('userName')
      }
      this.buttonFlag = false
      this.dialogFormVisible = true
      this.fromTitle = '新增'
      this.dialogStatus = 'create'
    },
    showSearchUser() {
      this.showSearch = true
      this.searchList = {
        libraryName: ''
      }
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
      deleteLibraryInfo(this.delList, 'POST').then((response) => {
        this.listLoading = false
        this.showSearch = false
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.fetchData()
      })
    },
    createData() {
      if (!this.temp.libraryId) {
        this.$message({
          type: 'error',
          message: '请输入标准ID'
        })
        return
      }
      if (!this.temp.libraryType) {
        this.$message({
          type: 'error',
          message: '请输入标准类型'
        })
        return
      }
      if (!this.temp.libraryName) {
        this.$message({
          type: 'error',
          message: '请选择标准名字'
        })
        return
      }
      if (!this.temp.libraryMethod) {
        this.$message({
          type: 'error',
          message: '请输入标准方法'
        })
        return
      }
      addLibraryInfo(this.temp, 'POST').then((response) => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '新增标准成功'
        })
      })
    },
    handleClick(row) {
      this.dialogFormVisible = true
      this.fromTitle = '编辑'
      this.buttonFlag = true
      this.dialogStatus = 'update'
      this.temp = {
        libraryText: row.libraryText === undefined ? '' : row.libraryText,
        libraryId: row.libraryId === undefined ? '' : row.libraryId,
        libraryMethod: row.libraryMethod === undefined ? '' : row.libraryMethod,
        libraryName: row.libraryName === undefined ? '' : row.libraryName,
        libraryType: row.libraryType === undefined ? '' : row.libraryType,
        remark: row.remark === undefined ? '' : row.remark,
        libraryTime: this.$moment().locale('zh-cn').format('YYYY-MM-DD'),
        libraryPerson: localStorage.getItem('userName'),
        Id: row.Id === undefined ? '' : row.Id
      }
    },
    commmitSearchUser() {
      this.fetchData()
    },
    download() {

    },
    updateData() {
      updateLibraryInfo(this.temp, 'POST').then((response) => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '编辑标准成功'
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
