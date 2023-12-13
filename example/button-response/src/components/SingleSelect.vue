<template>
  <PsychPane name="singleSelect" v-slot="data" :on-start="onStart" :on-finish="onFinish">
    <div class="content">
      <p>{{ data?.m }}</p>
      <div v-for="(item, index) in data?.options" :key="index">
        <label>
          <input type="radio" :value="index" @change="onChange"/>
          <span>{{ item }}</span>
        </label>
      </div>
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane, usePsych } from '../../../vue-psych'

const psych = usePsych()

function onStart() {
  console.log('心理选择题，实验开始')
}

function onFinish() {
  console.log('心理选择题，实验结束')
}

function onChange() {
  psych.next()
}
</script>

<style scoped>
.content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>