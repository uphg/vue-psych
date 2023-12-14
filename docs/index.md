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

## API

### useProviderPsych

```ts
const psych = useProviderPsych(options)

psych.run([])
```

### usePsych

```ts
const psych = usePsych()

psych.setData(...)
psych.to(0, 1)
psych.getTrialNodes()
```

### variables

```js
import { usePsych } from 'vue-psych'

const psych = usePsych()

psych.variables()
```

or 

```js
import { variables } from 'vue-psych'

variables()
```

## Plugins

### keyboardResponse

```js

```