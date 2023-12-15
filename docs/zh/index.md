---
# https://vitepress.dev/reference/default-theme-home-page
outline: deep
---

# Vue Psych

心理实验流程组件，使用 Vue 实现。

## 安装

```bash
pnpm add vue-psych
```

## 用法

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

## 一个反应时间实验

创建 welcome 实验节点，并使用 keyboardResponse 插件

```js
import { keyboardResponse } from 'vue-psych'

const welcome = {
  name: 'welcome',
  type: keyboardResponse,
  choices: [' ']
}
```

使用 PsychPane 组件渲染该对象，注意 name 要与上面的对象对应

```vue
<!-- Welcome.vue -->
<template>
  <PsychPane name="welcome">
    <div class="welcome">
      欢迎参加本次实验，按空格键开始。
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane } from 'vue-psych'
</script>
```

创建 instructions 实验节点

```js
import { keyboardResponse } from 'vue-psych'

const instructions = {
  name: 'instructions',
  type: keyboardResponse,
  choices: [' ']
}
```

使用 PsychPane 渲染对应节点，注意 name 要对应

```vue
<!-- Instructions.vue -->
<template>
  <PsychPane name="instructions">
    <div class="instructions">
      <p>在本次实验中，屏幕中心会出现一个圆。</p><p>如果圆是<strong>蓝色</strong>，则你需要尽可能快的按下 "F" 键。</p>
      <p>如果圆是<strong>橙色</strong>，你需要以最快的速度按下 "J" 键。</p>
      <div style="width: 700px; display: flex; justify-content: center;">
      <div style="display: flex; flex-direction: column; align-items: center; margin-right: 12px;">
        <div class="blue" :style="{ backgroundColor: 'blue' }"></div>
        <p class="small"><strong>按 "F" 键</strong></p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div class="orange" :style="{ backgroundColor: 'orange' }"></div>
        <p class="small"><strong>按 "J" 键</strong></p>
      </div>
      </div>
      <p>按空格键开始。</p>
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane } from 'vue-psych'
</script>
```

添加注视点（+）

```js
const fixation = {
  name: 'fixation',
  trialDuration: 500
}
```

```vue
<!-- Fixation.vue -->
<template>
  <PsychPane name="fixation">
    <div style="font-size: 60px;"> + </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane } from 'vue-psych'
</script>
```

创建刺激物

```js
const test = {
  name: 'test',
  type: keyboardResponse,
  choices: ['f', 'j'],
  data: {
    color: psych.variables('color'),
    correctResponse: psych.variables('correctResponse')
  },
  onFinish(test) {
    const key = test.records.events[0].key
    psych.setData({ correct: key === test.trialData.correctResponse })
  }
}
```

```vue
<!-- Test.vue -->
<template>
  <PsychPane name="test" v-slot="data">
    <div class="block" :style="{ backgroundColor: data.color }"></div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane } from 'vue-psych'
</script>
```

创建实验组节点，该节点会根据 timelineVariables 列表重复 timeline 的实验节点列表

```js
const testProcedure = {
  timeline: [fixation, test],
  timelineVariables: [
    { color: 'blue', correctResponse: 'f' },
    { color: 'orange', correctResponse: 'j' },
    { color: 'blue', correctResponse: 'f' },
    { color: 'orange', correctResponse: 'j' },
    { color: 'blue', correctResponse: 'f' }
  ]
}
```

运行实验

```vue
<template>
  <div class="container">
    <Welcome/>
    <Instructions/>
    <Fixation/>
    <Test/>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useProviderPsych } from 'vue-psych'
import Welcome from './Welcome.vue'
import Instructions from './Instructions.vue'
import Fixation from './Fixation.vue'
import Test from './Test.vue'

const psych = useProviderPsych()

onMounted(() => {
  psych.run([welcome, instructions, testProcedure])
})
</script>
```

本实验案例源码见[keyboard-response](https://github.com/uphg/vue-psych/tree/master/example/keyboard-response)
