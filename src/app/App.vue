<template>
  <LandingPage />
</template>

<script setup>
import LandingPage from '@pages/LandingPage.vue'
import { useSmoothScroll } from '@shared/libs/lenis/useSmoothScroll'

useSmoothScroll()
</script>

<style scoped></style>
