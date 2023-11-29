# vue-psych

Psychological experiment process encapsulation, referenced from [jspsych](https://www.jspsych.org/)

## Install

```bash
pnpm add vue-psych
```

## Usage

usage example

```html
<template>
  <div class="container">
    <PsychPane name="color" v-slot="data">
      <h2>{{ data.message }}</h2>
      <h2 :style="{ color: data.color }">{{ data.text }}</h2>
      <div class="options">
        <button
          v-for="item, index in data.options" :key="index"
          @click="onClick"
        >{{ item }}</button>
      </div>
    </PsychPane>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProviderPsych, PsychPane } from 'vue-psych'

const psych = useProviderPsych()
const timeline = [
  {
    name: 'color',
    data: {
      message: '该文字是什么颜色',
      text: 'Green',
      color: 'red',
      options: ['red', 'blue', 'green']
    }
  },
  {
    name: 'color',
    data: {
      message: '该文字是什么颜色',
      text: 'Red',
      color: 'blue',
      options: ['red', 'blue', 'green']
    }
  },
  {
    name: 'color',
    data: {
      message: '该文字是什么颜色',
      text: 'Blue',
      color: 'green',
      options: ['red', 'blue', 'green']
    }
  }
]

onMounted(() => {
  psych.run(timeline)
})
</script>
```