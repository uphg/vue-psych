<template>
  <div class="container">
    <ColorSelect :psych="psych"/>
    <SingleSelect :psych="psych"/>
    <Part type="loading">
      <Loading/>
      <button @click="next">下一步</button>
    </Part>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ColorSelect from './ColorSelect.vue'
import SingleSelect from './SingleSelect.vue';
import Part from '@/components/psych/Part';
import Loading from '@/components/Loading.vue';
import { usePsych } from '@/components/psych/usePsych';

const psych = usePsych()

const timeline = [
  {
    type: 'colorSelect',
    data: {
      message: '该文字是什么颜色',
      text: 'Green',
      correctResponse: 'red',
      options: ['red', 'blue', 'green']
    }
  },
  {
    type: 'colorSelect',
    data: {
      message: '该文字是什么颜色',
      text: 'Red',
      correctResponse: 'blue',
      options: ['red', 'blue', 'green']
    }
  },
  {
    type: 'colorSelect',
    data: {
      message: '该文字是什么颜色',
      text: 'Blue',
      correctResponse: 'green',
      options: ['red', 'blue', 'green']
    }
  },
  {
    timeline: [
      {
        type: 'loading',
        trialDuration: 1000
      },
      {
        type: 'singleSelect',
        data: {
          options: ['选项1', '选项2', '选项3', '选项4', '选项5'],
          m: psych.variables('message')
        }
      }
    ],
    timelineVariables: [
      { message: '我的生活在大多数情况下接近我的理想状态' },
      { message: '我的生活条件非常好' },
      { message: '我对我的生活感到满意' },
      { message: '目前为止我已经得到了生活中我想得到的重要东西' },
      { message: '如果生活可以重来，我还愿意过现在这样的生活' },
    ]
  }
]

function next() {
  psych.next()
}

onMounted(() => {
  psych.run(timeline)
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.options {
  display: flex;
  gap: 12px;
}
</style>
