<template>
  <PsychPane name="welcome" v-slot="data">
    <div class="welcome">
      {{ data.message }}
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane } from '../../../vue-psych'
</script>

<style scoped>
.welcome {
  height: 100vh;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>