<template>
  <PsychPane name="instructions">
    <div class="instructions">
      <p>在本次实验中，屏幕中心会出现一个圆。</p><p>如果圆是<strong>蓝色</strong>，则你需要尽可能快的按下 "F" 键。</p>
      <p>如果圆是<strong>橙色</strong>，你需要以最快的速度按下 "J" 键。</p>
      <div style="width: 700px; display: flex; justify-content: center;">
      <div style="display: flex; flex-direction: column; align-items: center;">
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

<style scoped>
.instructions {
  text-align: center;
}
.blue, .orange {
  width: 280px;
  height: 280px;
  border-radius: 140px;
}
</style>