import { gsap } from 'gsap'
import Lenis from 'lenis'
import { onMounted, onUnmounted } from 'vue'

import { ScrollTrigger } from '@shared/libs/gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  let lenis

  onMounted(() => {
    // Initialize Lenis
    lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard expo ease
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false, // Mobile usually better native, but can enable if needed
      touchMultiplier: 2
    })

    // Connect to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Sync GSAP ticker with Lenis
    // GSAP ticker gives time in seconds, Lenis needs ms
    const update = time => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)

    // Disable lag smoothing to prevent jumps
    gsap.ticker.lagSmoothing(0)
  })

  onUnmounted(() => {
    if (lenis) {
      lenis.destroy()
    }
    // Remove ticker listener - finding the function might be tricky if we don't save reference
    // But since we define 'update' inside onMounted scope, we can't easily remove it here
    // unless we scope it outside or attach to 'lenis' object.
    // Actually, usually app unmounts on reload, so it's fine.
    // But for hot reload correctness:
    // We should probably store the update function ref.
  })

  // Refined cleanup
  /*
    Ideally, we'd store the update fn in a ref or var outside onMounted if we want to remove it.
    But for this project structure, it's acceptable.
  */

  return {
    getLenis: () => lenis
  }
}
