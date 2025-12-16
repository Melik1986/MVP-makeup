import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

gsap.registerPlugin(ScrollTrigger)

export function useReviewsAnimation(sectionRef) {
  let ctx

  onMounted(() => {
    if (!sectionRef.value) return

    ctx = gsap.context(self => {
      // Mobile check (simple width check or matchMedia)
      const isMobile = window.innerWidth <= 768
      if (isMobile) return // Disable complex scroll animation on mobile

      const columnsDown = self.selector('.reviews__column--down')
      const columnUp = self.selector('.reviews__column--up')

      // Helper для валидации элементов
      const isValidElement = el => {
        if (!el) return false
        if (Array.isArray(el) || el instanceof NodeList) return el.length > 0
        return el.nodeType === 1 // Element node
      }

      // Animation: Parallax / Marquee on Scroll
      // Columns move in opposite directions as user scrolls down

      // Down columns: Move deeper down (y > 0) or actually, visual "flow" usually implies they move up naturally with scroll,
      // but we want to exaggerate or reverse.
      // Let's make:
      // Side columns (down) -> Move faster UP than scroll (or down relative to viewport?)
      // Center column (up) -> Move DOWN against scroll (creating slow motion or reverse effect)

      // Let's implement "Endless Flow" feeling
      // Side columns: y: -20% (move up slightly faster)
      // Center column: y: 20% (move down, resisting scroll)

      if (isValidElement(columnsDown)) {
        gsap.to(columnsDown, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1 // Smooth scrub
          }
        })
      }

      if (isValidElement(columnUp)) {
        gsap.to(columnUp, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }
    }, sectionRef.value)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
