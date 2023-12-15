# API

## useProviderPsych

注入实验节点实例

### 类型

```ts
useProviderPsych(options?: ProviderPsychOptions): Psych
```

### 参数

options 选项参数（可选）

| 名称     | 类型         | 说明           |
| -------- | ------------ | -------------- |
| onStart  | `() => void` | 实验开始时运行 |
| onFinish | `() => void` | 实验结束时运行 |


### 示例

```vue{11}
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


## usePsych

获取当前实验节点对象（该方法必须在 useProviderPsych 注入的子组件中运行，详见[示例](https://github.com/uphg/vue-psych/tree/master/example/keyboard-response)）

### 类型

```ts
usePsych(): Psych
```

### 示例

```ts
const psych = usePsych()

// 获取data
psych.setData(...)

// 跳转指定实验节点
psych.to(0, 1)

// 获取所有实验节点对象
psych.getTrialNodes()
```

## variables

创建 timelineVariables 变量引用

### 类型

```ts
psych.variables(key: string): void
```

### 参数

| 名称 | 类型     | 说明                           |
| ---- | -------- | ------------------------------ |
| key  | `string` | timelineVariables 对应数据 key |

### 示例

```js
import { usePsych } from 'vue-psych'

const psych = usePsych()

const test = {
  name: 'test',
  type: keyboardResponse,
  choices: ['f', 'j'],
  data: {
    color: psych.variables('color'),
    correctResponse: psych.variables('correctResponse')
  }
}

const testProcedure = {
  timeline: [test],
  timelineVariables: [
    { color: 'blue', correctResponse: 'f' },
    { color: 'orange', correctResponse: 'j' },
    { color: 'blue', correctResponse: 'f' },
    { color: 'orange', correctResponse: 'j' },
    { color: 'blue', correctResponse: 'f' }
  ]
}

onMounted(() => {
  psych.run([testProcedure])
})
```

也可以直接使用导出的 variables 方法

```js
import { usePsych, variables } from 'vue-psych'

const psych = usePsych()

const test = {
  name: 'test',
  type: keyboardResponse,
  choices: ['f', 'j'],
  data: {
    color: variables('color'),
    correctResponse: variables('correctResponse')
  }
}

const testProcedure = {
  timeline: [test],
  timelineVariables: [
    { color: 'blue', correctResponse: 'f' },
    { color: 'orange', correctResponse: 'j' },
    { color: 'blue', correctResponse: 'f' },
    { color: 'orange', correctResponse: 'j' },
    { color: 'blue', correctResponse: 'f' }
  ]
}

onMounted(() => {
  psych.run([testProcedure])
})
```

## psych.run

运行实验（默认会从第一个节点开始运行）

### 类型

```ts
psych.run(timeline: TimelineNode[], location?: [number, number]): void
```

### 参数

| 名称     | 类型               | 描述                                                         |
| -------- | ------------------ | ------------------------------------------------------------ |
| timeline | `TimelineNode[]`   | 实验节点列表                                                 |
| location | `[number, number]` | 实验运行位置，第一个为 Timeline 节点索引，第二个为子节点索引（存在 timelineVariables 的情况） |


### 示例

```vue{17}
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

## psych.next

跳转下一个实验节点。

### 类型

```ts
psych.next(): void
```

### 示例

```vue{21}
<template>
  <PsychPane name="colorSelect">
    <div class="content">
      <h2>该文字是什么颜色</h2>
      <h2 :style="{ color: 'red' }">Green</h2>
      <div class="options">
        <button @click="onClick('red')">red</button>
        <button @click="onClick('blue')">blue</button>
        <button @click="onClick('green')">green</button>
      </div>
    </div>
  </PsychPane>
</template>
<script setup lang="ts">
import { PsychPane, usePsych } from 'vue-psych'

const psych = usePsych()

function onClick(color: string) {
  psych.trigger('click')
  psych.next()
}
</script>
```

## psych.setData

设置当前实验对象的 data 值

### 类型

```ts
psych.setData(data: Record<string, any>): void
```

### 参数

| 名称 | 类型                  | 描述                                                   |
| ---- | --------------------- | ------------------------------------------------------ |
| data | `Record<string, any>` | 要修改的数据，以对象形式传入，会自动并入最终 data 对象 |

### 示例

本示例使用 setData 设置反应时间实验的结果

```js
const fixation = {
  name: 'fixation',
  trialDuration: 500
}

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

注：setData 传入的对象会合并至最终实验节点的 trialData 属性中

## psych.trigger

记录触发的事件

### 类型

```ts
psych.trigger(eventName: string, options?: Record<string, any>): void;
```

### 参数

| 名称      | 类型                  | 描述                                     |
| --------- | --------------------- | ---------------------------------------- |
| eventName | `string`              | 事件名称                                 |
| options   | `Record<string, any>` | 可选数据对象，会记录在最终实验节点对象中 |


### 示例

```vue
<template>
  <PsychPane name="colorSelect">
    <div class="content">
      <h2>该文字是什么颜色</h2>
      <h2 :style="{ color: 'red' }">Green</h2>
      <div class="options">
        <button @click="onClick('red')">red</button>
        <button @click="onClick('blue')">blue</button>
        <button @click="onClick('green')">green</button>
      </div>
    </div>
  </PsychPane>
</template>
<script setup lang="ts">
import { PsychPane, usePsych } from 'vue-psych'

const psych = usePsych()

function onClick(color: string) {
  psych.trigger('click', { color: 'red' })
  psych.next()
}
</script>
```

上面代码中, trigger 的 options 参数表示可选参数，可以是一个自定义对象，会记录在最终实验节点对象中。

