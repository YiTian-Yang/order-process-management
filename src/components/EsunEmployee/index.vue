<template>
  <div>
    <el-scrollbar style="height:60vh">
      <div style="border:1px solid #e6e9e6;display:flex;justify-content: space-between;margin:0px 30px;height:59vh">
        <div style="width:50%;border-right:1px solid #e6e9e6;">
          <div style="padding:10px;background-color:#FAFAFA;font-weight:bold;font-size:small">
            组织架构
          </div>
          <div>
            <div class="search">
              <img src="@/icons/svg/organizationSearch.png" style="position:absolute;z-index:999;margin:16px 0 0 14px">
              <el-select
                ref="headerSearchSelect"
                v-model="search"
                style="padding:10px;width:100%;"
                :remote-method="querySearch"
                filterable
                :loading="loading"
                default-first-option
                remote
                :placeholder="lang.searchContent"
                class="header-search-select"
                @change="change"
              >
                <el-option v-for="item in newOptions" :key="item.code" :label="item.description" :value="item" filter-method="filterMethod">
                  <span v-if="item.description" style="float: left">{{ item.description }}</span>
                  <span v-if="!item.description" style="float: left">{{ item.name }}</span>
                  <span v-if="item.description" style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                  <span v-if="!item.description" style="float: right; color: #8492a6; font-size: 13px">{{ item.departmentName }}</span>
                </el-option>
              </el-select>
            </div>
            <el-scrollbar style="height: calc(59vh - 92px);">
              <el-tree
                ref="tree"
                :data="data"
                :props="defaultProps"
                node-key="code"
                :default-expanded-keys="expandedKey"
                style="color: rgba(0,0,0,0.85)"
                @node-click="handleNodeClick"
              >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <span>
                    <svg-icon v-if="data.childrenType === 1" icon-class="department" />
                    <svg-icon v-else icon-class="employee" />
                    {{ node.label }}
                  </span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
        <div style="width:50%">
          <div style="padding:10px;background-color:#FAFAFA;display:flex;justify-content: space-between;margin-bottom: 12px">
            <span style="font-weight:bold;font-size:small">已选择</span>
            <span style="font-weight:bold;font-size:small;cursor: pointer" @click="deleteAllEmployee">清空</span>
          </div>
          <el-scrollbar style="height:calc(59vh - 50px);">
            <transition-group name="el-fade-in">
              <div v-for="(item,index) in tableOptions" :key="item.id" class="table-options">
                <el-row v-if="item.childrenType === 2">
                  <el-col :span="8">
                    <div style="color: rgba(0,0,0,0.85); font-size: 14px; margin-left:12px;line-height:30px">{{ item.name }}</div>
                  </el-col>
                  <el-col :span="14">
                    <div style="font-size: 8px;line-height:30px">{{ item.departmentName }}</div>
                  </el-col>
                  <el-col :span="2">
                    <div style="height:30px;padding:3px">
                      <img src="@/icons/deleteEmployee.png" style="cursor: pointer;height:22px" @click="deleteEmployee(index,item)">
                    </div>
                  </el-col>
                </el-row>
                <el-row v-if="item.childrenType === 1">
                  <el-col v-show="item.tableLabel===''" :span="22">
                    <div style="color: rgba(0,0,0,0.85); font-size: 14px; margin-left:12px;line-height:30px">{{ item.description }}</div>
                  </el-col>
                  <el-col v-show="item.tableLabel!==''" :span="8">
                    <div style="color: rgba(0,0,0,0.85); font-size: 14px; margin-left:12px;line-height:30px">{{ item.description }}</div>
                  </el-col>
                  <el-col v-show="item.tableLabel!==''" style="font-size: 8px;line-height:30px" :span="14">
                    <div>{{ item.tableLabel }}</div>
                  </el-col>
                  <el-col :span="2">
                    <div style="height:30px;padding:3px">
                      <img src="@/icons/deleteEmployee.png" style="cursor: pointer;height:22px" @click="deleteEmployee(index,item)">
                    </div>
                  </el-col>
                </el-row>
              </div>
            </transition-group>
          </el-scrollbar>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
