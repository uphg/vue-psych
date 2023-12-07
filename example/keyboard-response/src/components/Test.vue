<template>
  <PsychPane name="test" v-slot="data">
    <div class="block" :style="{ backgroundColor: data.color }"></div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane } from 'vue-psych'
</script>

<style scoped>
.block {
  width: 240px;
  height: 240px;
  border-radius: 50%;
}
</style>