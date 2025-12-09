<template>
  <div class="divider" :class="dividerClass">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="divider__svg">
      <path :d="path" :fill="fill" class="divider__path" />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'wave',
    validator: value => ['wave', 'curve'].includes(value)
  },
  fill: {
    type: String,
    default: '#FFFFFF'
  }
})

const path = computed(() => {
  if (props.variant === 'wave') {
    return 'M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z'
  }
  return 'M0,120 C300,60 600,80 900,40 C1050,20 1150,60 1200,40 L1200,120 L0,120 Z'
})

const dividerClass = computed(() => ({
  [`divider--${props.variant}`]: true
}))
</script>

<style scoped lang="scss">
.divider {
  width: 100%;
  height: 120px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.divider__svg {
  width: 100%;
  height: 100%;
  display: block;
}

.divider__path {
  transition: fill 0.3s ease;
}
</style>
