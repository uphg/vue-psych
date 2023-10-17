<template>
  <div class="container">
    <Psych ref="psych" :timeline="timeline">
      <ColorSelect :psych="psych"/>
    </Psych>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Psych from '@/components/psych/Psych'
import type { PsychComponent } from '@/types';
import ColorSelect from './ColorSelect.vue'

const psych = ref<PsychComponent | undefined>()

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
  psych.value?.run()
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
