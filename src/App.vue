<script setup>
import { ref } from 'vue'
import { beginApi, getInfoApi, getStatusApi, resetApi } from '@/api.js'
import { ElNotification } from 'element-plus'

const info = ref({})
const loading = ref(false)
const TrainList = ref([])
let timer

const getTrainStatus = async () => {
  const req = await getStatusApi()
  TrainList.value = req.data.epochHistory
  console.log(TrainList.value)
  if (req.data.currentStatus === true) {
    ElNotification({
      title: '训练结束',
      message: '训练已结束!',
      type: 'success'
    })
    clearInterval(timer)
    loading.value = false
  }
}

const begin = async () => {
  loading.value = true
  beginApi()
  ElNotification({
    title: '开始训练',
    message: '训练已开始ing!',
    type: 'info'
  })
  timer = setInterval(getTrainStatus, 500)
}

const getInfo = async () => {
  const request = await getInfoApi()
  info.value = request.data
}

const reset = async () => {
  await resetApi()
  TrainList.value = []
  ElNotification({
    title: '数据重置',
    message: '数据已重置',
    type: 'warning'
  })
}

getInfo()

</script>

<template>
  <el-row justify="center">
    <h1 class="grid-content">基于Pytorch的手写数字识别系统</h1>
  </el-row>

  <el-row class="mb-4">
    <h4>参数</h4>
  </el-row>

  <el-descriptions
      class="margin-top"
      :column="2"
      border
  >
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          Cuda可用性
        </div>
      </template>
      <el-tag v-if="info.CUDA" effect="dark" class="ml-2" type="success">可用</el-tag>
      <el-tag v-else class="ml-2" effect="dark" type="danger">不可用</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          MPS可用性
        </div>
      </template>
      <el-tag v-if="info.MPS" effect="dark" class="ml-2" type="success">可用</el-tag>
      <el-tag v-else class="ml-2" effect="dark" type="danger">不可用</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          学习轮次 (epoch)
        </div>
      </template>
      20
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          训练集批次
        </div>
      </template>
      {{ info.train_data_size }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          测试集批次
        </div>
      </template>
      {{ info.test_data_size }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          数据集大小
        </div>
      </template>
      {{ info['len(all_labels)'] }}
    </el-descriptions-item>
  </el-descriptions>
  <el-row class="mb-4">
    <h4>操作</h4>
  </el-row>
  <el-col :span="24">
    <el-card shadow="never">
      <el-row>
        <el-button type="primary" @click="begin()" :loading="loading">开始训练</el-button>
        <el-button type="warning" @click="reset()" :loading="loading">重置数据</el-button>
      </el-row>
    </el-card>
  </el-col>
  <h4>训练数据</h4>
  <el-progress class="progress" :text-inside="true" :stroke-width="26"
               :percentage="Math.trunc(TrainList.length / 20 * 100)"/>
  <el-table
      :data="TrainList"
      style="width: 100%"
      border
  >
    <el-table-column prop="epoch" label="Epoch" width="180"/>
    <el-table-column prop="accuracy" label="Test Accuracy" width="180"/>
    <el-table-column prop="loss" label="Loss"/>
  </el-table>
  <el-row class="footer" justify="center">
    code by &nbsp;<a href="https://wmhwiki.cn">wmh</a>
  </el-row>
</template>

<style scoped>
.progress {
  margin: 20px;
}

.footer {
  margin-top: 30px;
}
</style>
