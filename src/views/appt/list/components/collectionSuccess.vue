<template>
    <div class="header">
        <span>&emsp;&emsp;&emsp;缴费成功</span>
        <div class="slice"></div>
        <div class="form-button">
            <el-button style="background-color: #606266; color: #fff" @click="cancel()">返回</el-button>
            <el-button type="primary" @click="confirm()">打印收据</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, onMounted, ref, getCurrentInstance } from 'vue';

const { proxy }: any = getCurrentInstance();

// 确认事件
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
    left: 100px;
}

.slice {
    margin: 20px 0;
    height: 1px;
    line-height: 9px;
    border-left: 340px solid #ccc;
    text-align: center;
}
</style>