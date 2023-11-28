<template>
  <button
    :class="['p-button', { disabled: disabled || loading }]"
    :style="{
      '--p-color': _theme?.color,
      '--p-color-hover': _theme?.colorHover,
      '--p-color-pressed': _theme?.colorPressed
    }"
    :disabled="disabled || loading" @click="handleClick"
  >
    <LoadingIcon v-if="loading" class="p-loading-icon"/>
    <span><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import LoadingIcon from './LoadingIcon.vue'

const props = defineProps({
  disabled: Boolean,
  loading: Boolean,
  onClick: {
    type: Function,
    default: () => () => void 0
  },
  theme: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({})
  }
})

const _theme = props.theme
  ? Object.assign({}, {
      color: '#18a058',
      colorHover: '#36ad6a',
      colorPressed: '#0c7a43',
    }, props.theme) as Record<string, string>
  : {}

function handleClick(e: MouseEvent) {
  props.onClick?.(e)
}
</script>

<style lang="scss" scoped>
.p-button {
  cursor: pointer;
  height: 34px;
  font-size: 14px;
  background-color: var(--p-color);
  color: #fff;
  transition: background-color 0.25s, color 0.25s;
  border: 0;
  border-radius: 3px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover, &:focus {
    background-color: var(--p-color-hover);
  }
  &:active {
    background-color: var(--p-color-pressed);
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    &:hover, &:focus {
      background-color: var(--p-color);
    }
    &:active {
      background-color: var(--p-color);
    }
  }
}

.p-loading-icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
}
</style>
