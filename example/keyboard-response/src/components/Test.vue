<template>
  <PsychPane name="test" v-slot="data">
    <div>
      {{ data.color }}
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane } from '../../../vue-psych'
</script>