export default {
  name: 'EsunEmployee',
  props: {
    data: {
      required: true,
      type: Array
    },
    type: {
      required: true,
      type: Boolean
    },
    parentTableOptions: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      lang: {
        searchContent: this.$t('lang.searchContent')
      },
      defaultProps: {
        children: 'children',
        label: function (data, node) {
          // console.log(data)
          // console.log(node)
          return data.description === undefined ? data.name : data.description
        }
      },
      expandedKey: [],
      // data: [],
      newOptions: [],
      search: '',
      loading: false,
      num: 0,
      k: -1,
      counter: -1,
      searchTemp: {},
      chooseDialog: true,
      listOptions: [],
      tableOptions: [],
      employeeNameList: '',
      departmentNameList: ''
    }
  },
  created() {
    if (this.parentTableOptions) {
      this.tableOptions = this.parentTableOptions
    }
    if (this.type === true) {
      this.concatArray(this.data)
    } else {
      // 只有部门
      this.defaultProps = {
        children: 'children',
        label: 'description'
      }
    }
    this.listOptions = JSON.parse(JSON.stringify(this.data))
    this.treeToTable(this.listOptions)
  },
  methods: {
    // 转列表结构
    treeToTable(data) {
      console.log(data)
      for (let i = this.num; i < data.length; i++) {
        if (data[i].children) {
          for (let j = 0; j < data[i].children.length; j++) {
            this.listOptions.push(data[i].children[j])
            this.k++
          }
        }
      }
      this.num += this.k
      if (this.num < data.length) {
        this.treeToTable(data)
      }
    },
    // 合并数组
    concatArray(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].employeeList !== '' && data[i].employeeList !== undefined) {
          data[i].id = -data[i].id
          data[i].children = [...data[i].children, ...data[i].employeeList]
          data[i].employeeList.splice(0, data[i].employeeList.length)
          if (data[i].children) {
            this.concatArray(data[i].children)
          }
        } else {
          (
            data[i].code = -data[i].id
          )
        }
      }
    },
    // 清空事件
    deleteAllEmployee() {
      const params = {
        employeeList: '',
        employeeNameList: '',
        departmentNameList: '',
        tableOptions: this.tableOptions
      }
      for (let i = 0; i < this.tableOptions.length; i++) {
        this.counter--
      }
      this.tableOptions = []
      this.$emit('getEmployee', params)
    },
    // 获取左侧树形结构父节点
    findTreeParent(node) {
      console.log(node)
      if (node) {
        if (node.label !== undefined) {
          if (this.tableOptions[this.counter].tableLabel === undefined) {
            this.tableOptions[this.counter].tableLabel = ''
          }
          this.tableOptions[this.counter].tableLabel = ''
          this.tableOptions[this.counter].tableLabel = node.label
          // this.findTreeParent(node.parent)
        }
      }
    },
    // 点击树结事件
    handleNodeClick(data) {
      for (let i = 0; i < this.tableOptions.length; i++) {
        if (data === this.tableOptions[i]) {
          return
        }
      }
      console.log(data)
      this.searchTemp.employeeList = ''
      this.employeeNameList = ''
      this.departmentNameList = ''
      this.counter++
      this.tableOptions.push(data)
      const tree = this.$refs.tree
      if (data.parent !== '1') {
        this.findTreeParent(tree.getNode(data.parent))
      } else {
        this.tableOptions[this.counter].tableLabel = ''
      }
      for (let i = 0; i < this.tableOptions.length; i++) {
        if (this.tableOptions[i].description === undefined) {
          this.searchTemp.employeeList += this.tableOptions[i].name + ','
          this.employeeNameList += this.tableOptions[i].name + ','
        } else {
          this.searchTemp.employeeList += this.tableOptions[i].description + '(全体员工) '
          this.departmentNameList += this.tableOptions[i].description + ','
        }
      }
      this.employeeNameList = this.employeeNameList.substring(0, this.employeeNameList.length - 1)
      this.departmentNameList = this.departmentNameList.substring(0, this.departmentNameList.length - 1)
      const params = {
        employeeList: this.searchTemp.employeeList,
        tableOptions: this.tableOptions,
        employeeNameList: this.employeeNameList,
        departmentNameList: this.departmentNameList
      }
      console.log(params)
      this.$emit('getEmployee', params)
    },
    // 删除图标删除事件
    deleteEmployee(index) {
      this.tableOptions[index].tableLabel = ''
      this.tableOptions.splice(index, 1)
      this.counter--
      this.searchTemp.employeeList = ''
      this.employeeNameList = ''
      this.departmentNameList = ''
      for (let i = 0; i < this.tableOptions.length; i++) {
        if (this.tableOptions[i].description === undefined) {
          this.searchTemp.employeeList += this.tableOptions[i].name + ','
          this.employeeNameList += this.tableOptions[i].name + ','
        } else {
          this.searchTemp.employeeList += this.tableOptions[i].description + '(全体员工) '
          this.departmentNameList += this.tableOptions[i].description + ','
        }
      }
      const params = {
        employeeList: this.searchTemp.employeeList,
        tableOptions: this.tableOptions,
        employeeNameList: this.employeeNameList,
        departmentNameList: this.departmentNameList
      }
      this.employeeNameList = this.employeeNameList.substring(0, this.employeeNameList.length - 1)
      this.departmentNameList = this.departmentNameList.substring(0, this.departmentNameList.length - 1)
      this.$emit('getEmployee', params)
      console.log(params)
    },
    // 搜索框改变值事件
    change(data) {
      console.log(data)
      this.search = ''
      this.newOptions = ''
      this.expandedKey = []
      this.expandedKey.push(parseInt(data.code))
    },
    // 查询部门及员工
    querySearch(query) {
      console.log(this.search)
      // 建立fuse查询
      this.fuse = new Fuse(this.listOptions, {
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'name'
        }, {
          name: 'description'
        }]
      })
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          const list = []
          for (let i = 0; i < this.fuse.search(query).length; i++) {
            list.push(this.fuse.search(query)[i].item)
          }
          this.newOptions = list
          // console.log(this.newOptions)
        }, 200)
      }
    }
  }
}
</script>

<style scoped>
  .table-options :hover{
    background-color: #FAFAFA;
  }
</style>
