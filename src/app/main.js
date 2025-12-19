import '@/shared/styles/main.scss'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createApp } from 'vue'

import App from './App.vue'

// Global refresh on load to ensure ScrollTrigger calculates positions correctly
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    ScrollTrigger.refresh(true)
  })
}

createApp(App).mount('#app')
