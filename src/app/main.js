import '@/shared/styles/main.scss'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createApp } from 'vue'

import App from './App.vue'

gsap.registerPlugin(ScrollTrigger)

// Global GSAP & ScrollTrigger Configuration for Mobile Stability
ScrollTrigger.config({
  ignoreMobileResize: true, // Prevent intrusive refreshes on address bar toggle
  limitCallbacks: true
})

// Normalize scroll for touch devices to eliminate jitter/backlash
if (ScrollTrigger.isTouch) {
  ScrollTrigger.normalizeScroll({
    allowNestedScroll: true,
    momentum: false // Purely scroll-driven
  })
}

// Global refresh on load to ensure ScrollTrigger calculates positions correctly
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    ScrollTrigger.refresh(true)
  })
}

createApp(App).mount('#app')
