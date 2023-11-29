<template>
  <PsychPane name="colorSelect" v-slot="data">
    <div class="content">
      <h2>{{ data.message }}</h2>
      <h2 :style="{ color: data.correctResponse }">{{ data.text }}</h2>
      <h3>{{ data.count }}</h3>
      <Button @click="add">+1</Button>
      <div class="options">
        <Button
          v-for="item, index in data.options"
          :key="index"
          :loading="index === 2"
          @click="onClick"
        >{{ item }}</Button>
      </div>
    </div>
  </PsychPane>
</template>

<script setup lang="ts">
import { PsychPane, usePsych, Button } from '../../../vue-psych'

const psych = usePsych()

function onClick() {
  psych.trigger('click')
  psych.next()
}

function add() {
  const data = psych.getData()
  psych.setData({ count: (data.count as number) += 1 })
}
</script>

<style scoped>
.content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.options {
  display: flex;
  gap: 12px;
}

button {
  cursor: pointer;
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
}
button:hover {
  background-color: #ddd;
  border-color: #aaa;
}
</style>
