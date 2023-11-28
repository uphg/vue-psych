<template>
  <div class="container">
    <Test/>
    <Welcome/>
    <Instructions/>
    <Fixation />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProviderPsych } from '../../vue-psych'
import { keyboardResponse } from '../../vue-psych'
import Test from './components/Test.vue'
import Welcome from './components/Welcome.vue'
import Instructions from './components/Instructions.vue'
import Fixation from './components/Fixation.vue'

const psych = useProviderPsych({
  onFinish() {
    console.log('psych.timelineNodes')
    console.log(psych.getTimelineNodes())
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
  {
    name: 'test',
    type: keyboardResponse,
    choices: ['f', 'j'],
    data: {
      color: 'orange',
      correctResponse: 'j'
    }
  },
  {
    name: 'test',
    type: keyboardResponse,
    choices: ['f', 'j'],
    data: {
      color: 'blue',
      correctResponse: 'k'
    }
  },
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
        onFinish(data: any) {
          psych.setData({ correct: data.response === data.correctResponse })
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
  }
]

onMounted(() => {
  psych.run(timeline)
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