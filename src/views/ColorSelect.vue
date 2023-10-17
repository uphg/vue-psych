<template>
  <Part type="colorSelect" v-slot="data">
    <div class="content">
      <h2>{{ data.message }}</h2>
      <h2 :style="{ color: data.correctResponse }">{{ data.text }}</h2>
      <div class="options">
        <button v-for="item, index in data.options" :key="index" @click="onClick()">{{ item }}</button>
      </div>
    </div>
  </Part>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import Part from '@/components/psych/Part'

const props = defineProps({
  psych: Object as PropType<Record<string, any>>
})

function onClick() {
  props.psych?.next()
}
</script>
