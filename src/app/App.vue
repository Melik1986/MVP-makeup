<template>
  <LandingPage />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

import LandingPage from '@pages/LandingPage.vue'
import { useSmoothScroll } from '@shared/libs/lenis/useSmoothScroll'
import { startScrollTriggerMonitoring, stopScrollTriggerMonitoring } from '@shared/libs/logger'

useSmoothScroll()

// Включаем мониторинг ScrollTrigger'ов в dev режиме для диагностики
if (import.meta.env.DEV) {
  onMounted(() => {
    // Небольшая задержка чтобы все ScrollTrigger'ы успели инициализироваться
    setTimeout(() => {
      startScrollTriggerMonitoring()
    }, 1000)
  })

  onUnmounted(() => {
    stopScrollTriggerMonitoring()
  })
}
</script>

<style scoped></style>
