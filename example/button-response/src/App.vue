<template>
  <div class="container">
    <ColorSelect/>
    <SingleSelect/>
    <LoadPane/>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProviderPsych } from '../../vue-psych'
import ColorSelect from '@/components/ColorSelect.vue'
import SingleSelect from '@/components/SingleSelect.vue'
import LoadPane from '@/components/LoadPane.vue'

const psych = useProviderPsych({
  onFinish() {
    console.log('实验结束')
    console.log('psych.trials')
    console.log(psych.getTrialNodes())
  }
})

// const timeline = 
onMounted(() => {
  psych.run([
    {
      name: 'colorSelect',
      data: {
        message: '该文字是什么颜色',
        text: 'Green',
        count: 0,
        correctResponse: 'red',
        options: ['red', 'blue', 'green']
      }
    },
    {
      name: 'colorSelect',
      data: {
        message: '该文字是什么颜色',
        text: 'Red',
        count: 0,
        correctResponse: 'blue',
        options: ['red', 'blue', 'green']
      }
    },
    {
      name: 'colorSelect',
      data: {
        message: '该文字是什么颜色',
        text: 'Blue',
        count: 0,
        correctResponse: 'green',
        options: ['red', 'blue', 'green']
      },
      onFinish() {
        console.log('psych.trials')
        console.log(psych.getTrialNodes())
      }
    },
    {
      timeline: [
        {
          name: 'loading',
          trialDuration: 3000
        },
        {
          name: 'singleSelect',
          data: {
            options: ['选项1', '选项2', '选项3', '选项4', '选项5'],
            m: psych.variables('message')
          }
        }
      ],
      timelineVariables: [
        { message: '抛硬币时，你更倾向于选择正面还是反面？' },
        { message: '当面对困难时，你更倾向于积极应对还是回避？' },
        { message: '在社交场合中，你更喜欢与大群人交流还是与少数亲密的朋友交流？' },
        { message: '当面对压力时，你的典型反应是冷静思考还是情绪激动？' },
        { message: '你更喜欢安排详细的计划和日程安排，还是更喜欢灵活应对变化？' },
      ],
      onFinish() {
        console.log('当前试次结束')
      }
    },
    {
      name: 'colorSelect',
      data: {
        message: '该文字是什么颜色',
        text: 'origin',
        count: 0,
        correctResponse: 'origin',
        options: ['red', 'blue', 'origin']
      }
    },
  ]
  )
})
</script>
