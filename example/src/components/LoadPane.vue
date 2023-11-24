<template>
  <PsychPane type="loading">
    <div class="loading-container">
      <Loading/>
      <button @click="next">下一步</button>
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane, usePsych } from 'vue-psych'
import Loading from './Loading.vue'

const psych = usePsych()

function next() {
  psych.next()
}
</script>

<style>
.loading-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
</style>
