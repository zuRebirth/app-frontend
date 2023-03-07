<template>
  <div class="header">
    <el-form>
      <el-row>
        <el-form-item label="上传文件">
          <el-col :span="20">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="true"
              :before-upload="beforeUpload"
              :on-change="handleChange"
              accept=".xls,.xlsx"
              drap
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
          <el-col :span="4" class="position">
            <el-button type="text" @click="download()">下载模板</el-button>
          </el-col>
          <el-col :span="24">
            <div class="el-upload__tip">
              只能上传excel文件，且一次只能上传1个excel文件
            </div>
          </el-col>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="form-button">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="confirm()">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { excelDownload } from '@/utils/excel';
import { ElMessage } from 'element-plus';
import { getCurrentInstance, reactive, toRefs } from 'vue';

const { proxy }: any = getCurrentInstance();

const state = reactive({
  fileList: ''
});
const { fileList } = toRefs(state);
function download() {
  // this.$Api.excel.basicItemDownload().then(function (res) {
  //   excelDownload(res, '模板.xlsx');
  // });
}
function handleChange(file: any, fileList: any) {
  if (fileList.length > 1) {
    fileList.splice(0, 1);
  }
  fileList = file.raw;
}
// 文件校验
function beforeUpload(file: any) {
  var FileExt = file.name.replace(/.+\./, '');
  if (['xls', 'xlsx'].indexOf(FileExt.toLowerCase()) === -1) {
    ElMessage({
      type: 'warning',
      message: '请上传后缀名为xlsx、xls的附件！'
    });
    return false;
  }
}
function handleExceed(files: any, fileList: any) {
  ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      files.length + fileList.length
    } 个文件`
  );
}
function confirm() {
  proxy.$attrs.events.confirm();
}
function cancel() {
  proxy.$attrs.events.cancel();
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
}
.form-button {
  float: right;
  margin-top: 20px;
  right: 0;
}
.position {
  position: absolute;
  top: 0;
  left: 100px;
}
</style>
