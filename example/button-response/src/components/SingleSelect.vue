<template>
  <PsychPane name="singleSelect" v-slot="data">
    <div class="content">
      <p>{{ data?.m }}</p>
      <div v-for="(item, index) in data?.options" :key="index">
        <label>
          <input type="radio" :value="index" @change="onChange"/>
          <span>{{ item }}</span>
        </label>
      </div>
      <!-- <pre>{{ JSON.stringify(data, null, 2) }}</pre> -->
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane, onFinish, onStart, usePsych } from '../../../vue-psych'

const psych = usePsych()

onStart(() => {
  console.log('心理选择题，实验开始')
})

onFinish(() => {
  console.log('心理选择题，实验结束')
})

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