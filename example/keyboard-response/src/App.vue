<template>
  <div class="container">
    <Test/>
    <Welcome/>
    <Instructions/>
    <Fixation />
    <Fail/>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// import { useProviderPsych, keyboardResponse } from 'vue-psych'
import { useProviderPsych, keyboardResponse } from '../../vue-psych'
import Test from './components/Test.vue'
import Welcome from './components/Welcome.vue'
import Instructions from './components/Instructions.vue'
import Fixation from './components/Fixation.vue'
import Fail from './components/Fail.vue'

const psych = useProviderPsych({
  onFinish() {
    console.log('psych.getTrialNodes')
    console.log(psych.getTrialNodes?.())
  }
})

const timeline = [
  {
    name: 'welcome',
    type: keyboardResponse,
    choices: [' '],
    data: {
      message: '欢迎参加本次实验，按空格键开始。'
    }
  },
  {
    name: 'instructions',
    type: keyboardResponse,
    choices: [' ']
  },
  // {
  //   name: 'test',
  //   type: keyboardResponse,
  //   choices: ['f', 'j'],
  //   data: {
  //     color: 'orange',
  //     correctResponse: 'j'
  //   }
  // },
  // {
  //   name: 'test',
  //   type: keyboardResponse,
  //   choices: ['f', 'j'],
  //   data: {
  //     color: 'blue',
  //     correctResponse: 'f'
  //   }
  // },
  {
    timeline: [
      {
        name: 'fixation',
        trialDuration: 500
      },
      {
        name: 'test',
        type: keyboardResponse,
        choices: ['f', 'j'],
        data: {
          color: psych.variables('color'),
          correctResponse: psych.variables('correctResponse')
        },
        onFinish(test: any) {
          const key = test.records.events[0].key
          psych.setData({ correct: key === test.trialData.correctResponse })
        }
      }
    ],
    timelineVariables: [
      { color: 'blue', correctResponse: 'f' },
      { color: 'orange', correctResponse: 'j' },
      { color: 'blue', correctResponse: 'f' },
      { color: 'orange', correctResponse: 'j' },
      { color: 'blue', correctResponse: 'f' }
    ],
    failed() {
      console.log('运行 fail')
      console.log(psych.getTrialNodes?.())
      return {
        name: 'fail',
        data: {
          message: '测试未通过，请重新开始'
        }
      }
    }
  }
]

onMounted(() => {
  psych.run(timeline)
  psych.to(1)
})
</script>

<style>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>