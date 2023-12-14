# Vue Psych

Psychological experiment process encapsulation, referenced from [jspsych](https://www.jspsych.org/).

## Install

```bash
pnpm add vue-psych
```

## Usage

usage example

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