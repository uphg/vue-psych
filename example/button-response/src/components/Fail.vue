<template>
  <PsychPane name="fail" v-slot="data">
    <div class="fail-container">
      <div>{{ 'fail 组件' }}</div>
      <div>{{ data.message }}</div>
      <button @click="reset">重新开始</button>
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane, usePsych } from '../../../vue-psych'

const psych = usePsych()

function reset() {
  psych.setVariables(3, [
    { message: '我担心别人对我的评价。' },
    { message: '我避免与陌生人交谈或参加社交活动。' },
  ])
  psych.to(3, 0)
}
</script>