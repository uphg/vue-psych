# Plugins

插件集合

## keyboardResponse

按键响应插件

### 类型

```ts
keyboardResponse(): PsychPluginReturn
```

### 示例

创建一个带有空格响应的欢迎页

```vue
<template>
  <PsychPane name="welcome">
    <div class="welcome">
      欢迎参加本次实验，按空格键开始。
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProviderPsych, keyboardResponse } from 'vue-psych'

const psych = useProviderPsych()

const welcome = {
  name: 'welcome',
  type: keyboardResponse,
  choices: [' ']
}

onMounted(() => {
  psych.run([welcome])
})
</script>
```
