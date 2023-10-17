<template>
  <div class="container">
    <Psych ref="psych" :timeline="timeline" v-slot="state">
      <div class="content">
        <h2>{{ state.message }}？</h2>
        <h2 :style="{ color: state.correctResponse }">{{ state.text }}</h2>
        <div class="options">
          <button v-for="item, index in state.options" :key="index" @click="onClick(item)">{{ item }}</button>
        </div>
      </div>
    </Psych>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Psych from '@/components/Psych.vue'
import type { PsychComponent } from '@/types';

const psych = ref<PsychComponent | null>(null)

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
  }
]

onMounted(() => {
  console.log('psych.value')
  console.log(psych.value)
  psych.value?.run()
})

function onClick(item: string) {
  psych.value?.setData({ response: item })
  psych.value?.next()
}
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
