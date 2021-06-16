<template>
  <el-button :type="bType" :size="bSize" :plain="bPlain" :icon="bIcon" @click="clceked()">{{ msg }}</el-button>
</template>
<script>
export default {
  name: 'YangButton',
  props: {
    buttonType: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      bType: '',
      bSize: 'medium',
      bIcon: '',
      bPlain: false,
      msg: ''
    }
  },
  mounted() {
    if (this.buttonType.toUpperCase() === 'ADD') {
      this.bType = 'primary'
      this.bIcon = 'el-icon-plus'
      this.msg = '新增'
      return
    }
    if (this.buttonType.toUpperCase() === 'DEL') {
      this.bType = 'danger'
      this.bPlain = true
      this.msg = '删除'
      this.bIcon = 'el-icon-delete'
      return
    }
    if (this.buttonType.toUpperCase() === 'LOOKFOR') {
      this.bType = ''
      this.bPlain = true
      this.msg = '查找'
      this.bIcon = 'el-icon-search'
      return
    }
    if (this.buttonType.toUpperCase() === 'COMMIT') {
      this.bType = ''
      this.bPlain = true
      this.msg = '刷新'
      this.bIcon = 'el-icon-refresh-right'
      return
    }
    if (this.buttonType.toUpperCase() === 'DOWNLOAD') {
      this.bType = ''
      this.bPlain = true
      this.msg = '下载'
      this.bIcon = 'el-icon-download'
      return
    }
    if (this.buttonType.toUpperCase() === 'EXPORTXLS') {
      this.bType = ''
      this.bPlain = true
      this.msg = '导出'
      this.bIcon = 'el-icon-download'
      return
    }
    if (this.buttonType.toUpperCase() === 'APPROVE') {
      this.bType = ''
      this.bPlain = true
      this.msg = this.$t('lang.approve')
      this.bIcon = 'el-icon-s-order'
      return
    }
    if (this.buttonType.toUpperCase() === 'CALCULATE') {
      this.bType = 'primary'
      this.msg = this.$t('lang.calculate')
      this.bIcon = 'el-icon-edit'
      return
    }
    if (this.buttonType.toUpperCase() === 'SALARY') {
      this.bType = ''
      this.bPlain = true
      this.msg = this.$t('lang.articleSalary')
      this.bIcon = 'el-icon-document'
      return
    }
  },
  methods: {
    clceked() {
      this.$emit('buttonClick')
    }
  }
}
</script>
<style >
</style>
