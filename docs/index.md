---
# https://vitepress.dev/reference/default-theme-home-page
outline: deep
---

# Vue Psych

Psychological experiment process components, implemented with Vue.

## Installation

```bash
pnpm add vue-psych
```

## Usage

```html
<template>
  <div class="container">
    <PsychPane name="welcome">
      <div>Hello world!</div>
    </PsychPane>
  </div>
</template>
<script setup lang="ts">
import { useProviderPsych } from 'vue-psych'

const psych = useProviderPsych()
const helloTrial = {
  name: 'welcome'
}

onMounted(() => {
  psych.run([helloTrial])
})
</script>
```
