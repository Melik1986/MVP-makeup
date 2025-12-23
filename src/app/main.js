import '@/shared/styles/main.scss'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createApp } from 'vue'

import App from './App.vue'

gsap.registerPlugin(ScrollTrigger)

// Global GSAP & ScrollTrigger Configuration for Mobile Stability
ScrollTrigger.config({
  ignoreMobileResize: true, // Prevent intrusive refreshes on address bar toggle
  limitCallbacks: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' // Limit refresh events
})

// Scroll normalization is handled by Lenis now, but we keep basic config
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    ScrollTrigger.refresh(true)
  })
}

createApp(App).mount('#app')
