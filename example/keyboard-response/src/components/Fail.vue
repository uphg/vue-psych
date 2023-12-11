<template>
  <PsychPane name="fail" v-slot="data">
    <div class="fail-container">
      <div>{{ data.message }}</div>
      <button @click="reset">重新开始</button>
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane, usePsych } from '../../../vue-psych'

const psych = usePsych()

function reset() {
  psych.setVariables(2, [
    { color: 'orange', correctResponse: 'j' },
    { color: 'blue', correctResponse: 'f' }
  ])
  psych.to(1)
}
</script>

<style>
.fail-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>