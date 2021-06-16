<template>
  <el-upload
    ref="upload"
    :action="baseurl"
    :on-change="changeFile"
    :headers="myHeaders"
    :data="uploadData"
    :on-success="handleSuccess"
    :show-file-list="false"
    :multiple="false"
    accept=".xlsx, .xls"
    style="display: inline;margin-left: 0.3rem;margin-right: 0.3rem;"
  >
    <el-button slot="trigger" plain size="medium" icon="el-icon-upload2">{{ msg }}</el-button>
  </el-upload>
</template>
<script>

import { getToken, getUsername } from '@/utils/auth'
export default {
  name: 'YangUpload',
  props: {
    baseurl: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      myHeaders: {
        userId: getUsername(),
        token: getToken(),
        corpId: '',
        domainID: '',
        departmentId: '',
        programId: ''
      },
      uploadData: {
        name: ''
      },
      msg: ''
    }
  },
  mounted() {
    this.myHeaders.token = getToken()
    this.uploadData.name = getUsername()
    this.msg = this.$t('lang.upload')
  },
  methods: {
    changeFile() {
      this.$emit('changefile')
    },
    handleSuccess(res, file) {
      this.$emit('onsuccess', res)
      // this.$emit('handleSuccess', res)
    }
  }
}
</script>
<style >

</style>
