<template>
  <PsychPane name="colorSelect" v-slot="data" :on-start="onStart" :on-finish="onFinish">
    <div class="content">
      <h2>{{ data.message }}</h2>
      <h2 :style="{ color: data.correctResponse }">{{ data.text }}</h2>
      <div class="options">
        <button
          v-for="item, index in data.options"
          :key="index"
          :loading="index === 2"
          @click="onClick"
        >{{ item }}</button>
        <button @click="toSelect">跳转选择题</button>
      </div>
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PsychPane, usePsych } from '../../../vue-psych'
import ColorChild from './ColorChild.vue'

const backgroundColor = ref<string | null>(null)
const psych = usePsych()

function onStart() {
  console.log('颜色选择，实验开始')
  backgroundColor.value = Math.floor(Math.random() * 11) > 5 ? 'red' : 'blue'
}

function onFinish() {
  console.log('颜色选择，实验结束')
}

function onClick() {
  psych.trigger('click')
  psych.next()
}

function toSelect() {
  psych.to(3, 0)
}
</script>

<style scoped>
.content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.options {
  display: flex;
  gap: 12px;
}

button {
  cursor: pointer;
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
}
button:hover {
  background-color: #ddd;
  border-color: #aaa;
}
</style>
