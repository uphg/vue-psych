<template>
  <Part type="singleSelect" v-slot="data">
    <div class="single-select">
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
      <p>{{ data?.m }}</p>
      <div v-for="(item, index) in data?.options" :key="index">
        <label>
          <input type="radio" :value="index" @change="onChange"/>
          <span>{{ item }}</span>
        </label>
      </div>
    </div>
  </Part>
</template>

<script setup lang="ts">
import Part from '@/components/psych/Part'
import type { PropType } from 'vue';

const props = defineProps({
  psych: Object as PropType<Record<string, any>>
})

function onChange() {
  props.psych!.next()
}
</script>